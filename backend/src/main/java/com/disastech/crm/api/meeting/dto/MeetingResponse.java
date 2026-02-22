package com.disastech.crm.api.meeting.dto;

import com.disastech.crm.domain.meeting.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class MeetingResponse {

    public UUID id;
    public UUID accountId;
    public UUID contactId;
    public UUID ownerUserId;

    public String accountName;
    public String contactName;
    public String industry;
    public String accountStatus;
    public String userName;

    public LocalDateTime start;
    public LocalDateTime end;
    public String status;
    public String notes;

    public String subject;
    public MeetingOutcome outcome;
    public String nextAction;
    public MailStatus mailStatus;
    public SalesStatus salesStatus;
    public SalesStage salesStage;
    public BigDecimal offerAmount;

    public LocalDate lastMeetingDate;

    public LossReason lossReason;
    public String latestNote;
    public Long noteCount;
}
