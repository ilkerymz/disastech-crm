package com.disastech.crm.api.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class SuperAdminChecker {
    @Value("${app.super-admin-email}")
    private String superAdminEmail;

    public boolean isSuperAdmin(Authentication authentication){
        if(authentication == null || !authentication.isAuthenticated()){
            return false;
        }

        String email = authentication.getName();
        return superAdminEmail.equals(email);
    }
}
