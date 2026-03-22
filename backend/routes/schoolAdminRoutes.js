const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/schoolAdminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const auth = [protect, authorize('schooladmin', 'mainadmin', 'superadmin')];

router.post('/login', ctrl.login);
router.get('/dashboard', ...auth, ctrl.getDashboard);
router.get('/students', ...auth, ctrl.getStudents);
router.post('/students', ...auth, ctrl.createStudent);
router.put('/students/:id', ...auth, ctrl.updateStudent);
router.get('/teachers', ...auth, ctrl.getTeachers);
router.post('/teachers', ...auth, ctrl.createTeacher);
router.get('/courses', ...auth, ctrl.getCourses);
router.post('/courses', ...auth, ctrl.createCourse);
router.put('/courses/:id', ...auth, ctrl.updateCourse);
router.get('/attendance', ...auth, ctrl.getAttendance);
router.get('/exams', ...auth, ctrl.getExams);
router.get('/events', ...auth, ctrl.getEvents);
router.post('/events', ...auth, ctrl.createEvent);

module.exports = router;
