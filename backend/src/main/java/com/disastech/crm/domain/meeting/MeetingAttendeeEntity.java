package com.disastech.crm.domain.meeting;

import com.disastech.crm.domain.contact.ContactEntity;
import com.disastech.crm.domain.user.UserEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "meeting_attendees")
public class MeetingAttendeeEntity {
    @Id @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "meeting_id", nullable = false)
    private MeetingEntity meeting;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendee_type", nullable = false, length = 20)
    private MeetingAttendeeType attendeeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private ContactEntity contact;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "display_name", nullable = false, length = 150)
    private String displayName;

    @Column(name = "is_primary", nullable = false)
    private boolean primary;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() { createdAt = LocalDateTime.now(); }

    public UUID getId() { return id; }
    public MeetingEntity getMeeting() { return meeting; }
    public void setMeeting(MeetingEntity meeting) { this.meeting = meeting; }
    public MeetingAttendeeType getAttendeeType() { return attendeeType; }
    public void setAttendeeType(MeetingAttendeeType attendeeType) { this.attendeeType = attendeeType; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public ContactEntity getContact() { return contact; }
    public void setContact(ContactEntity contact) { this.contact = contact; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public boolean isPrimary() { return primary; }
    public void setPrimary(boolean primary) { this.primary = primary; }
}