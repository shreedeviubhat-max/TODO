const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'first_step_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatarStyle } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password)',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Generate cute DiceBear seed based on name + timestamp
    const avatarSeed = `${name.replace(/\s+/g, '_')}_${Math.random().toString(36).substring(2, 7)}`;

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      avatarSeed,
      avatarStyle: avatarStyle || 'adventurer',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to First Step for Success.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarSeed: user.avatarSeed,
        avatarStyle: user.avatarStyle,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user with password field included
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Logged in successfully! Ready to take your next step.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarSeed: user.avatarSeed,
        avatarStyle: user.avatarStyle,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarSeed: user.avatarSeed,
        avatarStyle: user.avatarStyle,
        bio: user.bio,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update avatar seed or style
// @route   PUT /api/auth/avatar
// @access  Private
const updateAvatar = async (req, res) => {
  try {
    const { avatarSeed, avatarStyle } = req.body;
    const user = await User.findById(req.user._id);

    if (avatarSeed) user.avatarSeed = avatarSeed;
    if (avatarStyle) user.avatarStyle = avatarStyle;

    await user.save();

    return res.json({
      success: true,
      message: 'Avatar updated!',
      avatarSeed: user.avatarSeed,
      avatarStyle: user.avatarStyle,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateAvatar,
};
