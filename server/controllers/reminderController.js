const Reminder = require('../models/Reminder');

// @desc    Get all reminders for current user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
  try {
    const { date, completed, category } = req.query;
    const filter = { user: req.user._id };

    if (date) filter.date = date;
    if (completed !== undefined) filter.completed = completed === 'true';
    if (category) filter.category = category;

    const reminders = await Reminder.find(filter).sort({ date: 1, createdAt: -1 });

    return res.json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    console.error('[Get Reminders Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res) => {
  try {
    const { title, date, priority, category, time, notes } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: 'Reminder title and target date (YYYY-MM-DD) are required',
      });
    }

    const reminder = await Reminder.create({
      user: req.user._id,
      title: title.trim(),
      date,
      time: time || '',
      priority: priority || 'medium',
      category: category || 'work',
      notes: notes || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Reminder added successfully!',
      data: reminder,
    });
  } catch (error) {
    console.error('[Create Reminder Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOne({ _id: id, user: req.user._id });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found or unauthorized',
      });
    }

    const { title, date, priority, category, completed, time, notes } = req.body;

    if (title !== undefined) reminder.title = title.trim();
    if (date !== undefined) reminder.date = date;
    if (priority !== undefined) reminder.priority = priority;
    if (category !== undefined) reminder.category = category;
    if (completed !== undefined) reminder.completed = completed;
    if (time !== undefined) reminder.time = time;
    if (notes !== undefined) reminder.notes = notes;

    const updated = await reminder.save();

    return res.json({
      success: true,
      message: 'Reminder updated!',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle reminder completed status
// @route   PATCH /api/reminders/:id/toggle
// @access  Private
const toggleReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOne({ _id: id, user: req.user._id });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    reminder.completed = !reminder.completed;
    await reminder.save();

    return res.json({
      success: true,
      message: reminder.completed ? 'Marked task as completed!' : 'Marked task as pending',
      data: reminder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reminder.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found or unauthorized',
      });
    }

    return res.json({
      success: true,
      message: 'Reminder deleted successfully',
      data: { id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  toggleReminder,
  deleteReminder,
};
