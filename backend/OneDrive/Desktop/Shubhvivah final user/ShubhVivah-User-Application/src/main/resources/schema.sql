-- Fix: Add missing columns to otp_verification table
-- These columns were defined in OtpEntity.java but Hibernate DDL auto-update
-- failed because existing rows had null values for NOT NULL columns.

ALTER TABLE otp_verification ADD COLUMN IF NOT EXISTS attempt_count integer;
ALTER TABLE otp_verification ADD COLUMN IF NOT EXISTS resend_count integer;
ALTER TABLE otp_verification ADD COLUMN IF NOT EXISTS last_sent_at timestamp;

-- Set default values for any existing rows
UPDATE otp_verification SET attempt_count = 0 WHERE attempt_count IS NULL;
UPDATE otp_verification SET resend_count = 0 WHERE resend_count IS NULL;

-- Now add NOT NULL constraints
ALTER TABLE otp_verification ALTER COLUMN attempt_count SET NOT NULL;
ALTER TABLE otp_verification ALTER COLUMN attempt_count SET DEFAULT 0;
ALTER TABLE otp_verification ALTER COLUMN resend_count SET NOT NULL;
ALTER TABLE otp_verification ALTER COLUMN resend_count SET DEFAULT 0;
