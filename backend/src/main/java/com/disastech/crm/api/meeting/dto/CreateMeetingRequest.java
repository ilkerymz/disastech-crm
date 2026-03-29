package com.disastech.crm.api.meeting.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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

    @Size(max = 255)
    public String subject;

    public String notes;



}