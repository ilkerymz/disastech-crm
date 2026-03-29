package com.disastech.crm.api.process.dto;

import jakarta.validation.constraints.NotBlank;

public class AddProcessNoteRequest {
    @NotBlank
    public String note;

    public Boolean isNegativeReason;
}
