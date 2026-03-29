package com.disastech.crm.application.process;

import com.disastech.crm.api.account.AccountStatus;
import com.disastech.crm.domain.meeting.SalesStage;
import com.disastech.crm.domain.process.SalesProcessEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ProcessService {
    List<SalesProcessEntity> getAllProcesses();
    SalesProcessEntity updateProcess(UUID processId, SalesStage salesStage, AccountStatus accountStatus,
                                     BigDecimal estimatedValue, String nextAction, LocalDate nextActionDate,
                                     String estimatedCurrency);
    SalesProcessEntity createForAccount(UUID accountId);
    SalesProcessEntity getByAccountId(UUID accountId);
    void syncLastMeetingDate(UUID accountId, LocalDate lastMeetingDate);
    void deleteByAccountId(UUID accountId);
}
