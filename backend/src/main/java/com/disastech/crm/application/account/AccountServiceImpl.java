package com.disastech.crm.application.account;

import com.disastech.crm.api.account.AccountStatus;
import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.repository.AccountRepository;
import com.disastech.crm.domain.repository.ContactRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final ContactRepository contactRepository;

    public AccountServiceImpl(AccountRepository accountRepository,
                              ContactRepository contactRepository) {
        this.accountRepository = accountRepository;
        this.contactRepository = contactRepository;
    }

    @Override
    public AccountEntity create(String name, String industry, AccountStatus status) {
        AccountEntity account = new AccountEntity();
        account.setName(name);
        account.setIndustry(industry);
        account.setStatus(status);
        account.setActive(true);

        return accountRepository.save(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountEntity> findAll() {
        return accountRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountEntity> findByActiveTrue() {return accountRepository.findByActiveTrue();}

    @Override
    public AccountEntity update(UUID accountId, String industry, AccountStatus status) {
        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account Not Found"));

        if(!account.getActive()){
            throw new IllegalStateException("Cannot Update Passive Account");
        }

        account.setIndustry(industry);
        account.setStatus(status);

        return accountRepository.save(account);
    }

    @Override
    public void delete(String accountId) {
        UUID id = UUID.fromString(accountId);

        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account Not Found"));

        account.setActive(false);

        accountRepository.save(account);
    }


    @Override
    public void deactivate(String accountId) {
        UUID id = UUID.fromString(accountId);
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account Not Found"));
        account.setActive(false);
    }
}
