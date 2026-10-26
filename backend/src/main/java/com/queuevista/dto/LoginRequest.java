package com.queuevista.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * LoginRequest captures citizen, staff, or admin credentials for authentication.
 * Viva Explanation:
 * Strongly-typed request DTO with validation annotations preventing empty credentials from
 * triggering database queries.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "A valid email format is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
