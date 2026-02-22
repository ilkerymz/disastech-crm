package com.disastech.crm.infrastructure.google;

import com.disastech.crm.domain.meeting.MeetingEntity;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Service
public class GoogleCalendarService {

    private static final Logger log = LoggerFactory.getLogger(GoogleCalendarService.class);

    private final Resource credentialsFile;
    private final String applicationName;
    private final String calendarId;

    public GoogleCalendarService(
            @Value("${google.calendar.credentials-file}") Resource credentialsFile,
            @Value("${google.calendar.application-name}") String applicationName,
            @Value("${google.calendar.id}") String calendarId
    ) {
        this.credentialsFile = credentialsFile;
        this.applicationName = applicationName;
        this.calendarId = calendarId;
    }

    // =========================================================
    // PUBLIC API
    // =========================================================

    /**
     * 🔕 Sessiz event oluşturur (attendees YOK, mail YOK)
     */
    public String createEventSilently(MeetingEntity meeting) throws Exception {

        Calendar calendar = calendarForUser(meeting.getOwner().getEmail());

        Event event = buildEventFromMeeting(meeting, false); // ❌ attendees yok

        Event createdEvent = calendar.events()
                .insert(calendarId, event)
                .setSendUpdates("none")
                .execute();

        log.info("Google Calendar event created silently. id={}", createdEvent.getId());

        return createdEvent.getId();
    }

    /**
     * 📧 İLK DAVETİYEYİ GÖNDERİR
     * Attendees burada İLK KEZ eklenir
     */
    public void sendInvite(MeetingEntity meeting, String description) throws Exception {

        if (meeting.getGoogleEventId() == null) {
            throw new IllegalStateException("Google event yok");
        }

        Calendar calendar = calendarForUser(meeting.getOwner().getEmail());

        Event event = calendar.events()
                .get(calendarId, meeting.getGoogleEventId())
                .execute();

        // 🔒 Eğer zaten attendees varsa → mail daha önce gitmiştir
        if (event.getAttendees() != null && !event.getAttendees().isEmpty()) {
            throw new IllegalStateException("Davetiye zaten gönderilmiş");
        }

        List<EventAttendee> attendees = new ArrayList<>();

        // Owner her zaman davetli
        attendees.add(new EventAttendee().setEmail(meeting.getOwner().getEmail()));

        // Contact varsa ekle
        if (meeting.getContact() != null && meeting.getContact().getEmail() != null) {
            attendees.add(new EventAttendee().setEmail(meeting.getContact().getEmail()));
        }

        event.setAttendees(attendees);

        String eventDescFooter = event.getDescription();
        String eventFinalDesc = description + "\n\n" + eventDescFooter;

        event.setDescription(eventFinalDesc);

        calendar.events()
                .update(calendarId, meeting.getGoogleEventId(), event)
                .setSendUpdates("all") // ✅ İLK DAVET
                .execute();

        log.info("Google Calendar invite sent. eventId={}, attendees={}",
                meeting.getGoogleEventId(), attendees);
    }

    /**
     * ✏️ Event bilgilerini günceller (MAIL GÖNDERMEZ)
     */
    public void updateEvent(MeetingEntity meeting) throws Exception {

        if (meeting.getGoogleEventId() == null) {
            String eventId = createEventSilently(meeting);
            meeting.setGoogleEventId(eventId);
            return;
        }

        Calendar calendar = calendarForUser(meeting.getOwner().getEmail());

        Event event = buildEventFromMeeting(meeting, false); // ❌ attendees dokunma

        calendar.events()
                .update(calendarId, meeting.getGoogleEventId(), event)
                .setSendUpdates("none")
                .execute();
    }

    /**
     * 🗑️ Event siler (MAIL YOK)
     */
    public void deleteEvent(MeetingEntity meeting) throws Exception {

        if (meeting.getGoogleEventId() == null) {
            return;
        }

        Calendar calendar = calendarForUser(meeting.getOwner().getEmail());

        calendar.events()
                .delete(calendarId, meeting.getGoogleEventId())
                .setSendUpdates("none")
                .execute();
    }

    // =========================================================
    // INTERNAL HELPERS
    // =========================================================

    /**
     * 🔑 Domain Wide Delegation ile user adına Calendar client üretir
     */
    private Calendar calendarForUser(String userEmail) throws Exception {

        GoogleCredentials credentials = GoogleCredentials
                .fromStream(credentialsFile.getInputStream())
                .createScoped(Collections.singleton(CalendarScopes.CALENDAR))
                .createDelegated(userEmail);

        return new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials)
        )
                .setApplicationName(applicationName)
                .build();
    }

    /**
     * MeetingEntity → Google Event mapping
     */
    private Event buildEventFromMeeting(MeetingEntity meeting, boolean includeAttendees) {

        String ownerName = meeting.getOwner().getFullName();
        String ownerEmail = meeting.getOwner().getEmail();

        String summary = meeting.getSubject() != null
                ? meeting.getSubject() + " – " + ownerName
                : "Toplantı – " + ownerName;

        String description =
                "Bu toplantı " + ownerName + " (" + ownerEmail + ") tarafından planlanmıştır.";


        Event event = new Event()
                .setSummary(summary)
                .setDescription(description);

        DateTime start = new DateTime(
                Date.from(meeting.getMeetingStart()
                        .atZone(ZoneId.of("Europe/Istanbul"))
                        .toInstant())
        );

        DateTime end = new DateTime(
                Date.from(meeting.getMeetingEnd()
                        .atZone(ZoneId.of("Europe/Istanbul"))
                        .toInstant())
        );

        event.setStart(new EventDateTime().setDateTime(start));
        event.setEnd(new EventDateTime().setDateTime(end));

        // ⚠️ Attendees sadece DAVETİYE GÖNDERİRKEN
        if (includeAttendees) {
            List<EventAttendee> attendees = new ArrayList<>();
            attendees.add(new EventAttendee().setEmail(ownerEmail));

            if (meeting.getContact() != null && meeting.getContact().getEmail() != null) {
                attendees.add(new EventAttendee().setEmail(meeting.getContact().getEmail()));
            }

            event.setAttendees(attendees);
        }

        return event;
    }
}
