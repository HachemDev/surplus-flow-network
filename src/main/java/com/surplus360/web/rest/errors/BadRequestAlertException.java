package com.surplus360.web.rest.errors;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@Getter
public class BadRequestAlertException extends RuntimeException {

    private final String entityName;
    private final String errorKey;

    public BadRequestAlertException(String message, String entityName, String errorKey) {
        super(message);
        this.entityName = entityName;
        this.errorKey = errorKey;
    }

    public BadRequestAlertException(String message, String entityName, String errorKey, Throwable cause) {
        super(message, cause);
        this.entityName = entityName;
        this.errorKey = errorKey;
    }
}