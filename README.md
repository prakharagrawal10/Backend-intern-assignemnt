# Leave Management System

A full-stack Leave Management System with role-based access for HR and Employees.

## Features
- HR and Employee login/signup
- Role-based UI (React)
- Leave application, approval, and tracking
- Employee management (HR)
- JWT authentication
- MongoDB database

## Setup Steps

### 1. Clone the repository
```
git clone <repo-url>
cd "intern assignemnt"
```

### 2. Backend Setup
```
cd src
npm install
```
- Create a `.env` file with:
  ```
  MONGODB_URI=<your-mongodb-uri>
  JWT_SECRET=<your-secret>
  PORT=4000
  ```
- Start the backend:
```
npm start
```

### 3. Frontend Setup
```
cd ../frontend
npm install
npm start
```
- The React app runs on http://localhost:3000
- The backend runs on http://localhost:4000

## Assumptions
- HR creates employee records before employee user accounts are created.
- Only HR can add employees and approve/reject leaves.
- Each employee has a unique Employee ID.
- JWT is used for stateless authentication.
- CORS is enabled for frontend-backend communication.

## Potential Improvements
- Add email notifications for leave status changes.
- Add password reset and email verification.
- Add pagination and search for employee/leave lists.
- Add audit logs for HR actions.
- Add file upload for supporting leave documents.
- Add mobile responsiveness and improved UI/UX.
- Add admin dashboard for analytics.
- Deploy using Docker and CI/CD pipeline.

## License
MIT
