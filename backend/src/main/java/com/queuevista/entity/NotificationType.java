package com.queuevista.entity;

/**
 * NotificationType classifies messages dispatched to users.
 * Viva Explanation:
 * Allows frontend client apps to categorize and badge alerts into general announcements (INFO),
 * live line movements (QUEUE_UPDATE), appointment reminders (APPOINTMENT), or urgent warnings (ALERT).
 */
public enum NotificationType {
    INFO,
    QUEUE_UPDATE,
    APPOINTMENT,
    ALERT
}
