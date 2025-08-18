const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middleware/auth');

// Employee: Apply for leave
router.post('/apply', auth('employee'), leaveController.applyLeave);
// HR: Approve leave
router.post('/:id/approve', auth('hr'), leaveController.approveLeave);
// HR: Reject leave
router.post('/:id/reject', auth('hr'), leaveController.rejectLeave);

// HR: List all pending leaves
router.get('/pending', auth('hr'), leaveController.getPendingLeaves);

// Employee: List their own leaves
router.get('/my', auth('employee'), leaveController.getMyLeaves);

module.exports = router;
