package com.disastech.crm.application.meeting;

import com.disastech.crm.api.meeting.dto.MeetingInvitePreviewResponse;
import com.disastech.crm.application.process.ProcessService;
import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.contact.ContactEntity;
import com.disastech.crm.domain.meeting.MeetingAttendeeEntity;
import com.disastech.crm.domain.meeting.MeetingAttendeeType;
import com.disastech.crm.domain.meeting.MailStatus;
import com.disastech.crm.domain.meeting.MeetingEntity;
import com.disastech.crm.domain.repository.AccountRepository;
import com.disastech.crm.domain.repository.ContactRepository;
import com.disastech.crm.domain.repository.MeetingRepository;
import com.disastech.crm.domain.repository.UserRepository;
import com.disastech.crm.domain.user.UserEntity;
import com.disastech.crm.infrastructure.google.GoogleCalendarService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class MeetingServiceImpl implements MeetingService {

    private final AccountRepository accountRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final MeetingRepository meetingRepository;
    private final GoogleCalendarService googleCalendarService;
    private final ProcessService processService;
    private static final Logger log = LoggerFactory.getLogger(MeetingServiceImpl.class);

    public MeetingServiceImpl(
            AccountRepository accountRepository,
            ContactRepository contactRepository,
            UserRepository userRepository,
            MeetingRepository meetingRepository,
            GoogleCalendarService googleCalendarService,
            ProcessService processService
    ) {
        this.accountRepository = accountRepository;
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.meetingRepository = meetingRepository;
        this.googleCalendarService = googleCalendarService;
        this.processService = processService;
    }

    @Override
    public MeetingEntity createMeeting(
            UUID accountId,
            UUID contactId,
            UUID ownerUserId,
            LocalDateTime start,
            LocalDateTime end,
            String subject,
            String notes
    ) {
        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        UserEntity owner = userRepository.findById(ownerUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        ContactEntity contact = null;
        if (contactId != null) {
            contact = contactRepository.findById(contactId)
                    .orElseThrow(() -> new EntityNotFoundException("Contact not found"));
        }

        MeetingEntity meeting = new MeetingEntity();
        meeting.setAccount(account);
        meeting.setOwner(owner);
        meeting.setContact(contact);
        meeting.setMeetingStart(start);
        meeting.setMeetingEnd(end);
        meeting.setStatus("PLANNED");
        meeting.setDeleted(false);
        meeting.setSubject(subject);
        meeting.setNotes(notes);

        MeetingEntity saved = meetingRepository.save(meeting);
        addOwnerAttendee(saved, owner, true);

        if (contact != null) {
            addContactAttendee(saved, contact, true);
        }

        saved = meetingRepository.save(saved);

        processService.syncLastMeetingDate(
                saved.getAccount().getId(),
                saved.getMeetingStart().toLocalDate()
        );

        try {
            String eventId = googleCalendarService.createEventSilently(saved);
            saved.setGoogleEventId(eventId);
            saved.setMailStatus(MailStatus.NOT_SENT);
            saved = meetingRepository.save(saved);
        } catch (Exception e) {
            log.error("Google Calendar event oluşturulamadı", e);
        }

        return saved;
    }

    @Override
    @Transactional
    public MeetingEntity updateMeeting(
            UUID meetingId,
            LocalDateTime start,
            LocalDateTime end,
            String status,
            String subject,
            String notes
    ) {
        MeetingEntity meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        if (start != null) meeting.setMeetingStart(start);
        if (end != null) meeting.setMeetingEnd(end);
        if (status != null) meeting.setStatus(status);
        if (subject != null) meeting.setSubject(subject);
        meeting.setNotes(notes);

        MeetingEntity saved = meetingRepository.save(meeting);

        processService.syncLastMeetingDate(
                saved.getAccount().getId(),
                saved.getMeetingStart().toLocalDate()
        );

        try {
            googleCalendarService.updateEvent(saved);
        } catch (Exception e) {
            log.error("Google Calendar event update failed", e);
        }

        return saved;
    }

    @Override
    @Transactional
    public void sendMeetingInvite(
            UUID meetingId,
            String description,
            List<UUID> additionalContactIds,
            List<UUID> additionalUserIds,
            List<String> manualEmails
    ) {
        MeetingEntity meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        if (meeting.getMailStatus() == MailStatus.SENT) {
            throw new IllegalStateException("Mail zaten gönderilmiş");
        }

        List<ContactEntity> additionalContacts = contactRepository.findAllById(
                additionalContactIds == null ? List.of() : additionalContactIds
        );

        for (ContactEntity contact : additionalContacts) {
            if (!contact.getAccount().getId().equals(meeting.getAccount().getId())) {
                throw new IllegalArgumentException("Contact meeting account ile uyusmuyor");
            }
            addContactAttendee(meeting, contact, false);
        }

        List<UserEntity> additionalUsers = userRepository.findAllById(
                additionalUserIds == null ? List.of() : additionalUserIds
        );

        for (UserEntity user : additionalUsers) {
            addUserAttendee(meeting, user, false);
        }

        for (String email : manualEmails == null ? List.<String>of() : manualEmails) {
            addManualAttendee(meeting, email, false);
        }

        MeetingEntity saved = meetingRepository.save(meeting);

        try {
            googleCalendarService.sendInvite(saved, description, saved.getAttendees());
            saved.setMailStatus(MailStatus.SENT);
            saved.setMailSentAt(LocalDateTime.now());
            saved.setMailSentByUserId(getCurrentUserId());
            meetingRepository.save(saved);
        } catch (Exception e) {
            log.error("Meeting invite mail gönderilemedi", e);
            throw new RuntimeException("Mail gönderilemedi");
        }
    }

    private UUID getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"))
                .getId();
    }

    private void addOwnerAttendee(MeetingEntity meeting, UserEntity user, boolean isPrimary) {
        if (meeting.getAttendees().stream().anyMatch(a ->
                a.getUser() != null && a.getUser().getId().equals(user.getId())
        )) {
            return;
        }

        MeetingAttendeeEntity attendee = new MeetingAttendeeEntity();
        attendee.setMeeting(meeting);
        attendee.setAttendeeType(MeetingAttendeeType.OWNER);
        attendee.setUser(user);
        attendee.setEmail(user.getEmail());
        attendee.setDisplayName(user.getFullName());
        attendee.setPrimary(isPrimary);
        meeting.getAttendees().add(attendee);
    }

    private void addUserAttendee(MeetingEntity meeting, UserEntity user, boolean isPrimary) {
        if (meeting.getAttendees().stream().anyMatch(a ->
                a.getUser() != null && a.getUser().getId().equals(user.getId())
        )) {
            return;
        }

        MeetingAttendeeEntity attendee = new MeetingAttendeeEntity();
        attendee.setMeeting(meeting);
        attendee.setAttendeeType(MeetingAttendeeType.USER);
        attendee.setUser(user);
        attendee.setEmail(user.getEmail());
        attendee.setDisplayName(user.getFullName());
        attendee.setPrimary(isPrimary);
        meeting.getAttendees().add(attendee);
    }

    private void addContactAttendee(MeetingEntity meeting, ContactEntity contact, boolean isPrimary) {
        if (meeting.getAttendees().stream().anyMatch(a ->
                a.getContact() != null && a.getContact().getId().equals(contact.getId())
        )) {
            return;
        }

        MeetingAttendeeEntity attendee = new MeetingAttendeeEntity();
        attendee.setMeeting(meeting);
        attendee.setAttendeeType(MeetingAttendeeType.CONTACT);
        attendee.setContact(contact);
        attendee.setEmail(contact.getEmail());
        attendee.setDisplayName(contact.getFullName());
        attendee.setPrimary(isPrimary);
        meeting.getAttendees().add(attendee);
    }

    private void addManualAttendee(MeetingEntity meeting, String email, boolean isPrimary) {
        if (email == null) {
            return;
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail.isBlank()) {
            return;
        }

        if (meeting.getAttendees().stream().anyMatch(a ->
                a.getEmail() != null && a.getEmail().equalsIgnoreCase(normalizedEmail)
        )) {
            return;
        }

        MeetingAttendeeEntity attendee = new MeetingAttendeeEntity();
        attendee.setMeeting(meeting);
        attendee.setAttendeeType(MeetingAttendeeType.MANUAL);
        attendee.setEmail(normalizedEmail);
        attendee.setDisplayName(normalizedEmail);
        attendee.setPrimary(isPrimary);
        meeting.getAttendees().add(attendee);
    }

    @Override
    @Transactional
    public void cancelMeeting(UUID meetingId) {
        MeetingEntity meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        meeting.setDeleted(true);
        meeting.setStatus("CANCELLED");
        meetingRepository.save(meeting);

        try {
            googleCalendarService.deleteEvent(meeting);
        } catch (Exception e) {
            log.error("Google Calendar event delete failed", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<MeetingEntity> getMeetingsForOwner(UUID ownerUserId) {
        UserEntity owner = userRepository.findById(ownerUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return meetingRepository.findByOwnerAndMeetingStartBetweenAndDeletedFalse(
                owner,
                LocalDateTime.now().minusYears(1),
                LocalDateTime.now().plusYears(1)
        );
    }

    @Override
    public List<MeetingEntity> getAllMeetings() {
        return meetingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public MeetingInvitePreviewResponse getInvitePreview(UUID meetingId) {
        MeetingEntity meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        String ownerName = meeting.getOwner().getFullName();
        String ownerEmail = meeting.getOwner().getEmail();

        String subject = meeting.getSubject() != null
                ? meeting.getSubject() + " – " + ownerName
                : "Toplantı – " + ownerName;

        String description =
                "Bu toplantı " + ownerName + " (" + ownerEmail + ") tarafından planlanmıştır.";

        List<String> recipients = new java.util.ArrayList<>();
        meeting.getAttendees().stream()
                .map(MeetingAttendeeEntity::getEmail)
                .filter(email -> email != null && !email.isBlank())
                .distinct()
                .forEach(recipients::add);

        if (recipients.isEmpty()) {
            recipients.add(ownerEmail);
            if (meeting.getContact() != null && meeting.getContact().getEmail() != null) {
                recipients.add(meeting.getContact().getEmail());
            }
        }

        MeetingInvitePreviewResponse r = new MeetingInvitePreviewResponse();
        r.subject = subject;
        r.description = description;
        r.recipients = recipients;
        return r;
    }
}
