# Leave Management System (Node.js REST API)

## Setup Steps
1. Run `npm install` to install dependencies.
2. Start the server: `npm run dev` (for development) or `npm start` (for production).

## Features
- Add employee
- Apply for leave
- Approve/Reject leave
- Fetch leave balance

## Assumptions
- Each employee starts with 20 leave days per year.
- Only HR can approve/reject leaves.
- Email is unique for each employee.

## Edge Cases Handled
- Leave before joining date
- Overlapping leave requests
- Insufficient leave balance
- Invalid dates
- Employee not found

## Potential Improvements
- Authentication & roles
- Email notifications
- Leave types (sick, casual, etc.)
- Pagination for employee/leave lists

## API Endpoints
- `POST /employees` — Add employee
- `POST /leaves/apply` — Apply for leave
- `POST /leaves/:id/approve` — Approve leave
- `POST /leaves/:id/reject` — Reject leave
- `GET /employees/:id/leave-balance` — Get leave balance

## HLD Diagram
See `docs/hld-diagram.png` (to be added)
