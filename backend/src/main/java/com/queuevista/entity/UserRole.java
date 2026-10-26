package com.queuevista.entity;

/**
 * UserRole defines the three authorization levels supported by QueueVista.
 * Viva Explanation:
 * Roles control system access: USER for citizens/patients, STAFF for counter desk operators,
 * and ADMIN for facility supervisors managing queues, services, and staff assignments.
 */
public enum UserRole {
    USER,
    STAFF,
    ADMIN
}
