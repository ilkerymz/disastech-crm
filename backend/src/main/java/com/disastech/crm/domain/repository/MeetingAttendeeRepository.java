package com.disastech.crm.domain.repository;

import com.disastech.crm.domain.meeting.MeetingAttendeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MeetingAttendeeRepository extends JpaRepository<MeetingAttendeeEntity, UUID> {
    List<MeetingAttendeeEntity> findByMeetingId(UUID meetingId);
}