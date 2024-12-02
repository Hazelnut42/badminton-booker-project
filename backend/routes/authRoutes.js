const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// User registration route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already exists'
      });
    }

    // Hash the password (simple hash with no external module)
    const hashedPassword = password.split('').reverse().join(''); // Simple example of hashing

    // Create a new user
    const user = new User({
      username,
      displayName: username, // Initial display name is the same as username
      email,
      password: hashedPassword, // Store hashed password
      bio: '' // Initialize with an empty bio
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check your username.' });
    }

    // Validate the password
    const hashedPassword = password.split('').reverse().join(''); // Simple hash to match registration
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        displayName: user.displayName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login. Please try again later.' });
  }
});

// Route to get current user information
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Route to update user profile - updates only displayName and bio
router.put('/profile/update', authenticateToken, async (req, res) => {
  try {
    const { displayName, bio } = req.body;

    // Validate displayName only
    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ message: 'Display name is required' });
    }

    // Update user information - updates only displayName and bio
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        displayName: displayName.trim(),
        bio: bio ? bio.trim() : ''
      },
      {
        new: true,
        select: '-password'
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;