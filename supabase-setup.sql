-- =====================================================
-- E-CLEARANCE SYSTEM - DATABASE SETUP
-- Run this in Supabase SQL Editor to create all tables
-- =====================================================

-- Drop existing tables if they exist (careful in production!)
-- Uncomment the DROP statements below if you need a fresh start:
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS room_assignments CASCADE;
-- DROP TABLE IF EXISTS rooms CASCADE;
-- DROP TABLE IF EXISTS activity_logs CASCADE;
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS clearance_steps CASCADE;
-- DROP TABLE IF EXISTS clearance_requests CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP TABLE IF EXISTS departments CASCADE;
-- DROP TABLE IF EXISTS system_settings CASCADE;

-- =====================================================
-- 1. SYSTEM SETTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. DEPARTMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT departments_name_unique UNIQUE (name),
  CONSTRAINT departments_code_unique UNIQUE (code)
);

-- =====================================================
-- 3. PROFILES (extends Supabase auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,  -- references auth.users.id
  full_name TEXT,
  role TEXT,
  department_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles (role);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles (created_at);
CREATE INDEX IF NOT EXISTS profiles_department_id_idx ON profiles (department_id);

-- =====================================================
-- 4. CLEARANCE REQUESTS
-- =====================================================
CREATE TABLE IF NOT EXISTS clearance_requests (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  student_id UUID NOT NULL,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for clearance_requests
CREATE INDEX IF NOT EXISTS clearance_requests_status_idx ON clearance_requests (status);
CREATE INDEX IF NOT EXISTS clearance_requests_student_id_idx ON clearance_requests (student_id);

-- =====================================================
-- 5. CLEARANCE STEPS
-- =====================================================
CREATE TABLE IF NOT EXISTS clearance_steps (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  clearance_request_id UUID,
  department_id UUID,
  status TEXT DEFAULT 'pending',
  comment TEXT,
  updated_at TIMESTAMP
);

-- Indexes for clearance_steps
CREATE INDEX IF NOT EXISTS clearance_steps_department_id_idx ON clearance_steps (department_id);
CREATE INDEX IF NOT EXISTS clearance_steps_status_idx ON clearance_steps (status);

-- =====================================================
-- 6. AUDIT LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for audit_logs
CREATE INDEX IF NOT EXISTS audit_logs_actor_id_idx ON audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at);

-- =====================================================
-- 7. ACTIVITY LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for activity_logs
CREATE INDEX IF NOT EXISTS activity_logs_user_id_idx ON activity_logs (user_id);
CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx ON activity_logs (created_at);

-- =====================================================
-- 8. ROOMS
-- =====================================================
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  room_number VARCHAR(20) NOT NULL,
  hostel_name VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  floor INTEGER,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 9. ROOM ASSIGNMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS room_assignments (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  student_id UUID NOT NULL,
  room_id UUID NOT NULL,
  check_in_date TIMESTAMP DEFAULT NOW(),
  check_out_date TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for room_assignments
CREATE INDEX IF NOT EXISTS room_assignments_student_id_idx ON room_assignments (student_id);
CREATE INDEX IF NOT EXISTS room_assignments_room_id_idx ON room_assignments (room_id);
CREATE INDEX IF NOT EXISTS room_assignments_status_idx ON room_assignments (status);

-- =====================================================
-- 10. NOTIFICATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL,
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- FOREIGN KEY CONSTRAINTS
-- =====================================================
DO $$ BEGIN
  ALTER TABLE profiles
    ADD CONSTRAINT profiles_department_id_departments_id_fk
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE clearance_requests
    ADD CONSTRAINT clearance_requests_student_id_profiles_id_fk
    FOREIGN KEY (student_id) REFERENCES profiles(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE clearance_steps
    ADD CONSTRAINT clearance_steps_clearance_request_id_clearance_requests_id_fk
    FOREIGN KEY (clearance_request_id) REFERENCES clearance_requests(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE clearance_steps
    ADD CONSTRAINT clearance_steps_department_id_departments_id_fk
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE room_assignments
    ADD CONSTRAINT room_assignments_student_id_profiles_id_fk
    FOREIGN KEY (student_id) REFERENCES profiles(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE room_assignments
    ADD CONSTRAINT room_assignments_room_id_rooms_id_fk
    FOREIGN KEY (room_id) REFERENCES rooms(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- DISABLE ROW LEVEL SECURITY
-- The app handles auth via Supabase auth + server-side checks.
-- RLS policies on Supabase PostgREST interfere with Drizzle queries.
-- =====================================================
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE clearance_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE clearance_steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE room_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- INCREASE STATEMENT TIMEOUT
-- Prevent queries from being cancelled during normal operation
-- =====================================================
ALTER DATABASE postgres SET statement_timeout = '60s';
