package com.disastech.crm.domain.process;

import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.meeting.SalesStage;
import com.disastech.crm.domain.meeting.SalesStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sales_processes")
public class SalesProcessEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private AccountEntity account;

    @Enumerated(EnumType.STRING)
    @Column(name = "sales_stage")
    private SalesStage salesStage;

    @Enumerated(EnumType.STRING)
    @Column(name = "sales_status")
    private SalesStatus salesStatus;

    @Column(name = "estimated_amount")
    private BigDecimal estimatedAmount;

    @Column(name = "last_meeting_date")
    private LocalDate lastMeetingDate;

    @Column(name = "next_action")
    private String nextAction;

    @Column(name = "next_action_date")
    private LocalDate nextActionDate;

    @Column(name = "current_note", columnDefinition = "TEXT")
    private String currentNote;

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    @Column(name = "estimated_currency", length = 10, nullable = false)
    private String estimatedCurrency = "TRY";

    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public AccountEntity getAccount() { return account; }
    public void setAccount(AccountEntity account) { this.account = account; }
    public SalesStage getSalesStage() { return salesStage; }
    public void setSalesStage(SalesStage salesStage) { this.salesStage = salesStage; }
    public SalesStatus getSalesStatus() { return salesStatus; }
    public void setSalesStatus(SalesStatus salesStatus) { this.salesStatus = salesStatus; }
    public BigDecimal getEstimatedAmount() { return estimatedAmount; }
    public void setEstimatedAmount(BigDecimal estimatedAmount) { this.estimatedAmount = estimatedAmount; }
    public LocalDate getLastMeetingDate() { return lastMeetingDate; }
    public void setLastMeetingDate(LocalDate lastMeetingDate) { this.lastMeetingDate = lastMeetingDate; }
    public String getNextAction() { return nextAction; }
    public void setNextAction(String nextAction) { this.nextAction = nextAction; }
    public LocalDate getNextActionDate() { return nextActionDate; }
    public void setNextActionDate(LocalDate nextActionDate) { this.nextActionDate = nextActionDate; }
    public String getCurrentNote() { return currentNote; }
    public void setCurrentNote(String currentNote) { this.currentNote = currentNote; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getEstimatedCurrency() {
        return estimatedCurrency;
    }

    public void setEstimatedCurrency(String estimatedCurrency) {
        this.estimatedCurrency = estimatedCurrency;
    }
}
