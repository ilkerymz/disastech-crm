package com.disastech.crm.domain.process;

import com.disastech.crm.domain.user.UserEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sales_process_notes")
public class SalesProcessNoteEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sales_process_id", nullable = false)
    private SalesProcessEntity salesProcess;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private UserEntity createdBy;

    @Column(name = "note", nullable = false, columnDefinition = "TEXT")
    private String note;

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    @Column(name = "is_negative_reason", nullable = false)
    private boolean negativeReason = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public SalesProcessEntity getSalesProcess() { return salesProcess; }
    public void setSalesProcess(SalesProcessEntity salesProcess) { this.salesProcess = salesProcess; }
    public UserEntity getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserEntity createdBy) { this.createdBy = createdBy; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public boolean isNegativeReason() { return negativeReason; }
    public void setNegativeReason(boolean negativeReason) { this.negativeReason = negativeReason; }

}
