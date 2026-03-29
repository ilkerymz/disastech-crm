package com.disastech.crm.api.account;

import com.disastech.crm.api.account.dto.AccountResponse;
import com.disastech.crm.api.account.dto.CreateAccountRequest;
import com.disastech.crm.api.account.dto.UpdateAccountRequest;
import com.disastech.crm.application.account.AccountService;
import com.disastech.crm.domain.account.AccountEntity;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService){
        this.accountService = accountService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse create(@Valid @RequestBody CreateAccountRequest request) {
        AccountEntity account = accountService.create(
                request.name,
                request.industry,
                request.status,
                request.responsibleUserId,
                request.email,
                request.phone

        );

        return toResponse(account);
    }

    @GetMapping
    public List<AccountResponse> list() {
        return accountService.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping
    @RequestMapping("/active")
    public List<AccountResponse> listActive() {
        return accountService.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public AccountResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateAccountRequest request) {
        AccountEntity account = accountService.update(id, request.industry, request.status, request.responsibleUserId, request.email, request.phone
        );
        return toResponse(account);
    }


    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public  void delete(@PathVariable String id) {
        accountService.delete(id);
    }

    @PatchMapping("/{id}/deactivate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivate(@PathVariable String id) {
        accountService.deactivate(id);
    }

    private AccountResponse toResponse(AccountEntity entity) {
        AccountResponse r = new AccountResponse();
        r.id = entity.getId();
        r.name = entity.getName();
        r.industry = entity.getIndustry();
        r.active = entity.getActive();
        r.status = entity.getStatus();
        r.responsibleUserId = entity.getResponsibleUser() != null ? entity.getResponsibleUser().getId() : null;
        r.responsibleUserName = entity.getResponsibleUser() != null ? entity.getResponsibleUser().getFullName() : null;
        r.email = entity.getEmail() != null ? entity.getEmail() : null;
        r.phone = entity.getPhone() != null ? entity.getPhone() : null;

        return r;
    }


}
