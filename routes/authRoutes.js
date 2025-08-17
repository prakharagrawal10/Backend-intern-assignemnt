const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Employee = require('../models/employee');

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role, employee: user.employee }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ token, role: user.role, employee: user.employee });
});

// Create HR endpoint (open for MVP)
router.post('/create-hr', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ error: 'Username already exists' });
  const user = new User({ username, password, role: 'hr' });
  await user.save();
  res.status(201).json({ message: 'HR created' });
});

// Create Employee User (for demo)
router.post('/create-employee-user', async (req, res) => {
  const { username, password, employee_id } = req.body;
  if (!username || !password || !employee_id) return res.status(400).json({ error: 'All fields required' });
  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ error: 'Username already exists' });
  const emp = await Employee.findById(employee_id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  const user = new User({ username, password, role: 'employee', employee: employee_id });
  await user.save();
  res.status(201).json({ message: 'Employee user created' });
});

module.exports = router;
