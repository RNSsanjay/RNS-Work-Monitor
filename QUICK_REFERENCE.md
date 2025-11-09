# Quick Reference Guide

## 🚀 Quick Start Commands

### First Time Setup
```powershell
# Run automated setup (recommended)
.\setup.ps1

# OR manual setup:
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Frontend (in new terminal)
cd frontend
npm install
```

### Running the Application
```powershell
# Terminal 1: Backend
.\start-backend.ps1
# OR manually:
cd backend
.\venv\Scripts\Activate.ps1
python main.py

# Terminal 2: Frontend
.\start-frontend.ps1
# OR manually:
cd frontend
npm run dev
```

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:8000 | API endpoint |
| API Docs | http://localhost:8000/docs | Swagger UI |
| ReDoc | http://localhost:8000/redoc | Alternative API docs |

## 👥 User Roles & Capabilities

### Admin
- ✅ View all users
- ✅ View all work hours
- ✅ Calendar view (organization-wide)
- ✅ System statistics
- ✅ User management

### Manager
- ✅ View assigned employees
- ✅ Set employee shifts
- ✅ View employee work hours
- ✅ Create employees
- ✅ Track own hours

### Employee
- ✅ Camera monitoring
- ✅ Automatic time tracking
- ✅ View own sessions
- ✅ View work hours

## 📝 Common Tasks

### Register First Admin User
```
1. Go to http://localhost:5173/register
2. Fill in details
3. Select "Admin" role
4. Click Register
5. Login at /login
```

### Set Employee Shift (Manager/Admin)
```
1. Login as Manager/Admin
2. Navigate to employee list
3. Select employee
4. Set shift times (HH:MM format)
   Example: 09:00 to 17:00
5. Save changes
```

### Start Work Session (Employee)
```
1. Login as Employee
2. Camera activates automatically
3. Click "Start Monitoring"
4. Face and eyes detected automatically
5. Work time tracked in 5-minute windows
6. Click "End Session" when done
```

### View Work Hours (Manager)
```
1. Login as Manager
2. Select employee from list
3. Choose date
4. View sessions and total hours
```

### View Calendar (Admin)
```
1. Login as Admin
2. Go to Calendar View
3. Select date
4. See all users' work hours for that date
```

## 🔑 API Authentication

### Get Access Token
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Use Token in Requests
```bash
curl http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎥 Camera Monitoring

### Face Detection
- ✅ Detects face in frame
- ✅ Shows green indicator when detected
- ✅ Red indicator when not detected

### Eye Detection
- ✅ Detects both eyes
- ✅ Tracks for 5-minute windows
- ✅ Adds to active time when window completes
- ✅ Visual progress bar

### Detection Status
| Status | Meaning |
|--------|---------|
| 🟢 Face Detected | User present |
| 🔴 Face Not Found | User not visible |
| 👁️ Eyes Detected | Active working |
| 👁️‍🗨️ Eyes Not Found | Not looking at screen |

## 🛠️ Troubleshooting

### Backend Won't Start
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=8001
```

### Frontend Won't Start
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Camera Not Working
```
1. Check browser permissions
2. Allow camera access
3. Close other apps using camera
4. Use HTTPS or localhost only
5. Try different browser
```

### MongoDB Connection Error
```
1. Check MONGODB_URL in backend/.env
2. Verify cluster is running
3. Check IP whitelist (0.0.0.0/0 for all)
4. Test connection string
```

### Face Detection Not Working
```
1. Ensure good lighting
2. Face the camera directly
3. Remove glasses if possible
4. Adjust camera angle
5. Check detection confidence
```

## 📊 Database Collections

### users
```javascript
{
  email, username, full_name, password,
  role, is_active, manager_id,
  shift_start, shift_end,
  face_registered, face_image,
  created_at
}
```

### work_sessions
```javascript
{
  user_id, user_name,
  start_time, end_time, status,
  total_active_time,
  eye_detection_logs: [{
    timestamp, eyes_detected, duration
  }],
  shift_start, shift_end,
  created_at
}
```

## 🔐 Default Credentials

> **Important**: Create your own users via the registration page. There are no default credentials for security reasons.

## 📱 Testing the System

### Test as Employee
```
1. Register employee account
2. Login
3. Start monitoring
4. Verify camera feed
5. Check face/eye detection
6. Wait for 5-minute window
7. End session
8. View active time
```

### Test as Manager
```
1. Register manager account
2. Create test employee
3. Set employee shift
4. Login as employee (different browser)
5. Employee starts monitoring
6. Login as manager
7. View employee work hours
```

### Test as Admin
```
1. Register admin account
2. View all users
3. Check statistics
4. Select date in calendar
5. View organization work hours
```

## 🎯 Performance Tips

### Backend
- Use MongoDB indexes
- Enable connection pooling
- Adjust worker processes
- Cache frequent queries
- Monitor memory usage

### Frontend
- Adjust frame capture interval
- Use production build for deployment
- Enable lazy loading
- Optimize images
- Use code splitting

### Camera
- Lower resolution for better performance
- Adjust capture frequency
- Process frames on separate thread
- Use GPU acceleration if available

## 📦 Deployment Checklist

- [ ] Change SECRET_KEY in .env
- [ ] Use production MongoDB cluster
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set DEBUG=False
- [ ] Use environment variables
- [ ] Set up logging
- [ ] Configure backups
- [ ] Test all features
- [ ] Monitor performance

## 🆘 Getting Help

1. **Documentation**: Check README.md and PROJECT_SUMMARY.md
2. **API Docs**: Visit http://localhost:8000/docs
3. **Logs**: Check console output for errors
4. **Browser Console**: Press F12 for frontend errors
5. **MongoDB**: Check Atlas dashboard for database issues

## 📞 Support Resources

- README.md - Full documentation
- PROJECT_SUMMARY.md - Technical overview
- /docs endpoint - API documentation
- Browser DevTools - Frontend debugging
- Python logs - Backend debugging

## ⚡ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Ctrl+C | Stop server |
| F12 | Browser DevTools |
| F5 | Refresh page |
| Ctrl+Shift+R | Hard refresh |

## 🎨 Color Codes

### Status Colors
- 🟢 Green - Active/Success
- 🔴 Red - Error/Inactive
- 🟡 Yellow - Warning/Pending
- 🔵 Blue - Info/Primary

### Role Colors
- Admin - Blue
- Manager - Purple
- Employee - Green

---

**Quick Tip**: Keep this guide handy for day-to-day operations!
