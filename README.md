# Work Hours Monitor

A comprehensive work hours monitoring system with facial recognition using OpenCV, FastAPI backend, and React frontend with Tailwind CSS.

## Features

### 👥 Role-Based Access Control
- **Admin**: View all employees and managers, access calendar view, system statistics
- **Manager**: Manage employees, set shift timings, view employee work hours, track own hours
- **Employee**: Automatic camera-based monitoring, face and eye detection tracking

### 🎥 Facial Recognition & Monitoring
- Real-time face detection using OpenCV
- Eye detection tracking for accurate work time measurement
- Automatic session start based on shift timing
- 5-minute eye detection window for time tracking
- No manual on/off - fully automated based on detection

### 📊 Features by Role

#### Admin Dashboard
- View all users (employees, managers, admins)
- Calendar view with date-wise work hours
- System-wide statistics
- User management
- Work hour reports for all employees

#### Manager Dashboard
- View and manage assigned employees
- Set employee shift timings
- View employee work hours with calendar
- Track own work hours
- Monitor employee attendance

#### Employee Interface
- Automatic camera activation on login
- Real-time face and eye detection display
- Automatic work session tracking
- View active time and session details
- Shift-based automatic monitoring

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **MongoDB**: Database with Motor async driver
- **OpenCV**: Face and eye detection
- **face_recognition**: Advanced facial recognition
- **JWT**: Secure authentication
- **Python 3.8+**

### Frontend
- **React 18**: Modern UI library
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **react-webcam**: Camera access
- **react-calendar**: Calendar component
- **react-toastify**: Notifications

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- MongoDB Atlas account (or local MongoDB)
- Webcam for facial recognition

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd RNS-Work-Monitor
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
.\venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# The .env file is already configured with your credentials
# Make sure MongoDB cluster is accessible
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## Running the Application

### 1. Start Backend Server

```bash
cd backend

# Activate virtual environment if not already activated
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Run the server
python main.py
```

The backend will start on `http://localhost:8000`

### 2. Start Frontend Development Server

```bash
cd frontend

# Run the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

### First Time Setup

1. **Register Users**
   - Navigate to `http://localhost:5173/register`
   - Create accounts for Admin, Manager, and Employee roles
   - Use the provided registration form

2. **Login**
   - Go to `http://localhost:5173/login`
   - Use your registered credentials

3. **Set Up Shifts (Manager/Admin)**
   - Managers can set shift timings for employees
   - Format: HH:MM (24-hour format)
   - Example: 09:00 - 17:00

### For Employees

1. **Login** to your account
2. **Camera automatically activates** upon reaching the dashboard
3. **Work session starts automatically** when shift time begins
4. **Face and eye detection** runs continuously
5. **Work time tracked** in 5-minute windows when eyes are detected
6. **Session ends** manually or automatically at shift end

### For Managers

1. **View Employees**: See all assigned employees
2. **Set Shifts**: Configure shift timings for each employee
3. **View Work Hours**: Check employee work hours by date
4. **Track Own Hours**: Monitor your own work time
5. **Calendar View**: Date-wise work hour overview

### For Admins

1. **System Overview**: View statistics and metrics
2. **User Management**: Access all users in the system
3. **Calendar View**: See organization-wide work hours
4. **Reports**: Generate work hour reports
5. **Role Management**: Manage user roles and permissions

## How Monitoring Works

### Automatic Work Session
- Session starts automatically when employee logs in during shift time
- Camera activates automatically (no manual control)
- Face detection confirms user presence
- Eye detection measures active work time

### Eye Detection Tracking
- System continuously monitors for eye detection
- **5-minute window**: Eyes must be detected for 5 consecutive minutes
- Time is added to active work hours when window completes
- Breaks or eye detection loss resets the window
- No manual intervention needed

### Work Time Calculation
- Only time with detected eyes counts as active time
- 5-minute minimum threshold ensures accuracy
- Automatic logging of detection windows
- Real-time progress display
- Session summary with total active hours

## API Documentation

### Backend API Endpoints

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Main API Routes

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

#### Users
- `GET /api/users` - Get users
- `GET /api/users/{user_id}` - Get specific user
- `PUT /api/users/{user_id}` - Update user
- `PUT /api/users/{user_id}/shift` - Update shift timings

#### Work Sessions
- `POST /api/work-sessions/start` - Start work session
- `POST /api/work-sessions/end/{session_id}` - End session
- `GET /api/work-sessions/active` - Get active session
- `GET /api/work-sessions/status` - Get monitoring status
- `GET /api/work-sessions/history` - Get session history

#### Face Recognition
- `POST /api/face/register-face` - Register face
- `POST /api/face/detect` - Detect face and eyes
- `POST /api/face/process-frame` - Process video frame
- `GET /api/face/check-registration` - Check face registration

#### Manager
- `GET /api/managers/employees` - Get managed employees
- `POST /api/managers/employees` - Create employee
- `GET /api/managers/work-hours` - Get manager work hours
- `GET /api/managers/employees/{id}/work-hours` - Get employee hours

#### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/work-hours` - Get all work hours
- `GET /api/admin/calendar` - Get calendar data
- `GET /api/admin/statistics` - Get system statistics

## Project Structure

```
RNS-Work-Monitor/
├── backend/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── auth.py       # Authentication
│   │   │   ├── users.py      # User management
│   │   │   ├── admin.py      # Admin endpoints
│   │   │   ├── managers.py   # Manager endpoints
│   │   │   ├── employees.py  # Employee endpoints
│   │   │   ├── work_sessions.py  # Work session tracking
│   │   │   └── face_recognition.py  # Face detection
│   │   ├── core/             # Core functionality
│   │   │   ├── config.py     # Configuration
│   │   │   ├── database.py   # Database connection
│   │   │   └── security.py   # Authentication & security
│   │   ├── models/           # Data models
│   │   │   ├── user.py       # User models
│   │   │   └── work_session.py  # Session models
│   │   └── services/         # Business logic
│   │       ├── face_recognition.py  # Face detection service
│   │       └── monitoring.py    # Monitoring service
│   ├── main.py              # Application entry point
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Layout.jsx   # Main layout
│   │   │   └── CameraMonitor.jsx  # Camera interface
│   │   ├── context/         # React context
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx    # Login page
│   │   │   ├── Register.jsx # Registration page
│   │   │   ├── AdminDashboard.jsx    # Admin dashboard
│   │   │   ├── ManagerDashboard.jsx  # Manager dashboard
│   │   │   └── EmployeeDashboard.jsx # Employee dashboard
│   │   ├── services/        # API services
│   │   │   └── api.js       # API client
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   └── tailwind.config.js   # Tailwind configuration
│
└── README.md               # This file
```

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error**
   ```
   Check MONGODB_URL in .env file
   Ensure MongoDB cluster is accessible
   Verify IP whitelist in MongoDB Atlas
   ```

2. **OpenCV/face_recognition Installation**
   ```bash
   # Windows: Install Visual C++ Build Tools
   # Then install dlib and face_recognition
   pip install cmake
   pip install dlib
   pip install face-recognition
   ```

3. **Port Already in Use**
   ```bash
   # Change PORT in .env file or
   # Kill process on port 8000
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   ```

### Frontend Issues

1. **Module Not Found**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Camera Not Working**
   - Check browser permissions for camera access
   - Use HTTPS or localhost (required for webcam)
   - Ensure no other application is using the camera

3. **API Connection Error**
   - Verify backend is running on port 8000
   - Check CORS configuration in backend
   - Verify proxy settings in vite.config.js

## Quick Start Guide

1. **Install Backend Dependencies**
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. **Install Frontend Dependencies**
   ```powershell
   cd frontend
   npm install
   ```

3. **Start Backend** (in one terminal)
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   python main.py
   ```

4. **Start Frontend** (in another terminal)
   ```powershell
   cd frontend
   npm run dev
   ```

5. **Open Browser**
   - Navigate to `http://localhost:5173`
   - Register a new account
   - Start using the application

## License

This project is proprietary software. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: November 2025