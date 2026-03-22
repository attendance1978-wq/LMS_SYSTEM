-- LMS Seed Data
-- Surigao City & San Ricardo, Surigao del Norte
-- Passwords are hashed: 'password123' = bcrypt hash below

USE lms_db;

-- ============================================================
-- LOCATIONS
-- ============================================================
INSERT INTO locations (name, province, region) VALUES
('Surigao City', 'Surigao del Norte', 'Region XIII (Caraga)'),
('San Ricardo', 'Surigao del Norte', 'Region XIII (Caraga)');

-- ============================================================
-- ROLES
-- ============================================================
INSERT INTO roles (name, description) VALUES
('superadmin', 'Full system access'),
('mainadmin', 'Manages schools within a location'),
('schooladmin', 'Manages a single school'),
('teacher', 'Handles classes, attendance, and grades'),
('student', 'Views courses, grades, and payments');

-- ============================================================
-- SCHOOLS - Surigao City (location_id=1)
-- ============================================================
INSERT INTO schools (name, short_name, location_id, address, phone, school_type, principal_name) VALUES
('Surigao del Norte National High School', 'SNNHS', 1, 'Km 3, Surigao City', '086-826-1234', 'Senior High School', 'Dr. Maria Santos'),
('Surigao City National Comprehensive High School', 'SCNCHS', 1, 'Brgy. Luna, Surigao City', '086-826-5678', 'Senior High School', 'Mr. Jose Reyes'),
('Capitol University - Surigao', 'CUS', 1, 'Surigao City Proper', '086-826-9012', 'College', 'Dr. Ana Garcia');

-- SCHOOLS - San Ricardo (location_id=2)
INSERT INTO schools (name, short_name, location_id, address, phone, school_type, principal_name) VALUES
('San Ricardo National High School', 'SRNHS', 2, 'San Ricardo, Surigao del Norte', '086-231-1111', 'Junior High School', 'Mrs. Lourdes Cruz'),
('San Ricardo Elementary School', 'SRES', 2, 'Poblacion, San Ricardo', '086-231-2222', 'Elementary', 'Mr. Pedro Lim');

-- ============================================================
-- USERS
-- All passwords: password123
-- Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe
-- ============================================================

-- SUPERADMIN
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('System', 'Administrator', 'superadmin@lms.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'superadmin');

-- MAIN ADMINS
INSERT INTO users (first_name, last_name, email, password, role, location_id) VALUES
('Roberto', 'Villanueva', 'admin.surigao@lms.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'mainadmin', 1),
('Carmela', 'Bautista', 'admin.sanricardo@lms.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'mainadmin', 2);

-- SCHOOL ADMINS
INSERT INTO users (first_name, last_name, email, password, role, school_id, location_id) VALUES
('Grace', 'Domingo', 'admin@snnhs.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'schooladmin', 1, 1),
('Manuel', 'Fernandez', 'admin@scnchs.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'schooladmin', 2, 1),
('Felicia', 'Aquino', 'admin@srnhs.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'schooladmin', 4, 2);

-- TEACHERS (SNNHS - school_id=1)
INSERT INTO users (first_name, last_name, email, password, role, school_id, location_id, gender) VALUES
('Angelica', 'Torres', 'a.torres@snnhs.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'teacher', 1, 1, 'Female'),
('Benjamin', 'Ramos', 'b.ramos@snnhs.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'teacher', 1, 1, 'Male'),
('Cristina', 'Morales', 'c.morales@snnhs.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'teacher', 1, 1, 'Female');

-- STUDENTS (SNNHS - school_id=1)
INSERT INTO users (first_name, last_name, email, password, role, school_id, location_id, student_id_number, gender, birth_date) VALUES
('Juan', 'dela Cruz', 'juan.delacruz@student.lms.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'student', 1, 1, 'SNNHS-2024-001', 'Male', '2007-03-15'),
('Maria', 'Santos', 'maria.santos@student.lms.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'student', 1, 1, 'SNNHS-2024-002', 'Female', '2007-07-22'),
('Carlo', 'Reyes', 'carlo.reyes@student.lms.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'student', 1, 1, 'SNNHS-2024-003', 'Male', '2006-11-05'),
('Ana', 'Garcia', 'ana.garcia@student.lms.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'student', 1, 1, 'SNNHS-2024-004', 'Female', '2007-01-18'),
('Mark', 'Villanueva', 'mark.villanueva@student.lms.edu.ph',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj3YGAqpFpEe', 'student', 1, 1, 'SNNHS-2024-005', 'Male', '2006-09-30');

-- ============================================================
-- COURSES (SNNHS - school_id=1)
-- teacher_id=8 (Angelica Torres), 9 (Benjamin Ramos), 10 (Cristina Morales)
-- ============================================================
INSERT INTO courses (name, code, school_id, teacher_id, units, schedule, room, semester, academic_year) VALUES
('Oral Communication in Context', 'OCC-101', 1, 8, 3, 'MWF 7:30-8:30 AM', 'Room 101', '1st Semester', '2024-2025'),
('Statistics and Probability', 'STAT-101', 1, 9, 3, 'TTh 8:00-9:30 AM', 'Room 202', '1st Semester', '2024-2025'),
('Earth and Life Science', 'ELS-101', 1, 10, 3, 'MWF 9:30-10:30 AM', 'Lab 1', '1st Semester', '2024-2025'),
('Understanding Culture, Society and Politics', 'UCSP-101', 1, 8, 3, 'TTh 10:00-11:30 AM', 'Room 103', '1st Semester', '2024-2025'),
('Personal Development', 'PD-101', 1, 9, 3, 'MWF 1:00-2:00 PM', 'Room 201', '1st Semester', '2024-2025');

-- ============================================================
-- ENROLLMENTS (students 11-15 in courses 1-5)
-- ============================================================
INSERT INTO enrollments (student_id, course_id, school_id, enrollment_date, status, academic_year, semester, grade_level, section) VALUES
(11, 1, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Sampaguita'),
(11, 2, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Sampaguita'),
(11, 3, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Sampaguita'),
(12, 1, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Sampaguita'),
(12, 2, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Sampaguita'),
(13, 3, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Rosal'),
(13, 4, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Rosal'),
(14, 4, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Rosal'),
(14, 5, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Rosal'),
(15, 5, 1, '2024-06-03', 'Enrolled', '2024-2025', '1st Semester', 'Grade 11', 'Rosal');

-- ============================================================
-- EXAMS
-- ============================================================
INSERT INTO exams (course_id, school_id, title, type, exam_date, total_score, passing_score, is_published) VALUES
(1, 1, 'Quiz 1 - Speech Context', 'Quiz', '2024-07-15', 50.00, 30.00, 1),
(1, 1, 'Midterm Exam', 'Midterm', '2024-08-15', 100.00, 75.00, 1),
(2, 1, 'Quiz 1 - Basic Statistics', 'Quiz', '2024-07-18', 50.00, 30.00, 1),
(2, 1, 'Midterm Exam', 'Midterm', '2024-08-16', 100.00, 75.00, 1),
(3, 1, 'Lab Activity 1', 'Activity', '2024-07-20', 30.00, 20.00, 1);

-- ============================================================
-- GRADES
-- ============================================================
INSERT INTO grades (student_id, exam_id, course_id, score, graded_by) VALUES
(11, 1, 1, 42.00, 8),
(11, 2, 1, 88.00, 8),
(12, 1, 1, 38.00, 8),
(12, 2, 1, 79.00, 8),
(11, 3, 2, 45.00, 9),
(11, 4, 2, 92.00, 9),
(12, 3, 2, 40.00, 9),
(13, 5, 3, 27.00, 10),
(14, 5, 3, 28.00, 10);

-- ============================================================
-- ATTENDANCE (sample)
-- ============================================================
INSERT INTO attendance (student_id, course_id, teacher_id, date, status) VALUES
(11, 1, 8, '2024-07-08', 'Present'),
(11, 1, 8, '2024-07-10', 'Present'),
(11, 1, 8, '2024-07-12', 'Absent'),
(12, 1, 8, '2024-07-08', 'Present'),
(12, 1, 8, '2024-07-10', 'Late'),
(12, 1, 8, '2024-07-12', 'Present'),
(13, 3, 10, '2024-07-09', 'Present'),
(13, 3, 10, '2024-07-11', 'Excused'),
(14, 4, 8, '2024-07-09', 'Present'),
(15, 5, 9, '2024-07-08', 'Present');

-- ============================================================
-- EVENTS
-- ============================================================
INSERT INTO events (school_id, title, description, event_date, start_time, end_time, venue, type, is_school_wide, created_by) VALUES
(1, 'Recognition Day 2024', 'Annual recognition of honor students', '2024-08-30', '08:00:00', '12:00:00', 'School Gymnasium', 'Academic', 1, 5),
(1, 'SNNHS Sports Fest', 'Inter-class sports competition', '2024-09-15', '07:00:00', '17:00:00', 'School Grounds', 'Sports', 1, 5),
(1, 'Buwan ng Wika', 'Filipino language and culture celebration', '2024-08-23', '08:00:00', '15:00:00', 'School Auditorium', 'Cultural', 1, 5),
(NULL, 'Foundation Day - DepEd Surigao del Norte', 'Regional education foundation day', '2024-09-05', '08:00:00', '17:00:00', 'Capitol Complex, Surigao City', 'Academic', 0, 1);

-- ============================================================
-- PAYMENTS
-- ============================================================
INSERT INTO payments (student_id, school_id, reference_no, amount, payment_date, payment_type, payment_method, status, academic_year, semester, received_by) VALUES
(11, 1, 'PAY-2024-001', 2500.00, '2024-06-05', 'Tuition', 'Cash', 'Paid', '2024-2025', '1st Semester', 5),
(11, 1, 'PAY-2024-002', 500.00, '2024-06-05', 'Miscellaneous', 'Cash', 'Paid', '2024-2025', '1st Semester', 5),
(12, 1, 'PAY-2024-003', 2500.00, '2024-06-06', 'Tuition', 'GCash', 'Paid', '2024-2025', '1st Semester', 5),
(13, 1, 'PAY-2024-004', 2500.00, '2024-06-07', 'Tuition', 'Cash', 'Partial', '2024-2025', '1st Semester', 5),
(14, 1, 'PAY-2024-005', 2500.00, '2024-06-10', 'Tuition', 'Maya', 'Pending', '2024-2025', '1st Semester', NULL),
(15, 1, 'PAY-2024-006', 3000.00, '2024-06-10', 'Tuition', 'Bank Transfer', 'Overdue', '2024-2025', '1st Semester', NULL);

SELECT '✅ LMS Seed data inserted successfully!' AS status;
