const { asyncHandler } = require('../middleware/errorMiddleware');
const { generateToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const School = require('../models/School');
const Enrollment = require('../models/Enrollment');
const { Op } = require('sequelize');

// @desc  Login
// @route POST /api/main-admin/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, role: 'mainadmin', is_active: true } });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  await user.update({ last_login: new Date() });
  res.json({
    id: user.id,
    name: user.fullName(),
    email: user.email,
    role: user.role,
    location_id: user.location_id,
    token: generateToken(user.id, user.role),
  });
});

// @desc  Dashboard stats
// @route GET /api/main-admin/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const admin = req.user;
  const schoolWhere = admin.location_id ? { location_id: admin.location_id, is_active: true } : { is_active: true };
  const schools = await School.findAll({ where: schoolWhere });
  const schoolIds = schools.map(s => s.id);
  const totalSchools = schools.length;
  const totalSchoolAdmins = await User.count({ where: { role: 'schooladmin', school_id: { [Op.in]: schoolIds } } });
  const totalTeachers = await User.count({ where: { role: 'teacher', school_id: { [Op.in]: schoolIds } } });
  const totalStudents = await User.count({ where: { role: 'student', school_id: { [Op.in]: schoolIds } } });
  const pendingEnrollments = await Enrollment.count({ where: { school_id: { [Op.in]: schoolIds }, status: 'Pending' } });
  res.json({ totalSchools, totalSchoolAdmins, totalTeachers, totalStudents, pendingEnrollments });
});

// @desc  Get schools by location
// @route GET /api/main-admin/schools
exports.getSchools = asyncHandler(async (req, res) => {
  const where = req.user.location_id ? { location_id: req.user.location_id } : {};
  const schools = await School.findAll({ where, order: [['name', 'ASC']] });
  res.json(schools);
});

// @desc  Create school
// @route POST /api/main-admin/schools
exports.createSchool = asyncHandler(async (req, res) => {
  const { name, short_name, location_id, address, phone, email, principal_name, school_type } = req.body;
  if (!name || !location_id) return res.status(400).json({ message: 'Name and location required' });
  const school = await School.create({ name, short_name, location_id, address, phone, email, principal_name, school_type });
  res.status(201).json(school);
});

// @desc  Update school
// @route PUT /api/main-admin/schools/:id
exports.updateSchool = asyncHandler(async (req, res) => {
  const school = await School.findByPk(req.params.id);
  if (!school) return res.status(404).json({ message: 'School not found' });
  await school.update(req.body);
  res.json(school);
});

// @desc  Get school admins
// @route GET /api/main-admin/school-admins
exports.getSchoolAdmins = asyncHandler(async (req, res) => {
  const admins = await User.findAll({
    where: { role: 'schooladmin', is_active: true },
    attributes: { exclude: ['password'] },
    order: [['last_name', 'ASC']],
  });
  res.json(admins);
});

// @desc  Create school admin
// @route POST /api/main-admin/school-admins
exports.createSchoolAdmin = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone, school_id, location_id } = req.body;
  if (!first_name || !last_name || !email || !password || !school_id) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already exists' });
  const admin = await User.create({ first_name, last_name, email, password, phone, school_id, location_id, role: 'schooladmin' });
  res.status(201).json({ id: admin.id, name: admin.fullName(), email: admin.email });
});

// @desc  Get all enrollments
// @route GET /api/main-admin/enrollments
exports.getEnrollments = asyncHandler(async (req, res) => {
  const { status, school_id, academic_year } = req.query;
  const where = {};
  if (status) where.status = status;
  if (school_id) where.school_id = school_id;
  if (academic_year) where.academic_year = academic_year;
  const enrollments = await Enrollment.findAll({ where, order: [['enrollment_date', 'DESC']] });
  res.json(enrollments);
});

// @desc  Approve enrollment
// @route PATCH /api/main-admin/enrollments/:id/approve
exports.approveEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id);
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
  await enrollment.update({ status: 'Enrolled' });
  res.json({ message: 'Enrollment approved' });
});

// @desc  Get academic records summary
// @route GET /api/main-admin/academic-records
exports.getAcademicRecords = asyncHandler(async (req, res) => {
  const { school_id, academic_year } = req.query;
  const where = {};
  if (school_id) where.school_id = school_id;
  if (academic_year) where.academic_year = academic_year;
  const records = await Enrollment.findAll({ where });
  res.json({ total: records.length, records });
});

// @desc  Reports
// @route GET /api/main-admin/reports
exports.getReports = asyncHandler(async (req, res) => {
  const schools = await School.findAll({ where: req.user.location_id ? { location_id: req.user.location_id } : {} });
  const schoolIds = schools.map(s => s.id);
  res.json({
    generated_at: new Date(),
    schools: schools.length,
    enrollments: await Enrollment.count({ where: { school_id: { [Op.in]: schoolIds } } }),
    students: await User.count({ where: { role: 'student', school_id: { [Op.in]: schoolIds } } }),
    teachers: await User.count({ where: { role: 'teacher', school_id: { [Op.in]: schoolIds } } }),
  });
});
