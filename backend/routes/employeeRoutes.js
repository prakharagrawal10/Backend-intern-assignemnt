
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const employeeUserController = require('../controllers/employeeUserController');
const auth = require('../middleware/auth');

// HR only: Add employee (old, for backward compatibility)
router.post('/', auth('hr'), employeeController.addEmployee);
// HR only: Add employee + user in one step
router.post('/with-user', auth('hr'), employeeUserController.addEmployeeWithUser);
// Employee or HR: Get leave balance
router.get('/:id/leave-balance', auth(), employeeController.getLeaveBalance);

module.exports = router;
