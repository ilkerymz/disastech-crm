package com.disastech.crm.application.account;

import com.disastech.crm.api.account.AccountStatus;
import com.disastech.crm.domain.account.AccountEntity;

import java.util.List;

public interface AccountService {
    AccountEntity create (String name, String industry, AccountStatus status);
    List<AccountEntity> findAll();
    void deactivate(String accountId);
    void delete(String accountId);
}
