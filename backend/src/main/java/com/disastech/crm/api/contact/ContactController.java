package com.disastech.crm.api.contact;

import com.disastech.crm.api.contact.dto.ContactResponse;
import com.disastech.crm.api.contact.dto.CreateContactRequest;
import com.disastech.crm.application.contact.ContactService;
import com.disastech.crm.domain.contact.ContactEntity;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse create(@Valid @RequestBody CreateContactRequest request) {

        ContactEntity contact = contactService.create(
                request.accountId,
                request.fullName,
                request.email
        );

        return toResponse(contact);
    }

    // LIST BY ACCOUNT
    @GetMapping
    public List<ContactResponse> listByAccount(@RequestParam UUID accountId) {

        return contactService.findByAccount(accountId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ----------------
    // MAPPING
    // ----------------
    private ContactResponse toResponse(ContactEntity entity) {

        ContactResponse r = new ContactResponse();
        r.id = entity.getId();
        r.accountId = entity.getAccount().getId();
        r.fullName = entity.getFullName();
        r.email = entity.getEmail();

        return r;
    }
}
