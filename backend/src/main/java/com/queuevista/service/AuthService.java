package com.queuevista.service;

import com.queuevista.dto.AuthResponse;
import com.queuevista.dto.LoginRequest;
import com.queuevista.dto.RegisterRequest;

/**
 * AuthService defines user authentication and account registration contracts.
 * Viva Explanation:
 * Decouples controller endpoints from registration, credential verification, and token issuance workflows.
 */
public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
