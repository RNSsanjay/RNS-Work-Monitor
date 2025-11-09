# Work Hours Monitor - Project Summary

## 🎯 Project Overview

A complete work hours monitoring system with facial recognition that automatically tracks employee work time using OpenCV. The system features role-based access control for Admin, Manager, and Employee users.

## ✅ Completed Features

### Backend (FastAPI + MongoDB)
- ✅ User authentication with JWT tokens
- ✅ Role-based access control (Admin, Manager, Employee)
- ✅ MongoDB integration with async Motor driver
- ✅ Face and eye detection using OpenCV
- ✅ Automated work session tracking
- ✅ 5-minute eye detection window system
- ✅ RESTful API endpoints for all operations
- ✅ Work hours calculation and reporting
- ✅ Calendar-based data retrieval

### Frontend (React + Tailwind CSS)
- ✅ Modern responsive UI with Tailwind CSS
- ✅ User authentication (Login/Register)
- ✅ Role-based dashboards
- ✅ Real-time camera monitoring with react-webcam
- ✅ Live face and eye detection visualization
- ✅ Work session management
- ✅ Calendar view for work hours
- ✅ Employee management for managers
- ✅ System statistics for admins

### Key Components

#### Backend Structure
```
backend/
├── app/
│   ├── api/              # API endpoints
│   │   ├── auth.py       # Authentication
│   │   ├── users.py      # User management
│   │   ├── admin.py      # Admin operations
│   │   ├── managers.py   # Manager operations
│   │   ├── employees.py  # Employee operations
│   │   ├── work_sessions.py  # Session tracking
│   │   └── face_recognition.py  # Face detection
│   ├── core/             # Core functionality
│   │   ├── config.py     # Configuration
│   │   ├── database.py   # Database connection
│   │   └── security.py   # Security & JWT
│   ├── models/           # Pydantic models
│   │   ├── user.py
│   │   └── work_session.py
│   └── services/         # Business logic
│       ├── face_recognition.py  # OpenCV service
│       └── monitoring.py        # Monitoring logic
├── main.py              # Application entry
├── requirements.txt     # Dependencies
└── .env                # Configuration
```

#### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Main layout
│   │   └── CameraMonitor.jsx    # Camera interface
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── ManagerDashboard.jsx
│   │   └── EmployeeDashboard.jsx
│   ├── services/
│   │   └── api.js              # API client
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔑 Key Features Explained

### 1. Facial Recognition System
- **Face Detection**: Uses OpenCV Haar Cascades for real-time face detection
- **Eye Detection**: Tracks eye presence to measure active work time
- **Face Recognition**: face_recognition library for user verification
- **Automatic Detection**: No manual on/off, fully automated

### 2. Work Time Tracking
- **5-Minute Window**: Eyes must be detected continuously for 5 minutes
- **Automatic Logging**: Detection windows logged automatically
- **Real-time Progress**: Visual progress bar shows current detection window
- **Session Management**: Automatic session start/end based on shift times

### 3. Role-Based Access

#### Admin Features
- View all users across the organization
- Access system-wide statistics
- Calendar view with all employees' work hours
- Generate reports for any user or date range
- Manage user accounts

#### Manager Features
- View and manage assigned employees
- Set shift timings for employees
- View employee work hours by date
- Track own work hours
- Create new employee accounts

#### Employee Features
- Automatic camera activation on login
- Real-time face and eye detection display
- View active work time and session details
- Automatic session tracking based on shift
- Session history and reports

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: MongoDB with Motor (async driver)
- **Computer Vision**: OpenCV 4.8.1
- **Face Recognition**: face_recognition 1.3.0
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt
- **Python Version**: 3.8+

### Frontend
- **Framework**: React 18.2
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router 6.20
- **HTTP Client**: Axios 1.6
- **Camera**: react-webcam 7.2
- **Calendar**: react-calendar 4.8
- **Notifications**: react-toastify 9.1
- **Icons**: lucide-react 0.294
- **Build Tool**: Vite 5.0

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  full_name: String,
  password: String (hashed with bcrypt),
  role: String (admin/manager/employee),
  is_active: Boolean,
  manager_id: String (optional, for employees),
  shift_start: String (HH:MM format),
  shift_end: String (HH:MM format),
  face_registered: Boolean,
  face_image: String (file path),
  created_at: DateTime
}
```

### Work Sessions Collection
```javascript
{
  _id: ObjectId,
  user_id: String (ref: Users),
  user_name: String,
  start_time: DateTime,
  end_time: DateTime (optional),
  status: String (active/paused/completed),
  total_active_time: Number (seconds),
  eye_detection_logs: [{
    timestamp: DateTime,
    eyes_detected: Boolean,
    duration: Number (seconds)
  }],
  shift_start: String,
  shift_end: String,
  created_at: DateTime
}
```

## 🚀 How to Run

### Quick Setup
```powershell
# Run the setup script
.\setup.ps1
```

### Manual Setup

#### Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

#### Frontend
```powershell
cd frontend
npm install
npm run dev
```

### Using Helper Scripts
```powershell
# Terminal 1: Start backend
.\start-backend.ps1

# Terminal 2: Start frontend
.\start-frontend.ps1
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📝 API Endpoints Summary

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login and get JWT token
- GET `/api/auth/me` - Get current user info
- POST `/api/auth/logout` - Logout user

### Users
- GET `/api/users` - List users (filtered by role)
- GET `/api/users/{id}` - Get user details
- PUT `/api/users/{id}` - Update user
- DELETE `/api/users/{id}` - Delete user
- PUT `/api/users/{id}/shift` - Update shift timings

### Work Sessions
- POST `/api/work-sessions/start` - Start new session
- POST `/api/work-sessions/end/{id}` - End session
- GET `/api/work-sessions/active` - Get active session
- GET `/api/work-sessions/status` - Get monitoring status
- GET `/api/work-sessions/history` - Get session history
- GET `/api/work-sessions/{id}` - Get session details

### Face Recognition
- POST `/api/face/register-face` - Register user face
- POST `/api/face/detect` - Detect face and eyes
- POST `/api/face/verify` - Verify face match
- POST `/api/face/process-frame` - Process video frame
- GET `/api/face/check-registration` - Check if face registered

### Manager
- GET `/api/managers/employees` - Get managed employees
- POST `/api/managers/employees` - Create employee
- GET `/api/managers/work-hours` - Get own work hours
- GET `/api/managers/employees/{id}/work-hours` - Get employee hours

### Admin
- GET `/api/admin/users` - Get all users (filtered)
- GET `/api/admin/work-hours` - Get all work hours
- GET `/api/admin/calendar` - Get calendar data
- GET `/api/admin/statistics` - Get system statistics

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcrypt hashing for passwords
3. **Role-Based Access**: Endpoint protection by user role
4. **CORS Protection**: Configured CORS for frontend access
5. **Input Validation**: Pydantic models for data validation
6. **SQL Injection Protection**: MongoDB parameterized queries

## 📱 User Workflows

### Employee Workflow
1. Login to account
2. Camera activates automatically
3. System detects face and eyes
4. Work session starts (manual or automatic)
5. System tracks 5-minute eye detection windows
6. Active time accumulates automatically
7. View real-time statistics
8. End session when done

### Manager Workflow
1. Login to manager account
2. View list of assigned employees
3. Set shift timings for employees
4. Select employee to view details
5. Choose date to view work hours
6. See sessions and active time
7. Track own work hours if needed
8. Create new employee accounts

### Admin Workflow
1. Login to admin account
2. View system statistics dashboard
3. Access all users list
4. Filter by role (admin/manager/employee)
5. Use calendar to view work hours
6. Select date range for reports
7. View organization-wide data
8. Manage user accounts

## 🎨 UI Features

### Design
- Modern, clean interface with Tailwind CSS
- Responsive design for all screen sizes
- Gradient backgrounds and cards
- Smooth transitions and animations
- Icon-rich interface with lucide-react

### Components
- Real-time camera feed with annotations
- Progress bars for detection windows
- Calendar component for date selection
- Statistics cards with gradients
- Data tables with sorting
- Toast notifications for feedback
- Loading spinners for async operations

## 🔧 Configuration

### Environment Variables
All configuration in `backend/.env`:
- MongoDB connection string
- JWT secret key
- Server host and port
- Frontend URL for CORS
- Optional: Email, Gemini AI config

### Customization Points
- Eye detection threshold (default: 5 minutes)
- Frame capture interval (default: 2 seconds)
- Token expiration time (default: 30 minutes)
- Camera resolution settings
- Detection confidence thresholds

## 📦 Dependencies

### Backend Key Dependencies
- fastapi: Web framework
- uvicorn: ASGI server
- motor: Async MongoDB driver
- opencv-python: Computer vision
- face-recognition: Face detection
- python-jose: JWT handling
- passlib: Password hashing
- pydantic: Data validation

### Frontend Key Dependencies
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- react-webcam: Camera access
- tailwindcss: Styling
- react-calendar: Calendar component
- react-toastify: Notifications
- lucide-react: Icons

## 🐛 Known Considerations

### Performance
- Frame processing every 2 seconds (adjustable)
- MongoDB queries optimized with proper indexing
- Async operations for better concurrency
- Efficient state management in React

### Browser Compatibility
- Webcam requires HTTPS or localhost
- Modern browsers with WebRTC support
- Camera permissions must be granted

### System Requirements
- Webcam for facial recognition
- Internet connection for MongoDB Atlas
- Python 3.8+ for backend
- Node.js 16+ for frontend

## 📈 Future Enhancements

Potential additions:
- Face recognition for automatic login
- Mobile app (React Native)
- Real-time push notifications
- Advanced analytics and charts
- Email reports and notifications
- Geofencing for location tracking
- Break time management
- Overtime calculations
- Export to PDF/Excel
- Dark mode theme
- Multi-language support
- Integration with payroll systems

## 📞 Support

For issues or questions:
1. Check the README.md documentation
2. Review API documentation at /docs
3. Check the troubleshooting section
4. Verify environment configuration

## ✨ Highlights

- **Fully Automated**: No manual time tracking needed
- **Accurate**: 5-minute eye detection ensures accuracy
- **Real-time**: Live camera feed with detection overlay
- **Comprehensive**: Complete CRUD operations for all entities
- **Secure**: JWT authentication with role-based access
- **Modern**: Latest tech stack with best practices
- **Responsive**: Works on desktop and mobile browsers
- **Well-Documented**: Extensive documentation and comments

---

**Project Status**: ✅ Complete and Ready to Use  
**Version**: 1.0.0  
**Last Updated**: November 2025
