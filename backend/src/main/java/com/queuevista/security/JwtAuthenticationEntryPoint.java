package com.queuevista.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.queuevista.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;

/**
 * JwtAuthenticationEntryPoint intercepts unauthenticated requests to protected endpoints.
 * Viva Explanation:
 * Replaces Spring Security's default redirect or empty response with a structured JSON ErrorResponse (HTTP 401),
 * preventing client crashes and informing frontends to redirect to /login.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Unauthorized")
                .message("Full authentication is required to access this resource: " + authException.getMessage())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
