require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

const Task = mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}));

// Authentication Middleware
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access denied. No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

// Routes

// Health Check
app.get('/', (req, res) => {
  res.send('Task App API is running');
});

// Token Verification
app.get('/verify-token', authenticate, (req, res) => {
  res.json({ 
    success: true,
    user: req.user 
  });
});

// User Registration
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { _id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      success: true,
      user: { email: user.email, _id: user._id },
      token 
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const token = jwt.sign(
      { _id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true,
      user: { email: user.email, _id: user._id },
      token 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Task Routes (Protected)
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res.json({ 
      success: true,
      tasks 
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

app.post('/tasks', authenticate, async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const task = new Task({ 
      title, 
      userId: req.user._id 
    });
    await task.save();
    
    res.status(201).json({ 
      success: true,
      task 
    });
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add task'
    });
  }
});

app.put('/tasks/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({ 
      success: true,
      task 
    });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

app.put('/tasks/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({ 
      success: true,
      task 
    });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

app.delete('/tasks/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({ 
      success: true,
      message: 'Task deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));