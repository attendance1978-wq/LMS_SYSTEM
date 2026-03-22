const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

const auth = [protect, authorize('teacher', 'schooladmin', 'mainadmin', 'superadmin')];

router.post('/login', ctrl.login);
router.get('/dashboard', ...auth, ctrl.getDashboard);
router.get('/profile', ...auth, ctrl.getProfile);
router.put('/profile', ...auth, ctrl.updateProfile);
router.get('/classes', ...auth, ctrl.getClasses);
router.get('/classes/:courseId/students', ...auth, ctrl.getCourseStudents);
router.post('/attendance', ...auth, ctrl.markAttendance);
router.get('/attendance/:courseId', ...auth, ctrl.getCourseAttendance);
router.get('/exams', ...auth, ctrl.getExams);
router.post('/exams', ...auth, ctrl.createExam);
router.post('/exams/:examId/grades', ...auth, ctrl.submitGrades);

module.exports = router;
