package com.disastech.crm.api.account;

import com.disastech.crm.api.account.dto.AccountResponse;
import com.disastech.crm.api.account.dto.CreateAccountRequest;
import com.disastech.crm.application.account.AccountService;
import com.disastech.crm.domain.account.AccountEntity;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
                request.status
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

        return r;
    }


}
