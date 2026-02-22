package com.disastech.crm.domain.repository;

import com.disastech.crm.domain.meeting.MeetingNoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MeetingNoteRepository extends JpaRepository<MeetingNoteEntity, UUID> {

    List<MeetingNoteEntity> findByMeetingIdAndDeletedFalseOrderByCreatedAtDesc(UUID meetingId);

    long countByMeetingIdAndDeletedFalse(UUID meetingId);

    Optional<MeetingNoteEntity> findFirstByMeetingIdAndDeletedFalseOrderByCreatedAtDesc(UUID meetingId);
}

