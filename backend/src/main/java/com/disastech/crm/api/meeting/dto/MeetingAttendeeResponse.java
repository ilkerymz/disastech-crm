package com.disastech.crm.api.meeting.dto;

import com.disastech.crm.domain.meeting.MeetingAttendeeType;

import java.util.UUID;

public class MeetingAttendeeResponse {
    public UUID id;
    public MeetingAttendeeType attendeeType;
    public UUID userId;
    public UUID contactId;
    public String email;
    public String displayName;
    public boolean isPrimary;
}