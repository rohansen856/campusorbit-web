CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  roll_number TEXT UNIQUE NOT NULL,
  institute TEXT NOT NULL,
  branch TEXT NOT NULL CHECK (
    branch IN ('CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'DS', 'AI', 'CS', 'CH', 'BT')
  ),
  profile_image TEXT NOT NULL, -- URL to profile image
  background_banner TEXT NOT NULL, -- URL to background banner
  enrollment_year INT NOT NULL CHECK (enrollment_year >= 2000 AND enrollment_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
  graduation_year INT CHECK (graduation_year >= enrollment_year),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);