package com.queuevista.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * ResourceNotFoundException signals that an entity was not found in the database.
 * Viva Explanation:
 * Mapped to HTTP 404 Not Found, thrown whenever a requested user, service, counter,
 * or appointment ID does not exist in the database.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
