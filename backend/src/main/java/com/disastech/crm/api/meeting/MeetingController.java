package com.disastech.crm.api.meeting;

import com.disastech.crm.api.meeting.dto.CreateMeetingRequest;
import com.disastech.crm.api.meeting.dto.MeetingInvitePreviewResponse;
import com.disastech.crm.api.meeting.dto.MeetingResponse;
import com.disastech.crm.api.meeting.dto.UpdateMeetingRequest;
import com.disastech.crm.application.meeting.MeetingService;
import com.disastech.crm.domain.meeting.MeetingEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    // CREATE
    @PostMapping
    public MeetingResponse create(@Valid @RequestBody CreateMeetingRequest request) {

        MeetingEntity meeting = meetingService.createMeeting(
                request.accountId,
                request.contactId,
                request.ownerUserId,
                request.start,
                request.end,
                request.notes,
                request.subject,
                request.outcome,
                request.nextAction,
                request.nextActionDate
        );

        return toResponse(meeting);
    }

    // UPDATE
    @PutMapping("/{id}")
    public MeetingResponse update(
            @PathVariable UUID id,
            @RequestBody UpdateMeetingRequest request
    ) {

        MeetingEntity meeting = meetingService.updateMeeting(
                id,
                request.start,
                request.end,
                request.notes,
                request.status,
                request.subject,
                request.outcome,
                request.nextAction,
                request.nextActionDate
        );

        return toResponse(meeting);
    }

    // CANCEL (SOFT DELETE)
    @DeleteMapping("/{id}")
    public void cancel(@PathVariable UUID id) {
        meetingService.cancelMeeting(id);
    }

    // LIST BY OWNER
    @GetMapping
    public List<MeetingResponse> list(
            @RequestParam(required = false) UUID ownerId
    ) {
        List<MeetingEntity> meetings;

        if (ownerId != null) {
            meetings = meetingService.getMeetingsForOwner(ownerId);
        } else {
            meetings = meetingService.getAllMeetings();
        }

        return meetings.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/send-invite")
    public void sendInvite(@PathVariable UUID id) {
        meetingService.sendMeetingInvite(id);
    }

    // INVITE PREVIEW
    @GetMapping("/{id}/invite-preview")
    public MeetingInvitePreviewResponse invitePreview(@PathVariable UUID id) {
        return meetingService.getInvitePreview(id);
    }




    // ------------------------
    // MAPPING
    // ------------------------
    private MeetingResponse toResponse(MeetingEntity entity) {

        MeetingResponse r = new MeetingResponse();
        r.id = entity.getId();
        r.accountId = entity.getAccount().getId();
        r.ownerUserId = entity.getOwner().getId();
        r.contactId = entity.getContact() != null ? entity.getContact().getId() : null;
        r.accountName = entity.getAccount().getName();
        r.contactName = entity.getContact() != null ? entity.getContact().getFullName() : null;
        r.industry = entity.getAccount().getIndustry();
        r.accountStatus = entity.getAccount().getStatus().toString();
        r.nextAction = entity.getNextAction();
        r.userName = entity.getOwner().getFullName();

        r.start = entity.getMeetingStart();
        r.end = entity.getMeetingEnd();
        r.status = entity.getStatus();
        r.notes = entity.getNotes();
        r.nextActionDate = entity.getNextActionDate();
        r.mailStatus = entity.getMailStatus();
        r.subject = entity.getSubject();

        return r;
    }
}
