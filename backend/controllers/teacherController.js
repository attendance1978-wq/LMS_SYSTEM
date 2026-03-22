const { asyncHandler } = require('../middleware/errorMiddleware');
const { generateToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Grade = require('../models/Grade');
const Enrollment = require('../models/Enrollment');
const { Op } = require('sequelize');

// @desc  Login
// @route POST /api/teacher/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, role: 'teacher', is_active: true } });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  await user.update({ last_login: new Date() });
  res.json({
    id: user.id, name: user.fullName(), email: user.email,
    role: user.role, school_id: user.school_id,
    token: generateToken(user.id, user.role),
  });
});

// @desc  Dashboard
// @route GET /api/teacher/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const teacher_id = req.user.id;
  const courses = await Course.findAll({ where: { teacher_id, is_active: true } });
  const courseIds = courses.map(c => c.id);
  const today = new Date().toISOString().split('T')[0];
  res.json({
    totalClasses: courses.length,
    totalStudents: await Enrollment.count({ where: { course_id: { [Op.in]: courseIds }, status: 'Enrolled' } }),
    todayAttendance: await Attendance.count({ where: { teacher_id, date: today } }),
    pendingGrades: await Exam.count({ where: { course_id: { [Op.in]: courseIds }, is_published: false } }),
  });
});

// @desc  Get teacher's classes/courses
// @route GET /api/teacher/classes
exports.getClasses = asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    where: { teacher_id: req.user.id, is_active: true },
    order: [['name', 'ASC']],
  });
  res.json(courses);
});

// @desc  Get students in a course
// @route GET /api/teacher/classes/:courseId/students
exports.getCourseStudents = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.findAll({
    where: { course_id: req.params.courseId, status: 'Enrolled' },
  });
  const studentIds = enrollments.map(e => e.student_id);
  const students = await User.findAll({
    where: { id: { [Op.in]: studentIds } },
    attributes: { exclude: ['password'] },
    order: [['last_name', 'ASC']],
  });
  res.json(students);
});

// @desc  Mark attendance
// @route POST /api/teacher/attendance
exports.markAttendance = asyncHandler(async (req, res) => {
  const { course_id, date, records } = req.body;
  if (!course_id || !date || !records?.length) {
    return res.status(400).json({ message: 'Course, date, and records required' });
  }
  const course = await Course.findOne({ where: { id: course_id, teacher_id: req.user.id } });
  if (!course) return res.status(403).json({ message: 'Not your course' });
  await Attendance.destroy({ where: { course_id, date } });
  const attendance = await Attendance.bulkCreate(
    records.map(r => ({ ...r, course_id, teacher_id: req.user.id, date }))
  );
  res.status(201).json({ message: `${attendance.length} records saved`, count: attendance.length });
});

// @desc  Get attendance for a course
// @route GET /api/teacher/attendance/:courseId
exports.getCourseAttendance = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const where = { course_id: req.params.courseId, teacher_id: req.user.id };
  if (date) where.date = date;
  const records = await Attendance.findAll({ where, order: [['date', 'DESC']] });
  res.json(records);
});

// @desc  Get exams for teacher's courses
// @route GET /api/teacher/exams
exports.getExams = asyncHandler(async (req, res) => {
  const courses = await Course.findAll({ where: { teacher_id: req.user.id }, attributes: ['id'] });
  const courseIds = courses.map(c => c.id);
  const exams = await Exam.findAll({
    where: { course_id: { [Op.in]: courseIds } },
    order: [['exam_date', 'DESC']],
  });
  res.json(exams);
});

// @desc  Create exam
// @route POST /api/teacher/exams
exports.createExam = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ where: { id: req.body.course_id, teacher_id: req.user.id } });
  if (!course) return res.status(403).json({ message: 'Not your course' });
  const exam = await Exam.create({ ...req.body, school_id: req.user.school_id });
  res.status(201).json(exam);
});

// @desc  Submit grades
// @route POST /api/teacher/exams/:examId/grades
exports.submitGrades = asyncHandler(async (req, res) => {
  const { grades } = req.body;
  if (!grades?.length) return res.status(400).json({ message: 'Grades array required' });
  const exam = await Exam.findByPk(req.params.examId);
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  await Grade.destroy({ where: { exam_id: req.params.examId } });
  const saved = await Grade.bulkCreate(
    grades.map(g => ({ ...g, exam_id: req.params.examId, course_id: exam.course_id, graded_by: req.user.id }))
  );
  await exam.update({ is_published: true });
  res.status(201).json({ message: `${saved.length} grades submitted` });
});

// @desc  Get profile
// @route GET /api/teacher/profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  res.json(user);
});

// @desc  Update profile
// @route PUT /api/teacher/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { password, role, school_id, ...data } = req.body;
  if (password) data.password = password;
  await User.update(data, { where: { id: req.user.id } });
  res.json({ message: 'Profile updated' });
});
