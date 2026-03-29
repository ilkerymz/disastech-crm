package com.disastech.crm.api.process;

import com.disastech.crm.api.process.dto.*;
import com.disastech.crm.application.process.ProcessNoteService;
import com.disastech.crm.application.process.ProcessService;
import com.disastech.crm.domain.process.SalesProcessEntity;
import com.disastech.crm.domain.process.SalesProcessNoteEntity;
import com.disastech.crm.domain.repository.SalesProcessNoteRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/processes")
public class ProcessController {

    private final ProcessService processService;
    private final ProcessNoteService processNoteService;
    private final SalesProcessNoteRepository salesProcessNoteRepository;

    public ProcessController(ProcessService processService,
                             ProcessNoteService processNoteService,
                             SalesProcessNoteRepository salesProcessNoteRepository) {
        this.processService = processService;
        this.processNoteService = processNoteService;
        this.salesProcessNoteRepository = salesProcessNoteRepository;
    }

    @GetMapping
    public List<ProcessResponse> list() {
        return processService.getAllProcesses().stream().map(this::toResponse).toList();
    }

    @PutMapping("/{id}")
    public ProcessResponse update(@PathVariable UUID id,
                                  @RequestBody UpdateProcessRequest request) {
        SalesProcessEntity entity = processService.updateProcess(
                id,
                request.salesStage,
                request.accountStatus,
                request.estimatedValue,
                request.nextAction,
                request.nextActionDate,
                request.estimatedCurrency
        );
        return toResponse(entity);
    }

    @GetMapping("/{id}/notes")
    public List<ProcessNoteResponse> getNotes(@PathVariable UUID id) {
        return processNoteService.getNotes(id).stream().map(this::toNoteResponse).toList();
    }

    @PostMapping("/{id}/notes")
    public ProcessNoteResponse addNote(@PathVariable UUID id,
                                       @Valid @RequestBody AddProcessNoteRequest request) {
        return toNoteResponse(processNoteService.addNote(id, request.note, request.isNegativeReason));
    }

    private ProcessResponse toResponse(SalesProcessEntity entity) {
        ProcessResponse r = new ProcessResponse();
        SalesProcessNoteEntity latestNote = salesProcessNoteRepository
                .findFirstBySalesProcessIdAndDeletedFalseOrderByCreatedAtDesc(entity.getId())
                .orElse(null);

        r.id = entity.getId();
        r.accountId = entity.getAccount().getId();
        r.accountName = entity.getAccount().getName();
        r.salesStage = entity.getSalesStage();
        r.accountStatus = entity.getAccount().getStatus().toString();
        r.estimatedValue = entity.getEstimatedAmount();
        r.estimatedCurrency = entity.getEstimatedCurrency();
        r.lastMeetingDate = entity.getLastMeetingDate();
        r.nextAction = entity.getNextAction();
        r.nextActionDate = entity.getNextActionDate();
        r.latestNote = latestNote != null ? latestNote.getNote() : entity.getCurrentNote();
        r.latestNoteIsNegativeReason = latestNote != null && latestNote.isNegativeReason();
        r.updatedAt = entity.getUpdatedAt();
        r.noteCount = salesProcessNoteRepository.countBySalesProcessIdAndDeletedFalse(entity.getId());
        r.responsibleUserName = entity.getAccount().getResponsibleUser() != null
                ? entity.getAccount().getResponsibleUser().getFullName()
                : null;
        return r;
    }

    private ProcessNoteResponse toNoteResponse(SalesProcessNoteEntity e) {
        ProcessNoteResponse r = new ProcessNoteResponse();
        r.id = e.getId();
        r.note = e.getNote();
        r.isNegativeReason = e.isNegativeReason();
        r.createdAt = e.getCreatedAt();
        r.createdByName = e.getCreatedBy() != null ? e.getCreatedBy().getFullName() : null;

        return r;
    }
}
