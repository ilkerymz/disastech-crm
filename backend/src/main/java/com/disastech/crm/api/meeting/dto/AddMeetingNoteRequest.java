package com.disastech.crm.api.meeting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AddMeetingNoteRequest {
    @NotBlank
    @Size(max = 2000)
    public String note;
}
