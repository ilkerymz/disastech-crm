package com.disastech.crm.application.account;

import com.disastech.crm.api.account.AccountStatus;
import com.disastech.crm.domain.account.AccountEntity;

import java.util.List;
import java.util.UUID;

public interface AccountService {
    AccountEntity create (String name, String industry, AccountStatus status);
    List<AccountEntity> findAll();
    void deactivate(String accountId);
    void delete(String accountId);
    List<AccountEntity> findByActiveTrue();
    AccountEntity update(UUID accountId, String industry, AccountStatus status);
}
