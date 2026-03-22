const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mainAdminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const auth = [protect, authorize('mainadmin', 'superadmin')];

router.post('/login', ctrl.login);
router.get('/dashboard', ...auth, ctrl.getDashboard);
router.get('/schools', ...auth, ctrl.getSchools);
router.post('/schools', ...auth, ctrl.createSchool);
router.put('/schools/:id', ...auth, ctrl.updateSchool);
router.get('/school-admins', ...auth, ctrl.getSchoolAdmins);
router.post('/school-admins', ...auth, ctrl.createSchoolAdmin);
router.get('/enrollments', ...auth, ctrl.getEnrollments);
router.patch('/enrollments/:id/approve', ...auth, ctrl.approveEnrollment);
router.get('/academic-records', ...auth, ctrl.getAcademicRecords);
router.get('/reports', ...auth, ctrl.getReports);

module.exports = router;
