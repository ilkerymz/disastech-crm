package com.disastech.crm.api.meeting;

import com.disastech.crm.api.meeting.dto.*;
import com.disastech.crm.application.meeting.MeetingNoteService;
import com.disastech.crm.application.meeting.MeetingService;
import com.disastech.crm.domain.meeting.MeetingEntity;
import com.disastech.crm.domain.meeting.MeetingNoteEntity;
import com.disastech.crm.domain.repository.MeetingNoteRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    private final MeetingService meetingService;
    private final MeetingNoteService meetingNoteService;
    private final MeetingNoteRepository meetingNoteRepository;

    public MeetingController(MeetingService meetingService, MeetingNoteService meetingNoteService, MeetingNoteRepository meetingNoteRepository) {
        this.meetingService = meetingService;
        this.meetingNoteService = meetingNoteService;
        this.meetingNoteRepository = meetingNoteRepository;
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
                request.outcome,
                request.nextAction,
                request.salesStatus,
                request.salesStage,
                request.offerAmount,
                request.lastMeetingDate,
                request.lossReason
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
                request.outcome,
                request.nextAction,
                request.salesStatus,
                request.salesStage,
                request.offerAmount,
                request.lastMeetingDate,
                request.lossReason
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
    public void sendInvite(@PathVariable UUID id, String description) {
        meetingService.sendMeetingInvite(id, description);
    }

    // INVITE PREVIEW
    @GetMapping("/{id}/invite-preview")
    public MeetingInvitePreviewResponse invitePreview(@PathVariable UUID id) {
        return meetingService.getInvitePreview(id);
    }

    @GetMapping("/{id}/notes")
    public List<MeetingNoteResponse> getNotes(@PathVariable UUID id) {
        return meetingNoteService.getNotes(id).stream()
                .map(this::toNoteResponse)
                .toList();
    }

    @PostMapping("/{id}/notes")
    public MeetingNoteResponse addNote(@PathVariable UUID id,
                                       @Valid @RequestBody AddMeetingNoteRequest request) {
        MeetingNoteEntity saved = meetingNoteService.addNote(id, request.note);
        return toNoteResponse(saved);
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
        r.mailStatus = entity.getMailStatus();
        r.subject = entity.getSubject();
        r.salesStatus = entity.getSalesStatus();
        r.salesStage = entity.getSalesStage();
        r.offerAmount = entity.getOfferAmount();
        r.lastMeetingDate = entity.getLastMeetingDate();
        r.lossReason = entity.getLossReason();
        r.noteCount = meetingNoteRepository.countByMeetingIdAndDeletedFalse(entity.getId());
        r.latestNote = meetingNoteRepository
                .findFirstByMeetingIdAndDeletedFalseOrderByCreatedAtDesc(entity.getId())
                .map(MeetingNoteEntity::getNote)
                .orElse(null);


        return r;
    }

    private MeetingNoteResponse toNoteResponse(MeetingNoteEntity e) {
        MeetingNoteResponse r = new MeetingNoteResponse();
        r.id = e.getId();
        r.note = e.getNote();
        r.createdAt = e.getCreatedAt();
        r.createdByName = e.getCreatedBy() != null ? e.getCreatedBy().getFullName() : null;
        return r;
    }
}
