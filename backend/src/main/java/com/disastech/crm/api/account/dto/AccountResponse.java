package com.disastech.crm.api.account.dto;

import com.disastech.crm.api.account.AccountStatus;
import jakarta.validation.constraints.Email;

import java.util.UUID;

public class AccountResponse {
    public UUID id;
    public String name;
    public  String industry;
    public boolean active;
    public AccountStatus status;
    public UUID responsibleUserId;
    public String responsibleUserName;
    public String phone;
    @Email
    public String email;


}
