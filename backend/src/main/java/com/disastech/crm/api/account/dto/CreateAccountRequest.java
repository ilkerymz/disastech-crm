package com.disastech.crm.api.account.dto;

import com.disastech.crm.api.account.AccountStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateAccountRequest {

    @NotBlank(message = "Account name is required")
    @Size(max = 255)
    public String name;

    @Size(max = 255)
    public String industry;

    @NotNull(message = "Account status is required")
    public AccountStatus status;
}
