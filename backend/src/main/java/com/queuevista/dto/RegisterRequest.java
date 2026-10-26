package com.queuevista.dto;

import com.queuevista.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * RegisterRequest encapsulates user registration payload with Bean Validation constraints.
 * Viva Explanation:
 * Uses Jakarta validation annotations (@NotBlank, @Email, @Size) so input validation
 * is handled automatically before reaching service business logic.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "A valid email format is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private UserRole role; // USER by default, or STAFF/ADMIN

    private Long organizationId; // Optional, populated for staff/admin onboarding
}
