const express = require('express');
const router = express.Router();
const {
  getLogs,
  getLogByDate,
  upsertLog,
  deleteLog,
} = require('../controllers/dailyLogController');
const { protect } = require('../middleware/authMiddleware');

// All daily log routes require authentication
router.use(protect);

router.get('/', getLogs);
router.get('/:date', getLogByDate);
router.post('/:date', upsertLog);
router.put('/:date', upsertLog);
router.delete('/:date', deleteLog);

module.exports = router;
