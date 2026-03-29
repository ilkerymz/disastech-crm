package com.disastech.crm.api.meeting;

import com.disastech.crm.api.meeting.dto.*;
import com.disastech.crm.application.meeting.MeetingService;
import com.disastech.crm.domain.meeting.MeetingAttendeeEntity;
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
                request.subject,
                request.notes
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
                request.status,
                request.subject,
                request.notes
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
    public void sendInvite(@PathVariable UUID id, @RequestBody(required = false) SendMeetingInviteRequest request) {
        meetingService.sendMeetingInvite(
                id,
                request != null ? request.description : null,
                request != null ? request.additionalContactIds : List.of(),
                request != null ? request.additionalUserIds : List.of(),
                request != null ? request.manualEmails : List.of()
        );
    }

    // INVITE PREVIEW
    @GetMapping("/{id}/invite-preview")
    public MeetingInvitePreviewResponse invitePreview(@PathVariable UUID id) {
        return meetingService.getInvitePreview(id);
    }


    private MeetingAttendeeResponse toAttendeeResponse(MeetingAttendeeEntity entity) {
        MeetingAttendeeResponse r = new MeetingAttendeeResponse();
        r.id = entity.getId();
        r.attendeeType = entity.getAttendeeType();
        r.userId = entity.getUser() != null ? entity.getUser().getId() : null;
        r.contactId = entity.getContact() != null ? entity.getContact().getId() : null;
        r.email = entity.getEmail();
        r.displayName = entity.getDisplayName();
        r.isPrimary = entity.isPrimary();
        return r;
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
        r.contactTitle = entity.getContact() != null ? entity.getContact().getTitle() : null;
        r.industry = entity.getAccount().getIndustry();
        r.accountStatus = entity.getAccount().getStatus().toString();
        r.userName = entity.getOwner().getFullName();

        r.start = entity.getMeetingStart();
        r.end = entity.getMeetingEnd();
        r.status = entity.getStatus();
        r.notes = entity.getNotes();
        r.mailStatus = entity.getMailStatus();
        r.subject = entity.getSubject();
        r.attendees = entity.getAttendees().stream().map(this::toAttendeeResponse).toList();


        return r;
    }

}
