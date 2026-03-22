-- LMS Database Schema
-- Surigao City & San Ricardo, Surigao del Norte
-- Created: 2024

CREATE DATABASE IF NOT EXISTS lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lms_db;

-- ============================================================
-- LOCATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  province VARCHAR(100) DEFAULT 'Surigao del Norte',
  region VARCHAR(100) DEFAULT 'Region XIII (Caraga)',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name ENUM('superadmin','mainadmin','schooladmin','teacher','student') NOT NULL UNIQUE,
  permissions JSON DEFAULT NULL,
  description VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- SCHOOLS
-- ============================================================
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  short_name VARCHAR(50) DEFAULT NULL,
  location_id INT NOT NULL,
  address TEXT DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  email VARCHAR(150) DEFAULT NULL,
  principal_name VARCHAR(200) DEFAULT NULL,
  school_type ENUM('Elementary','Junior High School','Senior High School','College','Vocational') DEFAULT 'Senior High School',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) DEFAULT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin','mainadmin','schooladmin','teacher','student') NOT NULL,
  school_id INT DEFAULT NULL,
  location_id INT DEFAULT NULL,
  student_id_number VARCHAR(50) DEFAULT NULL UNIQUE,
  phone VARCHAR(20) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  gender ENUM('Male','Female','Other') DEFAULT NULL,
  birth_date DATE DEFAULT NULL,
  profile_photo VARCHAR(255) DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  last_login DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(20) NOT NULL,
  description TEXT DEFAULT NULL,
  school_id INT NOT NULL,
  teacher_id INT DEFAULT NULL,
  units INT DEFAULT 3,
  schedule VARCHAR(200) DEFAULT NULL,
  room VARCHAR(100) DEFAULT NULL,
  semester VARCHAR(50) DEFAULT '1st Semester',
  academic_year VARCHAR(20) DEFAULT '2024-2025',
  max_students INT DEFAULT 40,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- ENROLLMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  school_id INT NOT NULL,
  academic_year VARCHAR(20) DEFAULT '2024-2025',
  semester VARCHAR(50) DEFAULT '1st Semester',
  grade_level VARCHAR(50) DEFAULT NULL,
  section VARCHAR(50) DEFAULT NULL,
  enrollment_date DATE NOT NULL,
  status ENUM('Pending','Enrolled','Dropped','Completed') DEFAULT 'Pending',
  remarks TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, course_id, academic_year, semester)
);

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  teacher_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('Present','Absent','Late','Excused') NOT NULL,
  remarks VARCHAR(255) DEFAULT NULL,
  time_in TIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (student_id, course_id, date)
);

-- ============================================================
-- EXAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  school_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  type ENUM('Quiz','Midterm','Finals','Activity','Assignment','Project') DEFAULT 'Quiz',
  exam_date DATE NOT NULL,
  total_score DECIMAL(5,2) DEFAULT 100.00,
  passing_score DECIMAL(5,2) DEFAULT 75.00,
  weight DECIMAL(5,2) DEFAULT 1.00,
  description TEXT DEFAULT NULL,
  is_published TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- ============================================================
-- GRADES
-- ============================================================
CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  exam_id INT NOT NULL,
  course_id INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  remarks VARCHAR(100) DEFAULT NULL,
  graded_by INT DEFAULT NULL,
  graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_grade (student_id, exam_id)
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT DEFAULT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT DEFAULT NULL,
  event_date DATE NOT NULL,
  start_time TIME DEFAULT NULL,
  end_time TIME DEFAULT NULL,
  venue VARCHAR(200) DEFAULT NULL,
  type ENUM('Academic','Sports','Cultural','Seminar','Holiday','Other') DEFAULT 'Academic',
  is_school_wide TINYINT(1) DEFAULT 0,
  created_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  school_id INT NOT NULL,
  reference_no VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_type ENUM('Tuition','Miscellaneous','Books','Uniform','Laboratory','Other') DEFAULT 'Tuition',
  payment_method ENUM('Cash','Bank Transfer','GCash','Maya','Check') DEFAULT 'Cash',
  status ENUM('Pending','Paid','Partial','Overdue','Cancelled') DEFAULT 'Pending',
  academic_year VARCHAR(20) DEFAULT '2024-2025',
  semester VARCHAR(50) DEFAULT '1st Semester',
  description TEXT DEFAULT NULL,
  received_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_events_date ON events(event_date);
