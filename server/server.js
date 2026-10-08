require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const dailyLogRoutes = require('./routes/dailyLogRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cute cozy motivational quotes collection for welcoming dashboard & login vibe
const COZY_QUOTES = [
  { text: "Every big accomplishment starts with the decision to try.", author: "Gail Devers" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "One day or day one. You decide.", author: "Paulo Coelho" },
  { text: "Celebrate small wins. They turn into monumental momentum.", author: "James Clear" },
  { text: "Consistency is what transforms average into excellence.", author: "Anonymous" },
  { text: "Rest when you need to, but never give up on your journey.", author: "First Step Motto" },
];

// Public cozy quote endpoint
app.get('/api/quote', (req, res) => {
  const randomQuote = COZY_QUOTES[Math.floor(Math.random() * COZY_QUOTES.length)];
  res.json({
    success: true,
    data: randomQuote,
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'First Step for Success API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', dailyLogRoutes);
app.use('/api/reminders', reminderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`✨ "First Step for Success" server running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});
