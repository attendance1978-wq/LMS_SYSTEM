const { asyncHandler } = require('../middleware/errorMiddleware');
const { generateToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Location = require('../models/Location');
const School = require('../models/School');
const { Op } = require('sequelize');

// @desc  Login
// @route POST /api/superadmin/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, role: 'superadmin', is_active: true } });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  await user.update({ last_login: new Date() });
  res.json({
    id: user.id,
    name: user.fullName(),
    email: user.email,
    role: user.role,
    token: generateToken(user.id, user.role),
  });
});

// @desc  Get dashboard stats
// @route GET /api/superadmin/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const totalLocations = await Location.count({ where: { is_active: true } });
  const totalSchools = await School.count({ where: { is_active: true } });
  const totalAdmins = await User.count({ where: { role: 'mainadmin', is_active: true } });
  const totalStudents = await User.count({ where: { role: 'student', is_active: true } });
  const totalTeachers = await User.count({ where: { role: 'teacher', is_active: true } });
  res.json({ totalLocations, totalSchools, totalAdmins, totalStudents, totalTeachers });
});

// @desc  Get all locations
// @route GET /api/superadmin/locations
exports.getLocations = asyncHandler(async (req, res) => {
  const locations = await Location.findAll({ order: [['name', 'ASC']] });
  res.json(locations);
});

// @desc  Create location
// @route POST /api/superadmin/locations
exports.createLocation = asyncHandler(async (req, res) => {
  const { name, province, region } = req.body;
  if (!name) return res.status(400).json({ message: 'Location name is required' });
  const exists = await Location.findOne({ where: { name } });
  if (exists) return res.status(400).json({ message: 'Location already exists' });
  const location = await Location.create({ name, province, region });
  res.status(201).json(location);
});

// @desc  Update location
// @route PUT /api/superadmin/locations/:id
exports.updateLocation = asyncHandler(async (req, res) => {
  const location = await Location.findByPk(req.params.id);
  if (!location) return res.status(404).json({ message: 'Location not found' });
  await location.update(req.body);
  res.json(location);
});

// @desc  Delete location
// @route DELETE /api/superadmin/locations/:id
exports.deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findByPk(req.params.id);
  if (!location) return res.status(404).json({ message: 'Location not found' });
  await location.update({ is_active: false });
  res.json({ message: 'Location deactivated' });
});

// @desc  Get all main admins
// @route GET /api/superadmin/admins
exports.getMainAdmins = asyncHandler(async (req, res) => {
  const admins = await User.findAll({
    where: { role: 'mainadmin' },
    attributes: { exclude: ['password'] },
    order: [['last_name', 'ASC']],
  });
  res.json(admins);
});

// @desc  Create main admin
// @route POST /api/superadmin/admins
exports.createMainAdmin = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone, location_id } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const admin = await User.create({
    first_name, last_name, email, password, phone, location_id, role: 'mainadmin',
  });
  res.status(201).json({
    id: admin.id,
    name: admin.fullName(),
    email: admin.email,
    role: admin.role,
  });
});

// @desc  Update main admin
// @route PUT /api/superadmin/admins/:id
exports.updateMainAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findOne({ where: { id: req.params.id, role: 'mainadmin' } });
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  const { password, ...data } = req.body;
  if (password) data.password = password;
  await admin.update(data);
  res.json({ message: 'Admin updated successfully' });
});

// @desc  Toggle admin status
// @route PATCH /api/superadmin/admins/:id/toggle
exports.toggleAdminStatus = asyncHandler(async (req, res) => {
  const admin = await User.findOne({ where: { id: req.params.id, role: 'mainadmin' } });
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  await admin.update({ is_active: !admin.is_active });
  res.json({ message: `Admin ${admin.is_active ? 'activated' : 'deactivated'}` });
});

// @desc  Get all schools
// @route GET /api/superadmin/schools
exports.getAllSchools = asyncHandler(async (req, res) => {
  const schools = await School.findAll({ order: [['name', 'ASC']] });
  res.json(schools);
});

// @desc  System report
// @route GET /api/superadmin/reports
exports.getSystemReport = asyncHandler(async (req, res) => {
  const data = {
    generated_at: new Date(),
    locations: await Location.findAll({ where: { is_active: true } }),
    schools_count: await School.count({ where: { is_active: true } }),
    users: {
      mainadmin: await User.count({ where: { role: 'mainadmin', is_active: true } }),
      schooladmin: await User.count({ where: { role: 'schooladmin', is_active: true } }),
      teacher: await User.count({ where: { role: 'teacher', is_active: true } }),
      student: await User.count({ where: { role: 'student', is_active: true } }),
    },
  };
  res.json(data);
});
