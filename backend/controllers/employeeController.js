const Employee = require('../models/employee');

exports.addEmployee = async (req, res) => {
  try {
    const { name, email, department, joining_date } = req.body;
    if (!name || !email || !department || !joining_date) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already exists.' });
    const employee = new Employee({ name, email, department, joining_date });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add employee.' });
  }
};

exports.getLeaveBalance = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found.' });
    res.json({ leave_balance: emp.leave_balance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave balance.' });
  }
};
