package com.disastech.crm.application.contact;

import com.disastech.crm.domain.contact.ContactEntity;

import java.util.List;
import java.util.UUID;

public interface ContactService {

    ContactEntity create(
            UUID accountId,
            String fullName,
            String email
    );

    List<ContactEntity> findByAccount(UUID accountId);

}
