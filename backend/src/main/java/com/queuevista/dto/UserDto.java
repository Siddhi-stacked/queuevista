package com.queuevista.dto;

import com.queuevista.entity.UserRole;
import com.queuevista.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UserDto safely exposes user profile fields to frontend clients without sensitive password hashes.
 * Viva Explanation:
 * Adheres to the DTO design pattern to decouple internal JPA entity representations from public
 * API JSON contracts and shield password_hash from ever being serialized.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private UserRole role;
    private UserStatus status;
    private Long organizationId;
    private String organizationName;
    private Long assignedCounterId;
}
