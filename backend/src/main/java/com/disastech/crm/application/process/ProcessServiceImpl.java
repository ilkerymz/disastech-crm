package com.disastech.crm.application.process;

import com.disastech.crm.api.account.AccountStatus;
import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.meeting.SalesStage;
import com.disastech.crm.domain.process.SalesProcessEntity;
import com.disastech.crm.domain.repository.AccountRepository;
import com.disastech.crm.domain.repository.SalesProcessRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProcessServiceImpl implements ProcessService {

    private final SalesProcessRepository salesProcessRepository;
    private final AccountRepository accountRepository;

    public ProcessServiceImpl(SalesProcessRepository salesProcessRepository,
                              AccountRepository accountRepository) {
        this.salesProcessRepository = salesProcessRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesProcessEntity> getAllProcesses() {
        return salesProcessRepository.findByDeletedFalse();
    }

    @Override
    public SalesProcessEntity updateProcess(UUID processId, SalesStage salesStage, AccountStatus accountStatus,
                                            BigDecimal estimatedValue, String nextAction, LocalDate nextActionDate,
                                            String estimatedCurrency) {
        SalesProcessEntity process = salesProcessRepository.findById(processId)
                .orElseThrow(() -> new EntityNotFoundException("Process not found"));

        if (salesStage != null) process.setSalesStage(salesStage);
        process.setEstimatedAmount(estimatedValue);
        process.setNextAction(nextAction != null && !nextAction.isBlank() ? nextAction.trim() : null);
        process.setNextActionDate(nextActionDate);
        process.setEstimatedCurrency(
                estimatedValue == null
                        ? "TRY"
                        : (estimatedCurrency != null && !estimatedCurrency.isBlank()
                           ? estimatedCurrency.trim()
                           : "TRY")
        );

        if (accountStatus != null) {
            AccountEntity account = process.getAccount();
            account.setStatus(accountStatus);
        }

        return salesProcessRepository.save(process);
    }

    @Override
    public SalesProcessEntity createForAccount(UUID accountId) {
        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        return salesProcessRepository.findByAccountIdAndDeletedFalse(accountId)
                .orElseGet(() -> {
                    SalesProcessEntity process = new SalesProcessEntity();
                    process.setAccount(account);
                    return salesProcessRepository.save(process);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public SalesProcessEntity getByAccountId(UUID accountId) {
        return salesProcessRepository.findByAccountIdAndDeletedFalse(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Process not found"));
    }

    @Override
    public void syncLastMeetingDate(UUID accountId, LocalDate lastMeetingDate) {
        SalesProcessEntity process = createForAccount(accountId);
        process.setLastMeetingDate(lastMeetingDate);
        salesProcessRepository.save(process);
    }

    @Override
    public void deleteByAccountId(UUID accountId) {
        salesProcessRepository.findByAccountIdAndDeletedFalse(accountId)
                .ifPresent(process -> {
                    process.setDeleted(true);
                    salesProcessRepository.save(process);
                });
    }
}
