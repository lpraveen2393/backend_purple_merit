# Mini User Management System

A full-stack MERN application with secure authentication, role-based access control, and user management capabilities.

## 🎯 Project Overview

The Mini User Management System is a complete web application that demonstrates modern full-stack development practices. It features secure user authentication, role-based authorization, and comprehensive user management functionality.

### User Roles

- **User**: Register, login, view/update profile, and change password
- **Admin**: View all users, manage user status (activate/deactivate), and access admin-only routes

This project was developed as part of the **Purple Merit Technologies assessment** to showcase full-stack development skills, API security, RBAC implementation, and clean application architecture.

---

## 🚀 Tech Stack

### Frontend
- React with Hooks
- React Router for navigation
- Axios for API calls
- Custom CSS (Dark themed UI)
- Deployed on Vercel

### Backend
- Node.js & Express.js
- MongoDB with MongoDB Atlas
- JWT for authentication
- bcrypt for password hashing
- Serverless deployment on Vercel

### Tools & Services
- Git & GitHub for version control
- MongoDB Atlas for database hosting
- Google Drive for demo videos

---

## 🌐 Live Deployment

- **Frontend**: https://backend-purple-merit-wox1.vercel.app/login
- **Backend API**: https://backend-purple-merit.vercel.app/

---

## 🎥 Demo Videos

- **Complete Application Walkthrough**: [Watch Demo](https://drive.google.com/file/d/1hY-Eo0rhAGxYLjATCdJUXUjEq_5qcIp7/view?usp=drivesdk)
- **Mobile View & Deployment**: [Watch Demo](https://drive.google.com/file/d/1QDciGfZ6j57loQnNZqH55KUnO8H4ricn/view?usp=drivesdk)

---

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mini-user-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend application will run on `http://localhost:3000`

---

## ⚙️ Environment Variables

Create a `.env` file in the **backend** directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=somewords
```

**Important**: Never commit `.env` files to version control. Add `.env` to your `.gitignore` file.

---

## 🔐 Authentication & Authorization

- JWT-based authentication system
- Secure password hashing using bcrypt
- Protected routes requiring authentication
- Role-based access control (Admin/User)
- Inactive user login prevention
- Token-based session management

---

## 📚 API Documentation

### Base URL

```
https://backend-purple-merit.vercel.app/api
```

### Authorization Header

For protected routes, include the JWT token:

```
Authorization: Bearer <JWT_TOKEN>
```

---

### Authentication Endpoints

#### Signup

```http
POST /auth/signup
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Account created successfully"
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

---

### User Endpoints

#### Get Current User Profile

```http
GET /users/me
```

**Response:**
```json
{
  "_id": "userId",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "status": "active"
}
```

#### Update Profile

```http
PUT /users/me
```

**Request Body:**
```json
{
  "fullName": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully"
}
```

#### Change Password

```http
PUT /users/change-password
```

**Request Body:**
```json
{
  "oldPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

---

### Admin Endpoints

#### Get All Users (Paginated)

```http
GET /users?page=1
```

**Response:**
```json
{
  "users": [],
  "currentPage": 1,
  "totalPages": 3
}
```

#### Activate User

```http
PATCH /users/:id/activate
```

**Response:**
```json
{
  "message": "User active"
}
```

#### Deactivate User

```http
PATCH /users/:id/deactivate
```

**Response:**
```json
{
  "message": "User inactive"
}
```

---

## 🚢 Deployment

### Backend Deployment (Vercel)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
4. Deploy as serverless Express application

### Frontend Deployment (Vercel)

1. Create production build: `npm run build`
2. Import project in Vercel dashboard
3. Configure environment variable pointing to backend API
4. Deploy the production build

---
