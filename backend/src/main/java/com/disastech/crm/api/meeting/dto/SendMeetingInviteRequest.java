package com.disastech.crm.api.meeting.dto;

import java.util.List;
import java.util.UUID;

public class SendMeetingInviteRequest {
    public String description;
    public List<UUID> additionalContactIds;
    public List<UUID> additionalUserIds;
    public List<String> manualEmails;
}
