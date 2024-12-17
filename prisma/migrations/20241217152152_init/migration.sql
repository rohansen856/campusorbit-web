-- Create UserRole Enum
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create User Table
CREATE TABLE IF NOT EXISTS "User" (
  id                      TEXT       PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT,
  email                   TEXT       UNIQUE,
  tempEmail               TEXT,
  emailVerified           TIMESTAMP,
  image                   TEXT,
  password                TEXT,
  role                    "UserRole" NOT NULL DEFAULT 'USER',
  isTwoFactorEnabled      BOOLEAN    NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Institute Table
CREATE TABLE IF NOT EXISTS "Institute" (
  id               SERIAL     PRIMARY KEY,
  name             TEXT       UNIQUE NOT NULL,
  short_name       TEXT       UNIQUE NOT NULL,
  affiliation      TEXT       NOT NULL CHECK (affiliation IN ('IIT', 'NIT', 'IIIT')),
  logo_url         TEXT       NOT NULL,
  website_url      TEXT       NOT NULL,
  mail_slug        Text       NOT NULL UNIQUE
);

-- Create Student Table
CREATE TABLE IF NOT EXISTS "Student" (
  id                 SERIAL      PRIMARY KEY,
  user_id            TEXT        UNIQUE,
  username           TEXT        NOT NULL,
  semester           INT         NOT NULL CHECK (semester >= 1 AND semester <= 8);
  roll_number        TEXT        UNIQUE NOT NULL,
  profile_image      TEXT        NOT NULL,
  background_banner  TEXT        NOT NULL,
  enrollment_year    INT         NOT NULL CHECK (enrollment_year >= 2000 AND enrollment_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
  graduation_year    INT         CHECK (graduation_year >= enrollment_year),
  branch             TEXT        NOT NULL CHECK (branch IN ('CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'DS', 'AI', 'CS', 'CH', 'BT')),
  institute_id       INT         NOT NULL,
  created_at         TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "User" (id) ON DELETE SET NULL,
  CONSTRAINT fk_institute FOREIGN KEY (institute_id) REFERENCES "Institute" (id) ON DELETE CASCADE
);

-- Create Account Table
CREATE TABLE IF NOT EXISTS "Account" (
  id                 TEXT       PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            TEXT       NOT NULL,
  type               TEXT       NOT NULL,
  provider           TEXT       NOT NULL,
  providerAccountId  TEXT       NOT NULL,
  refresh_token      TEXT,
  access_token       TEXT,
  expires_at         INT,
  token_type         TEXT,
  scope              TEXT,
  id_token           TEXT,
  session_state      TEXT,
  created_at         TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_account FOREIGN KEY (user_id) REFERENCES "User" (id) ON DELETE CASCADE,
  CONSTRAINT uq_provider_account UNIQUE (provider, providerAccountId)
);

-- Create VerificationToken Table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  id              TEXT       PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT       NOT NULL,
  token           TEXT       UNIQUE NOT NULL,
  is_update_email BOOLEAN    NOT NULL DEFAULT FALSE,
  expires         TIMESTAMP  NOT NULL,
  CONSTRAINT uq_user_token UNIQUE (user_id, token)
);

-- Create TwoFactorToken Table
CREATE TABLE IF NOT EXISTS "TwoFactorToken" (
  id              TEXT       PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT       NOT NULL,
  token           TEXT       UNIQUE NOT NULL,
  expires         TIMESTAMP  NOT NULL,
  CONSTRAINT uq_email_token UNIQUE (email, token)
);

-- Create TwoFactorConfirmation Table
CREATE TABLE IF NOT EXISTS "TwoFactorConfirmation" (
  id              TEXT       PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT       NOT NULL,
  CONSTRAINT fk_user_two_factor FOREIGN KEY (user_id) REFERENCES "User" (id) ON DELETE CASCADE,
  CONSTRAINT uq_user_confirmation UNIQUE (user_id)
);
