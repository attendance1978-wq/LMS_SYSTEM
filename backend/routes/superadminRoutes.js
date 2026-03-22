const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/superadminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const auth = [protect, authorize('superadmin')];

router.post('/login', ctrl.login);
router.get('/dashboard', ...auth, ctrl.getDashboard);
router.get('/locations', ...auth, ctrl.getLocations);
router.post('/locations', ...auth, ctrl.createLocation);
router.put('/locations/:id', ...auth, ctrl.updateLocation);
router.delete('/locations/:id', ...auth, ctrl.deleteLocation);
router.get('/admins', ...auth, ctrl.getMainAdmins);
router.post('/admins', ...auth, ctrl.createMainAdmin);
router.put('/admins/:id', ...auth, ctrl.updateMainAdmin);
router.patch('/admins/:id/toggle', ...auth, ctrl.toggleAdminStatus);
router.get('/schools', ...auth, ctrl.getAllSchools);
router.get('/reports', ...auth, ctrl.getSystemReport);

module.exports = router;
