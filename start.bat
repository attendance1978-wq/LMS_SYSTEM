@echo off
title LMS System Launcher
color 0B

echo.
echo  ========================================
echo   LMS System - Surigao del Norte
echo  ========================================
echo.

:: Check if .env exists
if not exist "backend\.env" (
    echo  [ERROR] backend\.env not found!
    echo  Please copy backend\.env.example to backend\.env
    echo  and fill in your database credentials.
    pause
    exit /b 1
)

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Please install Node.js 18+
    echo  Download: https://nodejs.org
    pause
    exit /b 1
)

:: Install backend deps if needed
if not exist "backend\node_modules\" (
    echo  Installing backend dependencies...
    cd backend && npm install && cd ..
)

:: Install frontend deps if needed
if not exist "frontend\node_modules\" (
    echo  Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

echo  Starting LMS Backend on port 5000...
start "LMS Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo  Starting LMS Frontend on port 3000...
start "LMS Frontend" cmd /k "cd frontend && npm start"

echo.
echo  ========================================
echo   LMS is starting up!
echo   Backend:  http://localhost:5000/api
echo   Frontend: http://localhost:3000
echo  ========================================
echo.
echo  Default credentials (password: password123):
echo   Superadmin : superadmin@lms.edu.ph
echo   Main Admin : admin.surigao@lms.edu.ph
echo   SchoolAdmin: admin@snnhs.edu.ph
echo   Teacher    : a.torres@snnhs.edu.ph
echo   Student    : juan.delacruz@student.lms.edu.ph
echo.
pause
