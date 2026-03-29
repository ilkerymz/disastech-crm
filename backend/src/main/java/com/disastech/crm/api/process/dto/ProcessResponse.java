package com.disastech.crm.api.process.dto;

import com.disastech.crm.domain.meeting.SalesStage;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class ProcessResponse {
    public UUID id;
    public UUID accountId;
    public String accountName;
    public SalesStage salesStage;
    public String accountStatus;
    public BigDecimal estimatedValue;
    public LocalDate lastMeetingDate;
    public String nextAction;
    public LocalDate nextActionDate;
    public String latestNote;
    public Boolean latestNoteIsNegativeReason;
    public String estimatedCurrency;
    public LocalDateTime updatedAt;
    public Long noteCount;
    public String responsibleUserName;


}
