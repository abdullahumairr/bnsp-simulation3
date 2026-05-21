const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'guru'), attendanceController.getAttendances);
router.get('/siswa', protect, authorize('siswa'), attendanceController.getSiswaAttendance);
router.post('/', protect, attendanceController.createAttendance);
router.put('/:id', protect, authorize('admin', 'guru'), attendanceController.updateAttendance);
router.delete('/:id', protect, authorize('admin', 'guru'), attendanceController.deleteAttendance);

module.exports = router;