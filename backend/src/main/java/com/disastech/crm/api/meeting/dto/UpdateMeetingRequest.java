package com.disastech.crm.api.meeting.dto;

import java.time.LocalDateTime;

public class UpdateMeetingRequest {

    public LocalDateTime start;
    public LocalDateTime end;
    public String subject;
    public String status;
    public String notes;

}
