package com.queuevista.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * BadRequestException signals client errors such as duplicate email or invalid parameters.
 * Viva Explanation:
 * Mapped to HTTP 400 Bad Request, thrown when a client request violates domain rules
 * (e.g. attempting to register an email address that already exists).
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
