package com.disastech.crm.application.meeting;

import com.disastech.crm.api.meeting.dto.MeetingInvitePreviewResponse;
import com.disastech.crm.domain.meeting.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface MeetingService {

    MeetingEntity createMeeting(
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


    );

    MeetingEntity updateMeeting(
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
    );

    void cancelMeeting(UUID meetingId);

    List<MeetingEntity> getMeetingsForOwner(
            UUID ownerUserId
    );

    List<MeetingEntity> getAllMeetings();
    void sendMeetingInvite(UUID meetingId, String description);
    MeetingInvitePreviewResponse getInvitePreview(UUID meetingId);

}
