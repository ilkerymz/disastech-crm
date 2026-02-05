package com.disastech.crm.application.contact;

import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.repository.AccountRepository;
import com.disastech.crm.domain.contact.ContactEntity;
import com.disastech.crm.domain.repository.ContactRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final AccountRepository accountRepository;

    public ContactServiceImpl(
            ContactRepository contactRepository,
            AccountRepository accountRepository
    ) {
        this.contactRepository = contactRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public ContactEntity create(
            UUID accountId,
            String fullName,
            String email
    ) {

        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        ContactEntity contact = new ContactEntity();
        contact.setAccount(account);
        contact.setFullName(fullName);
        contact.setEmail(email);

        return contactRepository.save(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactEntity> findByAccount(UUID accountId) {

        return contactRepository.findByAccountId(accountId);
    }
}
