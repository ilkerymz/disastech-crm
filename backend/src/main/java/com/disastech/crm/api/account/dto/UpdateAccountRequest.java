package com.disastech.crm.api.account.dto;

import com.disastech.crm.api.account.AccountStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateAccountRequest {

    @Size(max = 255)
    public String industry;

    @NotNull(message = "Account status is required")
    public AccountStatus status;
}
