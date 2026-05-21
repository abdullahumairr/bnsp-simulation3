const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, subjectController.getSubjects);
router.post('/', protect, authorize('admin', 'guru'), subjectController.createSubject);
router.put('/:id', protect, authorize('admin', 'guru'), subjectController.updateSubject);
router.delete('/:id', protect, authorize('admin', 'guru'), subjectController.deleteSubject);

module.exports = router;