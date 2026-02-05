package com.disastech.crm.application.meeting;

import com.disastech.crm.api.meeting.dto.MeetingInvitePreviewResponse;
import com.disastech.crm.domain.meeting.MeetingEntity;
import com.disastech.crm.domain.meeting.MeetingOutcome;

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
            String notes,
            String subject,
            MeetingOutcome outcome,
            String nextAction,
            LocalDate nextActionDate
    );

    MeetingEntity updateMeeting(
            UUID meetingId,
            LocalDateTime start,
            LocalDateTime end,
            String notes,
            String status,
            String subject,
            MeetingOutcome outcome,
            String nextAction,
            LocalDate nextActionDate
    );

    void cancelMeeting(UUID meetingId);

    List<MeetingEntity> getMeetingsForOwner(
            UUID ownerUserId
    );

    List<MeetingEntity> getAllMeetings();
    void sendMeetingInvite(UUID meetingId);
    MeetingInvitePreviewResponse getInvitePreview(UUID meetingId);

}
