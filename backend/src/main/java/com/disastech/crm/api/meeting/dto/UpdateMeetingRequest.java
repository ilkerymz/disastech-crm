package com.disastech.crm.api.meeting.dto;

import com.disastech.crm.domain.meeting.MeetingOutcome;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UpdateMeetingRequest {

    public LocalDateTime start;
    public LocalDateTime end;

    @Size(max = 1000)
    public String notes;


    public String status;

    @Size(max = 255)
    public String subject;

    public MeetingOutcome outcome;

    @Size(max = 255)
    public String nextAction;

    public LocalDate nextActionDate;
}
