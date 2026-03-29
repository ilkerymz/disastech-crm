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
            String email,
            String phone,
            String title
    ) {

        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        ContactEntity contact = new ContactEntity();
        contact.setAccount(account);
        contact.setFullName(fullName);
        contact.setEmail(email);
        contact.setPhone(phone);
        contact.setTitle(title);

        return contactRepository.save(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactEntity> findByAccount(UUID accountId) {

        return contactRepository.findByAccountId(accountId);
    }

    @Override
    public void delete(String accountId) {
        UUID id = UUID.fromString(accountId);

        ContactEntity contact = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account Not Found"));

        contact.setActive(false);

        contactRepository.save(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactEntity> findByAccountAndActiveTrue(UUID accountId) {

        return contactRepository.findByAccountIdAndActiveTrue(accountId);
    }

    @Override
    public ContactEntity update(UUID contactId, String fullName, String email, String phone, String title) {
        ContactEntity contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new EntityNotFoundException("Contact Not Found"));

        if(!contact.getActive()) {
            throw new IllegalStateException("Cannot Update Passive Contact");
        }

        contact.setFullName(fullName);
        contact.setEmail(email);
        contact.setPhone(phone);
        contact.setTitle(title);

        return contactRepository.save(contact);
    }
}
