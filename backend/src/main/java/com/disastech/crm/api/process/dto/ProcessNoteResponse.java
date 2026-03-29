package com.disastech.crm.api.process.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ProcessNoteResponse {
    public UUID id;
    public String note;
    public LocalDateTime createdAt;
    public String createdByName;
    public Boolean isNegativeReason;

}
