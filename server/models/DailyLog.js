const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Standardized ISO date string 'YYYY-MM-DD' for easy matching with calendar days
    date: {
      type: String,
      required: [true, 'Date in YYYY-MM-DD format is required'],
      index: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
    },
    // Array of completed work items / bullet points for the day
    bulletPoints: [
      {
        type: String,
        trim: true,
      },
    ],
    // Optional daily takeaway or note
    summary: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    // Optional cute mood indicator (e.g. 'productive', 'victorious', 'calm', 'focused')
    mood: {
      type: String,
      enum: ['productive', 'victorious', 'calm', 'focused', 'busy', 'tiring', ''],
      default: 'productive',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure that a user has only ONE daily log per specific date
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
