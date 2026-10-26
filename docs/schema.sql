-- ==============================================================================
-- QueueVista - PostgreSQL Database Schema
-- Project: Real-Time Visibility for Digital Queues
-- ==============================================================================

-- Drop tables in reverse order of foreign key dependencies
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS queue_entries CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS counters CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- ------------------------------------------------------------------------------
-- 1. ORGANIZATIONS
-- Represents clinic, hospital, bank, or government office branches.
-- ------------------------------------------------------------------------------
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Healthcare', 'Banking', 'Government', 'Utility'
    address TEXT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    operating_hours VARCHAR(100) NOT NULL, -- e.g. '08:00 AM - 08:00 PM'
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. USERS
-- Represents customers/patients (USER), counter staff (STAFF), and administrators (ADMIN).
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id) ON DELETE SET NULL, -- NULL for general public users; populated for STAFF/ADMIN
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- BCrypt hashed password
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'STAFF', 'ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. SERVICES
-- Represents specific service offerings (e.g. General Consultation, Billing, Document Verification).
-- ------------------------------------------------------------------------------
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    token_prefix VARCHAR(5) NOT NULL, -- e.g. 'D' for Doctor/General Consultation, 'B' for Billing
    average_service_time_minutes INT NOT NULL DEFAULT 15 CHECK (average_service_time_minutes > 0),
    priority_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    max_queue_size INT NOT NULL DEFAULT 50 CHECK (max_queue_size > 0),
    operating_hours VARCHAR(100) NOT NULL, -- e.g. '08:00 AM - 02:00 PM'
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_service_org_name UNIQUE (organization_id, name),
    CONSTRAINT uq_service_org_prefix UNIQUE (organization_id, token_prefix)
);

-- ------------------------------------------------------------------------------
-- 4. COUNTERS
-- Represents physical or logical service windows/desks operated by staff.
-- ------------------------------------------------------------------------------
CREATE TABLE counters (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    staff_id BIGINT UNIQUE REFERENCES users(id) ON DELETE SET NULL, -- A staff member can operate at most one counter at a time
    counter_number INT NOT NULL CHECK (counter_number > 0),
    name VARCHAR(50) NOT NULL, -- e.g. 'Counter 1', 'Window A'
    status VARCHAR(20) NOT NULL DEFAULT 'IDLE' CHECK (status IN ('ACTIVE', 'IDLE', 'CLOSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_counter_org_number UNIQUE (organization_id, counter_number)
);

-- ------------------------------------------------------------------------------
-- 5. APPOINTMENTS
-- Pre-booked time slots that can be checked in and converted into high-priority queue tokens.
-- ------------------------------------------------------------------------------
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    appointment_code VARCHAR(30) NOT NULL UNIQUE, -- e.g. 'A-201', 'A-204'
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL, -- e.g. '10:30 AM'
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_appointment_slot UNIQUE (service_id, appointment_date, time_slot)
);

-- ------------------------------------------------------------------------------
-- 6. QUEUE_ENTRIES
-- The core transactional queue token record.
-- ------------------------------------------------------------------------------
CREATE TABLE queue_entries (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    counter_id BIGINT REFERENCES counters(id) ON DELETE SET NULL,
    appointment_id BIGINT UNIQUE REFERENCES appointments(id) ON DELETE SET NULL, -- 1-to-1 link if entry originates from an appointment
    token_number VARCHAR(20) NOT NULL, -- e.g. 'D-108'
    daily_sequence INT NOT NULL CHECK (daily_sequence > 0), -- e.g. 108
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Tracks the date for daily token number resets
    type VARCHAR(20) NOT NULL DEFAULT 'WALK_IN' CHECK (type IN ('WALK_IN', 'APPOINTMENT')),
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL', 'HIGH')),
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'CALLED', 'SERVING', 'COMPLETED', 'SKIPPED', 'CANCELLED', 'NO_SHOW')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMPTZ,
    served_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_queue_service_date_seq UNIQUE (service_id, entry_date, daily_sequence),
    CONSTRAINT uq_queue_service_date_token UNIQUE (service_id, entry_date, token_number)
);

-- ------------------------------------------------------------------------------
-- 7. NOTIFICATIONS
-- In-app notifications and updates dispatched to users.
-- ------------------------------------------------------------------------------
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'QUEUE_UPDATE', 'APPOINTMENT', 'ALERT')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(255), -- e.g. '/user/queue/D-108'
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- PERFORMANCE INDEXES
-- Indexing high-frequency query filters and foreign key lookups
-- ------------------------------------------------------------------------------
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_services_org_status ON services(organization_id, status);
CREATE INDEX idx_counters_service ON counters(service_id);
CREATE INDEX idx_counters_staff ON counters(staff_id);
CREATE INDEX idx_appointments_service_date ON appointments(service_id, appointment_date, status);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_queue_service_date_status ON queue_entries(service_id, entry_date, status);
CREATE INDEX idx_queue_user ON queue_entries(user_id);
CREATE INDEX idx_queue_counter ON queue_entries(counter_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
