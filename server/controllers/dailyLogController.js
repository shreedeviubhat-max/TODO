const DailyLog = require('../models/DailyLog');

// @desc    Get logs for a month (or all user logs)
// @route   GET /api/logs?month=YYYY-MM
// @access  Private
const getLogs = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = { user: req.user._id };

    if (month) {
      // Matches dates starting with YYYY-MM
      filter.date = { $regex: `^${month}` };
    }

    const logs = await DailyLog.find(filter).sort({ date: 1 });
    return res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error('[Get Logs Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single log by date
// @route   GET /api/logs/:date
// @access  Private
const getLogByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const log = await DailyLog.findOne({ user: req.user._id, date });

    if (!log) {
      return res.json({
        success: true,
        data: {
          date,
          bulletPoints: [],
          summary: '',
          mood: 'productive',
        },
      });
    }

    return res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update daily log for a specific date
// @route   PUT /api/logs/:date or POST /api/logs/:date
// @access  Private
const upsertLog = async (req, res) => {
  try {
    const { date } = req.params;
    const { bulletPoints, summary, mood } = req.body;

    // Filter out blank bullet points
    const cleanBullets = Array.isArray(bulletPoints)
      ? bulletPoints.map((bp) => (typeof bp === 'string' ? bp.trim() : '')).filter(Boolean)
      : [];

    const updatedLog = await DailyLog.findOneAndUpdate(
      { user: req.user._id, date },
      {
        user: req.user._id,
        date,
        bulletPoints: cleanBullets,
        summary: summary ? summary.trim() : '',
        mood: mood || 'productive',
      },
      {
        new: true,
        upsert: true, // create if not exists
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      success: true,
      message: 'Daily work log saved successfully!',
      data: updatedLog,
    });
  } catch (error) {
    console.error('[Upsert Log Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete daily log for a specific date
// @route   DELETE /api/logs/:date
// @access  Private
const deleteLog = async (req, res) => {
  try {
    const { date } = req.params;
    await DailyLog.findOneAndDelete({ user: req.user._id, date });
    return res.json({
      success: true,
      message: `Cleared daily log for ${date}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLogs,
  getLogByDate,
  upsertLog,
  deleteLog,
};
