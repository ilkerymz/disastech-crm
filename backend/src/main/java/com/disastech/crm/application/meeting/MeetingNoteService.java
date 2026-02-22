package com.disastech.crm.application.meeting;

import com.disastech.crm.domain.meeting.MeetingNoteEntity;

import java.util.List;
import java.util.UUID;

public interface MeetingNoteService {
    MeetingNoteEntity addNote(UUID meetingId, String note);
    List<MeetingNoteEntity> getNotes(UUID meetingId);
}

