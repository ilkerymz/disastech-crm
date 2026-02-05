package com.disastech.crm.infrastructure.google;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Configuration
public class GoogleCalendarConfig {

    @Value("${google.calendar.credentials-file}")
    private Resource credentialsFile;

    @Value("${google.calendar.application-name}")
    private String applicationName;

    public Resource getCredentialsFile() {
        return credentialsFile;
    }

    public String getApplicationName() {
        return applicationName;
    }
}

