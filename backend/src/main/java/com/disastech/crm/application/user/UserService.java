package com.disastech.crm.application.user;

import com.disastech.crm.api.user.dto.CreateUserRequest;
import com.disastech.crm.api.user.dto.UpdateUserRequest;
import com.disastech.crm.domain.user.UserEntity;

import java.util.List;
import java.util.UUID;

public interface UserService {
    void createUser(CreateUserRequest request);
    List<UserEntity> list();
    void deleteUser(UUID id);
    UserEntity update(UUID id, UpdateUserRequest request);
}
