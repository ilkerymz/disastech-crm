package com.disastech.crm.domain.repository;

import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.contact.ContactEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<ContactEntity, UUID> {

    Optional<ContactEntity> findByAccountAndEmail(AccountEntity account, String email);

    List<ContactEntity> findByAccount(AccountEntity account);

    List<ContactEntity> findByAccountId(UUID accountId);

    List<ContactEntity> findByAccountIdAndActiveTrue(UUID accountID);

    void deleteAllByAccountId(UUID id);
}
