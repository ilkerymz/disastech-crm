package com.disastech.crm.application.meeting;

import com.disastech.crm.api.meeting.dto.MeetingInvitePreviewResponse;
import com.disastech.crm.domain.meeting.*;

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
            String notes


    );

    MeetingEntity updateMeeting(
            UUID meetingId,
            LocalDateTime start,
            LocalDateTime end,
            String status,
            String subject,
            String notes
    );

    void cancelMeeting(UUID meetingId);

    List<MeetingEntity> getMeetingsForOwner(
            UUID ownerUserId
    );

    List<MeetingEntity> getAllMeetings();

    MeetingInvitePreviewResponse getInvitePreview(UUID meetingId);

    void sendMeetingInvite(
            UUID meetingId,
            String description,
            List<UUID> additionalContactIds,
            List<UUID> additionalUserIds,
            List<String> manualEmails
    );

}
