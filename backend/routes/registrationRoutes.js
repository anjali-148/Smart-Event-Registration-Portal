const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getMyRegistrations,
  getAllRegistrations,
  updateRegistrationStatus,
  exportRegistrations,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, createRegistration);
router.get('/my', protect, getMyRegistrations);
router.get('/export', protect, adminOnly, exportRegistrations);
router.get('/', protect, adminOnly, getAllRegistrations);
router.put('/:id/status', protect, adminOnly, updateRegistrationStatus);

module.exports = router;