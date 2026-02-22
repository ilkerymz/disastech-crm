package com.disastech.crm.application.meeting;

import com.disastech.crm.domain.meeting.MeetingEntity;
import com.disastech.crm.domain.meeting.MeetingNoteEntity;
import com.disastech.crm.domain.repository.MeetingNoteRepository;
import com.disastech.crm.domain.repository.MeetingRepository;
import com.disastech.crm.domain.repository.UserRepository;
import com.disastech.crm.domain.user.UserEntity;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service

public class MeetingNoteServiceImpl implements MeetingNoteService {

    private final MeetingRepository meetingRepository;
    private final MeetingNoteRepository meetingNoteRepository;
    private final UserRepository userRepository;

    public MeetingNoteServiceImpl(MeetingRepository meetingRepository, MeetingNoteRepository meetingNoteRepository, UserRepository userRepository){
        this.meetingNoteRepository = meetingNoteRepository;
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public MeetingNoteEntity addNote(UUID meetingId, String note) {
        MeetingEntity meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        UserEntity user = userRepository.findByEmail(
                SecurityContextHolder.getContext().getAuthentication().getName()
        ).orElseThrow(() -> new EntityNotFoundException("User not found"));

        MeetingNoteEntity entity = new MeetingNoteEntity();
        entity.setMeeting(meeting);
        entity.setCreatedBy(user);
        entity.setNote(note.trim());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setDeleted(false);

        return meetingNoteRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MeetingNoteEntity> getNotes(UUID meetingId) {
        if (!meetingRepository.existsById(meetingId)) {
            throw new EntityNotFoundException("Meeting not found");
        }
        return meetingNoteRepository.findByMeetingIdAndDeletedFalseOrderByCreatedAtDesc(meetingId);
    }
}

