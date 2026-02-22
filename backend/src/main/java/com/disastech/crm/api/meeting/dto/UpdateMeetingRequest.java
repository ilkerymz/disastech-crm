package com.disastech.crm.api.meeting.dto;

import com.disastech.crm.domain.meeting.LossReason;
import com.disastech.crm.domain.meeting.MeetingOutcome;
import com.disastech.crm.domain.meeting.SalesStage;
import com.disastech.crm.domain.meeting.SalesStatus;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class UpdateMeetingRequest {

    public LocalDateTime start;
    public LocalDateTime end;

    public String status;

    @Size(max = 255)
    public String subject;

    public MeetingOutcome outcome;

    @Size(max = 255)
    public String nextAction;

    public SalesStatus salesStatus;

    public SalesStage salesStage;
    public BigDecimal offerAmount;

    public LocalDate lastMeetingDate;

    public LossReason lossReason;
}
