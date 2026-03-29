package com.disastech.crm.domain.repository;

import com.disastech.crm.domain.process.SalesProcessEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SalesProcessRepository extends JpaRepository<SalesProcessEntity, UUID> {
    Optional<SalesProcessEntity> findByAccountIdAndDeletedFalse(UUID accountId);
    List<SalesProcessEntity> findByDeletedFalse();
}
