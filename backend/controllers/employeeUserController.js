const Employee = require('../models/employee');
const User = require('../models/user');

// Unified creation: Add employee and user together
exports.addEmployeeWithUser = async (req, res) => {
  try {
    const { name, email, department, joining_date, username, password } = req.body;
    if (!name || !email || !department || !joining_date || !username || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    // Check for existing email or username
    const emailExists = await Employee.findOne({ email });
    if (emailExists) return res.status(409).json({ error: 'Email already exists.' });
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(409).json({ error: 'Username already exists.' });
  // Link employee to HR (req.user.id is HR's user ID)
  const hrId = req.user && req.user.id;
  if (!hrId) return res.status(403).json({ error: 'HR authentication required.' });
  // Create employee
  const employee = new Employee({ name, email, department, joining_date, hr: hrId });
  await employee.save();
  // Create user (role: employee)
  const user = new User({ username, password, role: 'employee', employee: employee._id });
  await user.save();
  res.status(201).json({ employee, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add employee and user.' });
  }
};
