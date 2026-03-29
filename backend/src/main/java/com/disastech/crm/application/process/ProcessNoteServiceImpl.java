package com.disastech.crm.application.process;

import com.disastech.crm.domain.process.SalesProcessEntity;
import com.disastech.crm.domain.process.SalesProcessNoteEntity;
import com.disastech.crm.domain.repository.SalesProcessNoteRepository;
import com.disastech.crm.domain.repository.SalesProcessRepository;
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
public class ProcessNoteServiceImpl implements ProcessNoteService {

    private final SalesProcessRepository salesProcessRepository;
    private final SalesProcessNoteRepository salesProcessNoteRepository;
    private final UserRepository userRepository;

    public ProcessNoteServiceImpl(SalesProcessRepository salesProcessRepository,
                                  SalesProcessNoteRepository salesProcessNoteRepository,
                                  UserRepository userRepository) {
        this.salesProcessRepository = salesProcessRepository;
        this.salesProcessNoteRepository = salesProcessNoteRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public SalesProcessNoteEntity addNote(UUID processId, String note, boolean isNegativeReason) {
        SalesProcessEntity process = salesProcessRepository.findById(processId)
                .orElseThrow(() -> new EntityNotFoundException("Process not found"));

        UserEntity user = userRepository.findByEmail(
                SecurityContextHolder.getContext().getAuthentication().getName()
        ).orElseThrow(() -> new EntityNotFoundException("User not found"));

        SalesProcessNoteEntity entity = new SalesProcessNoteEntity();
        entity.setSalesProcess(process);
        entity.setCreatedBy(user);
        entity.setNote(note.trim());
        entity.setNegativeReason(isNegativeReason);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setDeleted(false);

        SalesProcessNoteEntity saved = salesProcessNoteRepository.save(entity);
        process.setCurrentNote(saved.getNote());
        salesProcessRepository.save(process);
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesProcessNoteEntity> getNotes(UUID processId) {
        if (!salesProcessRepository.existsById(processId)) {
            throw new EntityNotFoundException("Process not found");
        }
        return salesProcessNoteRepository.findBySalesProcessIdAndDeletedFalseOrderByCreatedAtDesc(processId);
    }
}
