package com.disastech.crm.application.account;

import com.disastech.crm.api.account.AccountStatus;
import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.repository.AccountRepository;
import com.disastech.crm.domain.repository.ContactRepository;
import com.disastech.crm.domain.repository.UserRepository;
import com.disastech.crm.domain.user.UserEntity;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.disastech.crm.application.process.ProcessService;


import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final ContactRepository contactRepository;
    private final ProcessService processService;
    private final UserRepository userRepository;


    public AccountServiceImpl(AccountRepository accountRepository,
                              ContactRepository contactRepository,
                              ProcessService processService,
                              UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.contactRepository = contactRepository;
        this.processService = processService;
        this.userRepository = userRepository;
    }

    @Override
    public AccountEntity create(String name, String industry, AccountStatus status, UUID responsibleUserId, String email, String phone) {
        UserEntity responsibleUser = userRepository.findById(responsibleUserId)
                .orElseThrow(() -> new EntityNotFoundException("Responsible user not found"));

        AccountEntity account = new AccountEntity();
        account.setName(name);
        account.setIndustry(industry);
        account.setStatus(status);
        account.setActive(true);
        account.setResponsibleUser(responsibleUser);
        account.setEmail(email);
        account.setPhone(phone);

        AccountEntity saved = accountRepository.save(account);
        processService.createForAccount(saved.getId());
        return saved;
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
    public AccountEntity update(UUID accountId, String industry, AccountStatus status, UUID responsibleUserId, String email, String phone) {
        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account Not Found"));

        if(!account.getActive()){
            throw new IllegalStateException("Cannot Update Passive Account");
        }

        UserEntity responsibleUser = userRepository.findById(responsibleUserId)
                .orElseThrow(() -> new EntityNotFoundException("Responsible user not found"));

        account.setIndustry(industry);
        account.setStatus(status);
        account.setResponsibleUser(responsibleUser);
        account.setEmail(email);
        account.setPhone(phone);


        return accountRepository.save(account);
    }

    @Override
    public void delete(String accountId) {
        UUID id = UUID.fromString(accountId);

        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account Not Found"));

        account.setActive(false);

        accountRepository.save(account);
        processService.deleteByAccountId(id);

    }


    @Override
    public void deactivate(String accountId) {
        UUID id = UUID.fromString(accountId);
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account Not Found"));
        account.setActive(false);
    }
}
