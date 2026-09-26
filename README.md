# Leave Management System

A full-stack Leave Management System developed as part of the Full Stack Developer assessment for Exelon Circuits Pvt. Ltd.

The application provides separate employee and administrator workflows for authentication, leave application, leave approval/rejection, leave history, leave balance tracking, and administration.

## Live Application

- Frontend: https://leave-management-system-p42f.vercel.app
- Backend API: https://leave-management-system-chi-one.vercel.app
- GitHub Repository: https://github.com/Hawxisflying/leave-management-system

---

## Project Overview

The Leave Management System is a web application that allows employees to manage their leave requests and administrators to review and process those requests.

The application supports two roles:

- Employee
- Admin

Employees can log in, view their available leave balance, apply for leave, and track their leave requests.

Administrators can log in to a dedicated dashboard, view all employee leave requests, and approve or reject pending requests.

The application uses React.js for the frontend, Node.js and Express.js for the backend REST API, and MongoDB Atlas for persistent data storage.

---

## Features

### Employee Features

- Employee login
- JWT-based authentication
- Employee dashboard
- View available leave balance
- Apply for leave
- Select leave type
- Select start date and end date
- Enter leave reason
- View leave history
- View request status
- Track pending, approved, and rejected requests
- Automatic balance update after leave approval
- Client-side and server-side validation

### Admin Features

- Admin login
- Admin dashboard
- View all employee leave requests
- View pending leave requests
- Approve pending leave requests
- Reject pending leave requests
- Automatic employee leave balance deduction after approval
- Role-based access control

### Leave Validation

The application validates:

- Required fields
- Invalid dates
- Past leave start dates
- End date before start date
- Insufficient leave balance
- Unauthorized requests
- Invalid authentication tokens
- Already processed leave requests

Leave duration is calculated using inclusive dates.

---

## Employee Login

Employees use the login page to access the employee dashboard.

### Demo Employee Account

- Email: employee2@test.com
- Password: Test12345

After login, the employee can:

1. View the dashboard.
2. Check the available leave balance.
3. Apply for a new leave request.
4. View recent leave requests.
5. Open Leave History.
6. Track whether requests are Pending, Approved, or Rejected.

---

## Admin Login

Administrators use the same login system with an administrator account.

### Demo Admin Account

- Email: admin@leavems.com
- Password: Admin12345

After login, the administrator can:

1. Access the Admin Dashboard.
2. View all employee leave requests.
3. Review pending requests.
4. Approve a pending request.
5. Reject a pending request.
6. Process the employee leave workflow.

The admin endpoints are protected using role-based authorization.

---

## Architecture

The application follows a client-server architecture.

    React.js Frontend
            |
            | REST API / Axios
            |
            v
    Node.js + Express.js Backend
            |
            | Mongoose
            |
            v
       MongoDB Atlas

### Application Flow

1. The user opens the React frontend.
2. The user logs in using email and password.
3. The backend validates the credentials.
4. A JWT authentication token is generated.
5. The frontend uses the token for protected API requests.
6. Employees can create and view their leave requests.
7. Administrators can view and process employee requests.
8. Approved leave requests update the employee's leave balance.
9. MongoDB Atlas stores the application data persistently.

---

## Technology Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- Mongoose
- MongoDB
- JSON Web Token (JWT)
- bcrypt
- CORS

### Database

- MongoDB Atlas

### Version Control

- Git
- GitHub

### Deployment

- Vercel

---

## Project Structure

    leave-management-system/
    │
    ├── backend/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   │   ├── leave.js
    │   │   └── user.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   └── leaveRoutes.js
    │   ├── .env
    │   ├── .gitignore
    │   ├── package-lock.json
    │   ├── package.json
    │   └── server.js
    │
    ├── frontend/
    │   ├── dist/
    │   ├── node_modules/
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── pages/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── ApplyLeave.jsx
    │   │   │   ├── EmployeeDashboard.jsx
    │   │   │   ├── LeaveHistory.jsx
    │   │   │   └── Login.jsx
    │   │   ├── api.js
    │   │   ├── App.css
    │   │   ├── App.jsx
    │   │   ├── index.css
    │   │   └── main.jsx
    │   ├── .env
    │   ├── .gitignore
    │   ├── .oxlintrc.json
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── README.md
    │   ├── vercel.json
    │   └── vite.config.js
    │
    ├── .gitignore
    └── README.md

---

# Local Setup

## Prerequisites

The following software/services are required:

- Node.js
- npm
- Git
- MongoDB Atlas account

---

## 1. Clone the Repository

    git clone https://github.com/Hawxisflying/leave-management-system.git
    cd leave-management-system

---

## 2. Backend Setup

Navigate to the backend directory:

    cd backend

Install the backend dependencies:

    npm install

Create a `.env` file inside the `backend` directory.

Required variables:

    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret

Start the backend:

    npm run dev

The local backend runs on:

    http://localhost:5000

---

## 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

    cd frontend

Install the frontend dependencies:

    npm install

Create a `.env` file inside the `frontend` directory.

Required variable:

    VITE_API_URL=http://localhost:5000/api

Start the frontend:

    npm run dev

The local frontend runs on:

    http://localhost:5173

---

# Environment Variables

## Backend

| Variable | Description |
|---|---|
| PORT | Port used by the Express server |
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret used for JWT authentication |

Example:

    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret

## Frontend

| Variable | Description |
|---|---|
| VITE_API_URL | Base URL of the backend REST API |

Local configuration:

    VITE_API_URL=http://localhost:5000/api

Production configuration:

    VITE_API_URL=https://leave-management-system-chi-one.vercel.app/api

Sensitive environment files are excluded from Git using `.gitignore`.

MongoDB credentials and JWT secrets must not be committed to the repository.

---

# API Documentation

## API Base URL

The production API base URL is:

    https://leave-management-system-chi-one.vercel.app/api

Protected endpoints require JWT authentication.

The authentication token is sent using the Authorization header:

    Authorization: Bearer <JWT_TOKEN>

---

## Authentication APIs

### Register User

    POST /auth/register

Creates a new user account.

Request body:

    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "employee"
    }

Supported roles:

- employee
- admin

### Login

    POST /auth/login

Authenticates an employee or administrator.

Request body:

    {
      "email": "employee@example.com",
      "password": "password123"
    }

A successful login returns the authentication token and user information.

---

# Employee Leave APIs

### Apply for Leave

    POST /leaves

Creates a leave request for the authenticated employee.

Request body:

    {
      "leaveType": "Casual",
      "startDate": "2026-10-05",
      "endDate": "2026-10-06",
      "reason": "Personal work"
    }

The backend validates the dates and available leave balance before creating the request.

### Get My Leave History

    GET /leaves/my-leaves

Returns leave requests belonging to the authenticated employee.

### Get Leave Balance

    GET /leaves/balance

Returns the authenticated employee's current leave balance and employee information.

---

# Admin Leave APIs

### Get All Leave Requests

    GET /leaves/admin/all

Returns all employee leave requests for administrator review.

This endpoint requires admin authorization.

### Approve Leave Request

    PUT /leaves/admin/:id/approve

Approves a pending leave request.

When a request is approved:

- The request status changes to Approved.
- The approved leave duration is calculated.
- The employee's leave balance is reduced.
- The updated balance is returned by the API.

### Reject Leave Request

    PUT /leaves/admin/:id/reject

Rejects a pending leave request.

When a request is rejected:

- The request status changes to Rejected.
- The employee's leave balance is not deducted.

---

# Authentication and Authorization

The application uses JSON Web Tokens (JWT) for authentication.

After successful login:

1. The backend validates the user's credentials.
2. A JWT token is generated.
3. The frontend stores the authentication information.
4. Protected requests send the token using the Authorization header.

Example:

    Authorization: Bearer <JWT_TOKEN>

Admin-specific operations require the authenticated user's role to be `admin`.

Passwords are hashed using bcrypt before being stored.

---

# Leave Management Workflow

    Employee Login
          |
          v
    Employee Dashboard
          |
          v
      Apply Leave
          |
          v
    Leave Request Created
          |
          v
        Pending
          |
       +--+--+
       |     |
       v     v
    Approved Rejected
       |
       v
    Leave Balance Updated

---

# Database

MongoDB Atlas is used as the application's persistent database.

The database stores:

- User accounts
- User roles
- Password hashes
- Employee leave balances
- Leave requests
- Leave types
- Start and end dates
- Leave reasons
- Leave statuses

MongoDB Atlas provides persistent cloud storage for the deployed application.

---

# Validation and Error Handling

The backend handles common invalid operations including:

- Missing required fields
- Invalid leave dates
- Leave start date in the past
- End date before start date
- Insufficient leave balance
- Invalid login credentials
- Missing authentication token
- Invalid JWT token
- Unauthorized admin operations
- Non-existent leave requests
- Already processed leave requests

---

# Testing

## Employee Workflow

1. Open the live application.
2. Log in using the employee demo account.
3. Verify the employee dashboard.
4. Check the available leave balance.
5. Apply for a leave request.
6. Verify that the new request appears as Pending.
7. Open Leave History.
8. Verify the request details and status.

## Admin Workflow

1. Log in using the admin demo account.
2. Open the Admin Dashboard.
3. View the employee leave requests.
4. Select a pending request.
5. Approve or reject the request.
6. Verify the updated request status.

## Leave Balance Workflow

When an administrator approves a leave request, the approved number of leave days is deducted from the employee's available leave balance.

Rejected requests do not deduct leave balance.

---

# Deployment

The application is deployed using Vercel, with MongoDB Atlas used as the persistent database.

## Deployment Services

| Component | Service |
|---|---|
| Frontend | Vercel |
| Backend | Vercel |
| Database | MongoDB Atlas |
| Source Control | GitHub |

## Frontend Deployment

The React/Vite frontend is deployed on Vercel.

The frontend uses the production backend API through the `VITE_API_URL` environment variable.

## Backend Deployment

The Node.js/Express REST API is deployed on Vercel.

The backend uses MongoDB Atlas through the `MONGODB_URI` environment variable.

The backend also requires `JWT_SECRET` for authentication.

## Deployment Approach

1. Source code is maintained in GitHub.
2. The frontend and backend are deployed through Vercel.
3. MongoDB Atlas provides persistent database storage.
4. Environment variables are configured separately in Vercel.
5. Changes pushed to the main GitHub branch trigger new Vercel deployments.
6. The deployed frontend communicates with the deployed backend through REST APIs.

## Updating the Application

After making changes locally:

    git add .
    git commit -m "Update application"
    git push origin main

Vercel automatically detects the new GitHub commit and creates a new deployment.

---

# Security

The application includes:

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Protected API endpoints
- Environment variables for sensitive configuration
- `.env` files excluded from Git
- CORS configuration
- Server-side validation

Sensitive credentials such as MongoDB connection strings and JWT secrets are not stored in the GitHub repository.

---

# GitHub

The complete source code is maintained in the GitHub repository.

Repository:

https://github.com/Hawxisflying/leave-management-system

The `main` branch contains the current project source code.

---

# Conclusion

The Leave Management System provides a complete full-stack solution for employee leave management.

The project demonstrates:

- React.js frontend development
- Node.js development
- Express.js REST API development
- MongoDB and MongoDB Atlas integration
- JWT authentication
- Role-based authorization
- Employee and admin workflows
- Leave balance tracking
- Form and API validation
- Git and GitHub
- Vercel deployment

The application is available as a live deployment and the complete source code is available through GitHub.