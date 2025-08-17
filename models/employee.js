const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  joining_date: { type: Date, required: true },
  leave_balance: { type: Number, default: 20 }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
