package com.disastech.crm.application.user;


import com.disastech.crm.api.user.dto.CreateUserRequest;
import com.disastech.crm.api.user.dto.UpdateUserRequest;
import com.disastech.crm.api.user.dto.UserResponse;
import com.disastech.crm.domain.repository.UserRepository;
import com.disastech.crm.domain.user.UserEntity;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.super-admin-email}")
    private String superAdminEmail;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void createUser(CreateUserRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        if(request.getPassword().length() < 6) {
            throw new RuntimeException("Password too short");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        UserEntity user = new UserEntity();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);
        user.setRole(request.getRole());

        userRepository.save(user);
    }

    @Override
    public List<UserEntity> list() {
        return userRepository.findByActiveTrue();
    }

    @Override
    @Transactional
    public void deleteUser(UUID id){
        UserEntity user = userRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("User Not Found"));

        if(user.getEmail().equals(superAdminEmail)){
            throw new RuntimeException("Super Admin Cannot be delete");
        }

        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserEntity update(UUID id, UpdateUserRequest request){
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User Not Found"));

        if(!user.getActive()){
            throw new IllegalStateException("Cannot update passive user");
        }

        if(request.fullName != null){
            user.setFullName(request.fullName);
        }
        if(request.email != null){
            if(user.getEmail().equals(superAdminEmail)){
                throw new IllegalStateException("Cannot update superadmin email");
            }else{
                user.setEmail(request.email);
            }
        }
        if(request.password != null){
            String hashedNewPassword = passwordEncoder.encode(request.password);
            user.setPassword(hashedNewPassword);
        }
        if(request.role != null){
            user.setRole(request.role);
        }

        return userRepository.save(user);

    }
}
