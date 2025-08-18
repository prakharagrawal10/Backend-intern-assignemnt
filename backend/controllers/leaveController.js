// Get all leaves for the logged-in employee
exports.getMyLeaves = async (req, res) => {
  try {
    // req.user.employee is set by auth middleware
    const employeeId = req.user.employee;
    if (!employeeId) return res.status(400).json({ error: 'Not an employee user.' });
    const leaves = await LeaveRequest.find({ employee_id: employeeId }).sort({ start_date: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your leaves.' });
  }
};
const LeaveRequest = require('../models/leaveRequest');
const Employee = require('../models/employee');

// Helper to count working days
function countWorkingDays(start, end) {
  let days = 0;
  let d = new Date(start);
  while (d <= end) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) days++;
    d.setDate(d.getDate() + 1);
  }
  return days;
}

exports.applyLeave = async (req, res) => {
  try {
    const { employee_id, start_date, end_date, reason } = req.body;
    if (!employee_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'employee_id, start_date, end_date required.' });
    }
    const start = new Date(start_date);
    const end = new Date(end_date);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (isNaN(start) || isNaN(end) || end < start) {
      return res.status(400).json({ error: 'Invalid dates.' });
    }
    if (start < today) {
      return res.status(400).json({ error: 'Cannot apply for leave in the past.' });
    }
    const emp = await Employee.findById(employee_id);
    if (!emp) return res.status(404).json({ error: 'Employee not found.' });
    if (start < new Date(emp.joining_date)) {
      return res.status(400).json({ error: 'Cannot apply for leave before joining date.' });
    }
    // Only one pending/approved leave at a time
    const activeLeaves = await LeaveRequest.find({
      employee_id,
      status: { $in: ['pending', 'approved'] }
    });
    if (activeLeaves.length > 0) {
      return res.status(400).json({ error: 'You already have a pending or approved leave.' });
    }
    // Calculate leave days excluding weekends
    let leaveDays = countWorkingDays(start, end);
    if (leaveDays < 1) {
      return res.status(400).json({ error: 'Minimum leave duration is 1 working day.' });
    }
    if (leaveDays > emp.leave_balance) {
      return res.status(400).json({ error: 'Insufficient leave balance.' });
    }
    // Check overlapping leaves
    const overlaps = await LeaveRequest.find({
      employee_id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { start_date: { $lte: start }, end_date: { $gte: start } },
        { start_date: { $lte: end }, end_date: { $gte: end } },
        { start_date: { $gte: start }, end_date: { $lte: end } }
      ]
    });
    if (overlaps.length > 0) {
      return res.status(400).json({ error: 'Overlapping leave request exists.' });
    }
    const leave = new LeaveRequest({ employee_id, start_date, end_date, reason });
    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply for leave.' });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave request not found.' });
    if (leave.status !== 'pending') return res.status(400).json({ error: 'Leave already processed.' });
    const emp = await Employee.findById(leave.employee_id);
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    let leaveDays = countWorkingDays(start, end);
    if (leaveDays > emp.leave_balance) {
      return res.status(400).json({ error: 'Insufficient leave balance.' });
    }
    leave.status = 'approved';
    await leave.save();
    emp.leave_balance -= leaveDays;
    await emp.save();
    res.json({ message: 'Leave approved.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve leave.' });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave request not found.' });
    if (leave.status !== 'pending') return res.status(400).json({ error: 'Leave already processed.' });
    leave.status = 'rejected';
    await leave.save();
    res.json({ message: 'Leave rejected.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject leave.' });
  }
};

exports.getPendingLeaves = async (req, res) => {
  try {
    // Only show leaves for employees managed by this HR
    const hrId = req.user && req.user.id;
    if (!hrId) return res.status(403).json({ error: 'HR authentication required.' });
    // Find employees managed by this HR
    const employees = await Employee.find({ hr: hrId }).select('_id');
    const employeeIds = employees.map(e => e._id);
    const pendingLeaves = await LeaveRequest.find({ status: 'pending', employee_id: { $in: employeeIds } })
      .populate('employee_id', 'name email department');
    res.json(pendingLeaves);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending leaves.' });
  }
};
