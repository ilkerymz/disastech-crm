package com.disastech.crm.domain.repository;

import com.disastech.crm.domain.process.SalesProcessNoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SalesProcessNoteRepository extends JpaRepository<SalesProcessNoteEntity, UUID> {
    List<SalesProcessNoteEntity> findBySalesProcessIdAndDeletedFalseOrderByCreatedAtDesc(UUID processId);
    long countBySalesProcessIdAndDeletedFalse(UUID processId);
    Optional<SalesProcessNoteEntity> findFirstBySalesProcessIdAndDeletedFalseOrderByCreatedAtDesc(UUID processId);
}
