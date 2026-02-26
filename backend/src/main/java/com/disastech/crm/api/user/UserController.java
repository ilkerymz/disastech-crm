package com.disastech.crm.api.user;

import com.disastech.crm.api.user.dto.CreateUserRequest;
import com.disastech.crm.api.user.dto.UpdateUserRequest;
import com.disastech.crm.api.user.dto.UserResponse;
import com.disastech.crm.application.user.UserService;
import com.disastech.crm.domain.repository.UserRepository;
import com.disastech.crm.domain.user.UserEntity;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/admin")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PreAuthorize("@superAdminChecker.isSuperAdmin(authentication)")
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request){
        userService.createUser(request);
        return ResponseEntity.ok("User Created");
    }

    @PreAuthorize("@superAdminChecker.isSuperAdmin(authentication)")
    @GetMapping("/users")
    public List<UserResponse> list(){
        List<UserEntity> users;
        users = userService.list();

        return users.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("@superAdminChecker.isSuperAdmin(authentication)")
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable UUID id) {userService.deleteUser(id);}

    @PreAuthorize("@superAdminChecker.isSuperAdmin(authentication)")
    @PutMapping("/users/{id}")
    public UserResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateUserRequest request){
        UserEntity user = userService.update(id, request);
        return toResponse(user);
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
