const express = require('express');
const router = express.Router();
const {
  getReminders,
  createReminder,
  updateReminder,
  toggleReminder,
  deleteReminder,
} = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

// All reminder routes require authentication
router.use(protect);

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.patch('/:id/toggle', toggleReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
