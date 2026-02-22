package com.disastech.crm.application.meeting;

import com.disastech.crm.api.meeting.dto.MeetingInvitePreviewResponse;
import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.contact.ContactEntity;
import com.disastech.crm.domain.meeting.*;
import com.disastech.crm.domain.repository.AccountRepository;
import com.disastech.crm.domain.repository.ContactRepository;
import com.disastech.crm.domain.repository.MeetingRepository;
import com.disastech.crm.domain.repository.UserRepository;
import com.disastech.crm.domain.user.UserEntity;
import com.disastech.crm.infrastructure.google.GoogleCalendarService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
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
    private static final Logger log = LoggerFactory.getLogger(MeetingServiceImpl.class);


    public MeetingServiceImpl(
            AccountRepository accountRepository,
            ContactRepository contactRepository,
            UserRepository userRepository,
            MeetingRepository meetingRepository,
            GoogleCalendarService googleCalendarService
    ) {
        this.accountRepository = accountRepository;
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.meetingRepository = meetingRepository;
        this.googleCalendarService = googleCalendarService;
    }

    @Override
    public MeetingEntity createMeeting(
            UUID accountId,
            UUID contactId,
            UUID ownerUserId,
            LocalDateTime start,
            LocalDateTime end,
            String subject,
            MeetingOutcome outcome,
            String nextAction,
            SalesStatus salesStatus,
            SalesStage salesStage,
            BigDecimal offerAmount,
            LocalDate lastMeetingDate,
            LossReason lossReason
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

        UserEntity user = userRepository
                .findByEmail(SecurityContextHolder.getContext()
                        .getAuthentication().getName())
                .orElseThrow();

        MeetingEntity meeting = new MeetingEntity();
        meeting.setAccount(account);
        meeting.setOwner(user);
        meeting.setContact(contact);
        meeting.setMeetingStart(start);
        meeting.setMeetingEnd(end);
        meeting.setStatus("PLANNED");
        meeting.setDeleted(false);
        meeting.setSubject(subject);
        meeting.setOutcome(outcome);
        meeting.setNextAction(nextAction);
        meeting.setSalesStatus(salesStatus);
        meeting.setSalesStage(salesStage);
        meeting.setOfferAmount(offerAmount);
        meeting.setLastMeetingDate(lastMeetingDate);
        meeting.setLossReason(lossReason);


        MeetingEntity meetingResponse = meetingRepository.save(meeting);

        try {
            String eventId = googleCalendarService.createEventSilently(meeting);
            meeting.setGoogleEventId(eventId);
            meeting.setMailStatus(MailStatus.NOT_SENT);
        } catch (Exception e) {
            log.error("Google Calendar event oluşturulamadı", e);
            // Şimdilik swallow ediyoruz (bilinçli)
        }


        return meetingResponse;

    }

    @Transactional
    public void sendMeetingInvite(UUID meetingId, String description) {

        MeetingEntity meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        if (meeting.getMailStatus() == MailStatus.SENT) {
            throw new IllegalStateException("Mail zaten gönderilmiş");
        }

        try {
            googleCalendarService.sendInvite(meeting, description);

            meeting.setMailStatus(MailStatus.SENT);
            meeting.setMailSentAt(LocalDateTime.now());
            meeting.setMailSentByUserId(getCurrentUserId());

            meetingRepository.save(meeting);

        } catch (Exception e) {
            log.error("Meeting invite mail gönderilemedi", e);
            throw new RuntimeException("Mail gönderilemedi");
        }
    }

    private UUID getCurrentUserId() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"))
                .getId();
    }



    @Override
    @Transactional
    public MeetingEntity updateMeeting(
            UUID meetingId,
            LocalDateTime start,
            LocalDateTime end,
            String status,
            String subject,
            MeetingOutcome outcome,
            String nextAction,
            SalesStatus salesStatus,
            SalesStage salesStage,
            BigDecimal offerAmount,
            LocalDate lastMeetingDate,
            LossReason lossReason
    ) {

        MeetingEntity meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        if (start != null) meeting.setMeetingStart(start);
        if (end != null) meeting.setMeetingEnd(end);
        if (status != null) meeting.setStatus(status);
        if (subject != null) meeting.setSubject(subject);
        if (outcome != null) meeting.setOutcome(outcome);
        if (nextAction != null) meeting.setNextAction(nextAction);
        if(salesStatus != null) meeting.setSalesStatus(salesStatus);
        if(salesStage != null) meeting.setSalesStage(salesStage);
        if(offerAmount != null) meeting.setOfferAmount(offerAmount);
        if(lastMeetingDate != null) meeting.setLastMeetingDate(lastMeetingDate);
        if(lossReason != null) meeting.setLossReason(lossReason);

        MeetingEntity saved = meetingRepository.save(meeting);

        // 🔥 GOOGLE CALENDAR SYNC (MAIL YOK)
        try {
            googleCalendarService.updateEvent(saved);
        } catch (Exception e) {
            log.error("Google Calendar event update failed", e);
            // DB doğru, Calendar geçici problem olabilir
        }

        return saved;
    }

    @Override
    @Transactional
    public void cancelMeeting(UUID meetingId) {

        MeetingEntity meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        meeting.setDeleted(true);
        meeting.setStatus("CANCELLED");

        meetingRepository.save(meeting);

        // 🔥 GOOGLE CALENDAR EVENT DELETE (MAIL YOK)
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
        recipients.add(ownerEmail);

        if (meeting.getContact() != null && meeting.getContact().getEmail() != null) {
            recipients.add(meeting.getContact().getEmail());
        }

        MeetingInvitePreviewResponse r = new MeetingInvitePreviewResponse();
        r.subject = subject;
        r.description = description;
        r.recipients = recipients;

        return r;
    }


}
