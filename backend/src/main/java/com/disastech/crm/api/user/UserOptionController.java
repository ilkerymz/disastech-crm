package com.disastech.crm.api.user;

import com.disastech.crm.api.user.dto.UserResponse;
import com.disastech.crm.application.user.UserService;
import com.disastech.crm.domain.user.UserEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserOptionController {

    private final UserService userService;

    public UserOptionController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/options")
    public List<UserResponse> listOptions() {
        return userService.list()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(UserEntity entity) {
        UserResponse r = new UserResponse();
        r.id = entity.getId();
        r.fullName = entity.getFullName();
        r.email = entity.getEmail();
        r.role = entity.getRole();
        return r;
    }
}
