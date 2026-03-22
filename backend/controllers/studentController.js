const { asyncHandler } = require('../middleware/errorMiddleware');
const { generateToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Grade = require('../models/Grade');
const Payment = require('../models/Payment');
const Event = require('../models/Event');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

// @desc  Login
// @route POST /api/student/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, role: 'student', is_active: true } });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  await user.update({ last_login: new Date() });
  res.json({
    id: user.id, name: user.fullName(), email: user.email,
    role: user.role, school_id: user.school_id, student_id_number: user.student_id_number,
    token: generateToken(user.id, user.role),
  });
});

// @desc  Dashboard
// @route GET /api/student/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const student_id = req.user.id;
  const enrollments = await Enrollment.findAll({ where: { student_id, status: 'Enrolled' } });
  const courseIds = enrollments.map(e => e.course_id);
  const totalAttendance = await Attendance.count({ where: { student_id } });
  const presentCount = await Attendance.count({ where: { student_id, status: 'Present' } });
  const attendanceRate = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(1) : 0;
  res.json({
    enrolledCourses: enrollments.length,
    attendanceRate: `${attendanceRate}%`,
    upcomingExams: await Exam.count({ where: { course_id: { [Op.in]: courseIds }, exam_date: { [Op.gte]: new Date() }, is_published: true } }),
    pendingPayments: await Payment.count({ where: { student_id, status: { [Op.in]: ['Pending', 'Partial', 'Overdue'] } } }),
  });
});

// @desc  Get profile
// @route GET /api/student/profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  res.json(user);
});

// @desc  Update profile
// @route PUT /api/student/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { password, role, school_id, student_id_number, ...data } = req.body;
  if (password) data.password = password;
  await User.update(data, { where: { id: req.user.id } });
  res.json({ message: 'Profile updated' });
});

// @desc  Get enrolled courses
// @route GET /api/student/courses
exports.getCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.findAll({ where: { student_id: req.user.id, status: 'Enrolled' } });
  const courseIds = enrollments.map(e => e.course_id);
  const courses = await Course.findAll({ where: { id: { [Op.in]: courseIds } } });
  res.json(courses);
});

// @desc  Enroll in course
// @route POST /api/student/courses/enroll
exports.enrollCourse = asyncHandler(async (req, res) => {
  const { course_id } = req.body;
  if (!course_id) return res.status(400).json({ message: 'Course ID required' });
  const exists = await Enrollment.findOne({ where: { student_id: req.user.id, course_id, status: { [Op.in]: ['Pending', 'Enrolled'] } } });
  if (exists) return res.status(400).json({ message: 'Already enrolled or pending' });
  const enrollment = await Enrollment.create({
    student_id: req.user.id, course_id,
    school_id: req.user.school_id,
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'Pending',
  });
  res.status(201).json(enrollment);
});

// @desc  Get attendance
// @route GET /api/student/attendance
exports.getAttendance = asyncHandler(async (req, res) => {
  const { course_id } = req.query;
  const where = { student_id: req.user.id };
  if (course_id) where.course_id = course_id;
  const records = await Attendance.findAll({ where, order: [['date', 'DESC']] });
  const summary = {
    total: records.length,
    present: records.filter(r => r.status === 'Present').length,
    absent: records.filter(r => r.status === 'Absent').length,
    late: records.filter(r => r.status === 'Late').length,
    excused: records.filter(r => r.status === 'Excused').length,
  };
  summary.rate = summary.total > 0 ? `${((summary.present / summary.total) * 100).toFixed(1)}%` : '0%';
  res.json({ summary, records });
});

// @desc  Get exams & grades
// @route GET /api/student/exams
exports.getExams = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.findAll({ where: { student_id: req.user.id, status: 'Enrolled' } });
  const courseIds = enrollments.map(e => e.course_id);
  const exams = await Exam.findAll({ where: { course_id: { [Op.in]: courseIds }, is_published: true } });
  const examIds = exams.map(e => e.id);
  const grades = await Grade.findAll({ where: { student_id: req.user.id, exam_id: { [Op.in]: examIds } } });
  const result = exams.map(exam => {
    const grade = grades.find(g => g.exam_id === exam.id);
    return { ...exam.toJSON(), grade: grade ? grade.score : null, passed: grade ? grade.score >= exam.passing_score : null };
  });
  res.json(result);
});

// @desc  Get payments
// @route GET /api/student/payments
exports.getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.findAll({
    where: { student_id: req.user.id },
    order: [['payment_date', 'DESC']],
  });
  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalDue = payments.filter(p => p.status !== 'Paid' && p.status !== 'Cancelled').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  res.json({ summary: { totalPaid, totalDue }, payments });
});

// @desc  Get events
// @route GET /api/student/events
exports.getEvents = asyncHandler(async (req, res) => {
  const events = await Event.findAll({
    where: {
      school_id: req.user.school_id,
      event_date: { [Op.gte]: new Date() },
    },
    order: [['event_date', 'ASC']],
  });
  res.json(events);
});
