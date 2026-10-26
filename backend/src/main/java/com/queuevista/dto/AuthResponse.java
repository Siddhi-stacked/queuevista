package com.queuevista.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AuthResponse returns the generated JWT token alongside user details upon successful login or registration.
 * Viva Explanation:
 * Provides the frontend with the Bearer token needed for the Authorization header
 * and basic user profile information to initialize the client session state.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;

    @Builder.Default
    private String tokenType = "Bearer";

    private UserDto user;
}
