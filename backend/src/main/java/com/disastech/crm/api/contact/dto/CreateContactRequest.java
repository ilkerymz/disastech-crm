package com.disastech.crm.api.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateContactRequest {

    @NotNull(message = "accountId is required")
    public UUID accountId;

    @NotBlank(message = "fullName is required")
    @Size(max = 255)
    public String fullName;

    @Email(message = "email must be valid")
    @Size(max = 255)
    public String email;

}
