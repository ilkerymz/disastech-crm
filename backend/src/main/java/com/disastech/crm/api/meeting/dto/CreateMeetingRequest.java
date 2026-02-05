package com.disastech.crm.api.meeting.dto;

import com.disastech.crm.domain.meeting.MeetingOutcome;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class CreateMeetingRequest {

    @NotNull(message = "accountId is required")
    public UUID accountId;

    public UUID contactId;

    @NotNull(message = "ownerUserId is required")
    public UUID ownerUserId;

    @NotNull(message = "start time is required")
    @Future(message = "start time must be in the future")
    public LocalDateTime start;

    @NotNull(message = "end time is required")
    public LocalDateTime end;

    @Size(max = 1000, message = "notes can be max 1000 characters")
    public String notes;

    @Size(max = 255)
    public String subject;

    public MeetingOutcome outcome;

    @Size(max = 255)
    public String nextAction;

    public LocalDate nextActionDate;
}