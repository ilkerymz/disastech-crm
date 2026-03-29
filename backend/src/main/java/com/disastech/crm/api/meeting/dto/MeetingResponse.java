package com.disastech.crm.api.meeting.dto;

import com.disastech.crm.domain.meeting.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class MeetingResponse {

    public UUID id;
    public UUID accountId;
    public UUID ownerUserId;
    public UUID contactId;
    public String accountName;
    public String contactName;
    public String contactTitle;
    public String industry;
    public String accountStatus;
    public String userName;
    public LocalDateTime start;
    public LocalDateTime end;
    public String status;
    public String subject;
    public String notes;
    public MailStatus mailStatus;
    public List<MeetingAttendeeResponse> attendees;

}
