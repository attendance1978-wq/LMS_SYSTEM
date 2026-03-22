const { asyncHandler } = require('../middleware/errorMiddleware');
const { generateToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Event = require('../models/Event');
const { Op } = require('sequelize');

// @desc  Login
// @route POST /api/school-admin/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, role: 'schooladmin', is_active: true } });
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
// @route GET /api/school-admin/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const school_id = req.user.school_id;
  res.json({
    totalStudents: await User.count({ where: { role: 'student', school_id, is_active: true } }),
    totalTeachers: await User.count({ where: { role: 'teacher', school_id, is_active: true } }),
    totalCourses: await Course.count({ where: { school_id, is_active: true } }),
    pendingEnrollments: await Enrollment.count({ where: { school_id, status: 'Pending' } }),
    upcomingEvents: await Event.count({ where: { school_id, event_date: { [Op.gte]: new Date() } } }),
  });
});

// @desc  Get students
// @route GET /api/school-admin/students
exports.getStudents = asyncHandler(async (req, res) => {
  const { search, is_active } = req.query;
  const where = { role: 'student', school_id: req.user.school_id };
  if (is_active !== undefined) where.is_active = is_active === 'true';
  if (search) {
    where[Op.or] = [
      { first_name: { [Op.like]: `%${search}%` } },
      { last_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { student_id_number: { [Op.like]: `%${search}%` } },
    ];
  }
  const students = await User.findAll({ where, attributes: { exclude: ['password'] }, order: [['last_name', 'ASC']] });
  res.json(students);
});

// @desc  Create student
// @route POST /api/school-admin/students
exports.createStudent = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, student_id_number, phone, gender, birth_date, address } = req.body;
  if (!first_name || !last_name || !email || !password) return res.status(400).json({ message: 'Required fields missing' });
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const student = await User.create({
    first_name, last_name, email, password, student_id_number,
    phone, gender, birth_date, address,
    role: 'student', school_id: req.user.school_id, location_id: req.user.location_id,
  });
  res.status(201).json({ id: student.id, name: student.fullName(), student_id_number: student.student_id_number });
});

// @desc  Update student
// @route PUT /api/school-admin/students/:id
exports.updateStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({ where: { id: req.params.id, role: 'student', school_id: req.user.school_id } });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const { password, ...data } = req.body;
  if (password) data.password = password;
  await student.update(data);
  res.json({ message: 'Student updated' });
});

// @desc  Get teachers
// @route GET /api/school-admin/teachers
exports.getTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.findAll({
    where: { role: 'teacher', school_id: req.user.school_id, is_active: true },
    attributes: { exclude: ['password'] },
    order: [['last_name', 'ASC']],
  });
  res.json(teachers);
});

// @desc  Create teacher
// @route POST /api/school-admin/teachers
exports.createTeacher = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone, gender } = req.body;
  if (!first_name || !last_name || !email || !password) return res.status(400).json({ message: 'Required fields missing' });
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already exists' });
  const teacher = await User.create({
    first_name, last_name, email, password, phone, gender,
    role: 'teacher', school_id: req.user.school_id, location_id: req.user.location_id,
  });
  res.status(201).json({ id: teacher.id, name: teacher.fullName(), email: teacher.email });
});

// @desc  Get courses
// @route GET /api/school-admin/courses
exports.getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    where: { school_id: req.user.school_id, is_active: true },
    order: [['name', 'ASC']],
  });
  res.json(courses);
});

// @desc  Create course
// @route POST /api/school-admin/courses
exports.createCourse = asyncHandler(async (req, res) => {
  const data = { ...req.body, school_id: req.user.school_id };
  if (!data.name || !data.code) return res.status(400).json({ message: 'Name and code required' });
  const course = await Course.create(data);
  res.status(201).json(course);
});

// @desc  Update course
// @route PUT /api/school-admin/courses/:id
exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ where: { id: req.params.id, school_id: req.user.school_id } });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  await course.update(req.body);
  res.json(course);
});

// @desc  Get attendance summary
// @route GET /api/school-admin/attendance
exports.getAttendance = asyncHandler(async (req, res) => {
  const { date, course_id } = req.query;
  const where = {};
  if (date) where.date = date;
  if (course_id) where.course_id = course_id;
  const records = await Attendance.findAll({ where, order: [['date', 'DESC']] });
  res.json(records);
});

// @desc  Get exams
// @route GET /api/school-admin/exams
exports.getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.findAll({ where: { school_id: req.user.school_id }, order: [['exam_date', 'DESC']] });
  res.json(exams);
});

// @desc  Get events
// @route GET /api/school-admin/events
exports.getEvents = asyncHandler(async (req, res) => {
  const events = await Event.findAll({
    where: { school_id: req.user.school_id },
    order: [['event_date', 'ASC']],
  });
  res.json(events);
});

// @desc  Create event
// @route POST /api/school-admin/events
exports.createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({
    ...req.body,
    school_id: req.user.school_id,
    created_by: req.user.id,
  });
  res.status(201).json(event);
});
