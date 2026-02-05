package com.disastech.crm.domain.repository;

import com.disastech.crm.domain.account.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<AccountEntity, UUID> {

    Optional<AccountEntity> findByName(String name);

    List<AccountEntity> findByActiveTrue();

    List<AccountEntity> findByActiveFalse();
}
