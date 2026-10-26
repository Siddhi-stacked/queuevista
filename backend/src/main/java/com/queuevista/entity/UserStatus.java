package com.queuevista.entity;

/**
 * UserStatus tracks whether a user account is active or deactivated.
 * Viva Explanation:
 * Allows administrators to deactivate staff or user accounts without deleting historical
 * records, maintaining referential integrity for completed visits and appointments.
 */
public enum UserStatus {
    ACTIVE,
    INACTIVE
}
