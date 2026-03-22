const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const auth = [protect, authorize('student', 'schooladmin', 'mainadmin', 'superadmin')];

router.post('/login', ctrl.login);
router.get('/dashboard', ...auth, ctrl.getDashboard);
router.get('/profile', ...auth, ctrl.getProfile);
router.put('/profile', ...auth, ctrl.updateProfile);
router.get('/courses', ...auth, ctrl.getCourses);
router.post('/courses/enroll', ...auth, ctrl.enrollCourse);
router.get('/attendance', ...auth, ctrl.getAttendance);
router.get('/exams', ...auth, ctrl.getExams);
router.get('/payments', ...auth, ctrl.getPayments);
router.get('/events', ...auth, ctrl.getEvents);

module.exports = router;
