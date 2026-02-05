package com.disastech.crm.domain.repository;

import com.disastech.crm.domain.account.AccountEntity;
import com.disastech.crm.domain.meeting.MeetingEntity;
import com.disastech.crm.domain.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MeetingRepository extends JpaRepository<MeetingEntity, UUID> {

    // Google Calendar ile birebir eşleşme
    Optional<MeetingEntity> findByGoogleEventId(String googleEventId);

    // Bir kullanıcının belirli tarih aralığındaki toplantıları
    List<MeetingEntity> findByOwnerAndMeetingStartBetweenAndDeletedFalse(
            UserEntity owner,
            LocalDateTime start,
            LocalDateTime end
    );

    // Bir firmanın tüm aktif toplantıları
    List<MeetingEntity> findByAccountAndDeletedFalse(AccountEntity account);

    // Tüm aktif toplantılar (dashboard için)
    List<MeetingEntity> findByDeletedFalse();
}
