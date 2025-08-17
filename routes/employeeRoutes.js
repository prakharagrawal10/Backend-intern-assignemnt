const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');

// HR only: Add employee
router.post('/', auth('hr'), employeeController.addEmployee);
// Employee or HR: Get leave balance
router.get('/:id/leave-balance', auth(), employeeController.getLeaveBalance);

module.exports = router;
