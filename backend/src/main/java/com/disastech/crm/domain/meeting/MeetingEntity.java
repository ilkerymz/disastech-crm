package com.disastech.crm.domain.meeting;

import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.contact.ContactEntity;
import com.disastech.crm.domain.user.UserEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "meetings")
public class MeetingEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountEntity account;

    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MeetingAttendeeEntity> attendees = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private ContactEntity contact;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private UserEntity owner;

    @Column(name = "meeting_start", nullable = false)
    private LocalDateTime meetingStart;

    @Column(name = "meeting_end", nullable = false)
    private LocalDateTime meetingEnd;

    @Column(nullable = false, length = 50)
    private String status;
    // PLANNED, COMPLETED, CANCELLED, POSTPONED


    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 255)
    private String subject;


    @Column(name = "google_event_id", unique = true)
    private String googleEventId;

    @Column(name = "google_calendar_id")
    private String googleCalendarId;

    @Column(nullable = false)
    private Boolean deleted = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "mail_status", length = 30, nullable = false)
    private MailStatus mailStatus = MailStatus.NOT_SENT;

    @Column(name = "mail_sent_at")
    private LocalDateTime mailSentAt;

    @Column(name = "mail_sent_by_user_id")
    private UUID mailSentByUserId;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // getters & setters

    public AccountEntity getAccount() {
        return account;
    }

    public void setAccount(AccountEntity account) {
        this.account = account;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ContactEntity getContact() {
        return contact;
    }

    public void setContact(ContactEntity contact) {
        this.contact = contact;
    }

    public UserEntity getOwner() {
        return owner;
    }

    public void setOwner(UserEntity owner) {
        this.owner = owner;
    }

    public LocalDateTime getMeetingStart() {
        return meetingStart;
    }

    public void setMeetingStart(LocalDateTime meetingStart) {
        this.meetingStart = meetingStart;
    }

    public LocalDateTime getMeetingEnd() {
        return meetingEnd;
    }

    public void setMeetingEnd(LocalDateTime meetingEnd) {
        this.meetingEnd = meetingEnd;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getGoogleEventId() {
        return googleEventId;
    }

    public void setGoogleEventId(String googleEventId) {
        this.googleEventId = googleEventId;
    }

    public String getGoogleCalendarId() {
        return googleCalendarId;
    }

    public void setGoogleCalendarId(String googleCalendarId) {
        this.googleCalendarId = googleCalendarId;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public MailStatus getMailStatus() {
        return mailStatus;
    }

    public void setMailStatus(MailStatus mailStatus) {
        this.mailStatus = mailStatus;
    }

    public LocalDateTime getMailSentAt() {
        return mailSentAt;
    }

    public void setMailSentAt(LocalDateTime mailSentAt) {
        this.mailSentAt = mailSentAt;
    }

    public UUID getMailSentByUserId() {
        return mailSentByUserId;
    }

    public void setMailSentByUserId(UUID mailSentByUserId) {
        this.mailSentByUserId = mailSentByUserId;
    }

    public List<MeetingAttendeeEntity> getAttendees() { return attendees; }
    public void setAttendees(List<MeetingAttendeeEntity> attendees) { this.attendees = attendees; }

}
