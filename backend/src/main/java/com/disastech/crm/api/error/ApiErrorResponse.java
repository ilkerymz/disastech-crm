package com.disastech.crm.api.error;

import java.time.LocalDateTime;

public class ApiErrorResponse {
    public LocalDateTime timestamp;
    public int status;
    public String error;
    public String message;
    public String path;

    public ApiErrorResponse(
            int status,
            String error,
            String message,
            String path
    ){
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}
