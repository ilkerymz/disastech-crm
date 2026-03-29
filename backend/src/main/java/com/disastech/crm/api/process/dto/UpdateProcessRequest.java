package com.disastech.crm.api.process.dto;

import com.disastech.crm.api.account.AccountStatus;
import com.disastech.crm.domain.meeting.SalesStage;

import java.math.BigDecimal;
import java.time.LocalDate;

public class UpdateProcessRequest {
    public SalesStage salesStage;
    public AccountStatus accountStatus;
    public BigDecimal estimatedValue;
    public String estimatedCurrency;
    public String nextAction;
    public LocalDate nextActionDate;
}
