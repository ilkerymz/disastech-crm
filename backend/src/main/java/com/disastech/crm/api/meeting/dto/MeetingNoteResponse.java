package com.disastech.crm.api.meeting.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class MeetingNoteResponse {
    public UUID id;
    public String note;
    public LocalDateTime createdAt;
    public String createdByName;
}
