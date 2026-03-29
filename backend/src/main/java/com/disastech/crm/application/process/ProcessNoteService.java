package com.disastech.crm.application.process;

import com.disastech.crm.domain.process.SalesProcessNoteEntity;

import java.util.List;
import java.util.UUID;

public interface ProcessNoteService {
    SalesProcessNoteEntity addNote(UUID processId, String note, boolean isNegativeReason);
    List<SalesProcessNoteEntity> getNotes(UUID processId);
}
