@echo off
setlocal enabledelayedexpansion

REM ================================================================
REM Team CursorMinds - Healthcare Diagnostic Assistant
REM FIXED VERSION - More Robust Error Handling
REM ================================================================

REM Change to the directory where this batch file is located
cd /d "%~dp0"

echo.
echo ========================================================
echo    Team CursorMinds Healthcare Diagnostic Assistant
echo    MANUAL DEPLOYMENT (Without Docker)
echo ========================================================
echo.
echo Current Directory: %CD%
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again.
    echo Download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
call node --version
echo [OK] Node.js is installed
echo.

REM Check if npm is installed
echo [2/6] Checking npm installation...
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed
    echo Please install Node.js which includes npm.
    echo.
    pause
    exit /b 1
)
call npm --version
echo [OK] npm is installed
echo.

REM MongoDB check
echo [3/6] Checking MongoDB connection...
echo Note: This app will work with or without MongoDB.
echo.

REM Install backend dependencies if not exists
echo [4/6] Checking backend dependencies...
if not exist "node_modules\" (
    echo Installing backend packages - this will take 2-3 minutes...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install backend dependencies
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)
echo.

REM Install frontend dependencies if not exists
echo [5/6] Checking frontend dependencies...
if not exist "src\frontend\node_modules\" (
    echo Installing frontend packages - this will take 2-3 minutes...
    echo.
    cd src\frontend
    call npm install
    set FRONTEND_INSTALL_ERROR=%errorlevel%
    cd ..\..
    if not !FRONTEND_INSTALL_ERROR!==0 (
        echo.
        echo [ERROR] Failed to install frontend dependencies
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)
echo.

REM Check if port 3000 is available
echo [6/6] Checking if port 3000 is available...
netstat -ano | findstr :3000 >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Port 3000 is already in use
    echo.
    echo Please close the application using port 3000 or:
    echo 1. Find the process: netstat -ano ^| findstr :3000
    echo 2. Kill the process: taskkill /PID [PID] /F
    echo.
    pause
    exit /b 1
)
echo [OK] Port 3000 is available
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    (
        echo NODE_ENV=production
        echo PORT=3000
        echo HOST=0.0.0.0
        echo MONGODB_URI=mongodb://localhost:27017/healthcare_assistant
        echo JWT_SECRET=cursorminds-healthcare-secret-key-2025
        echo ENABLE_AUDIT_LOGGING=true
        echo DATA_ENCRYPTION=true
    ) > .env
    echo [OK] .env file created
    echo.
)

REM Always build frontend to ensure latest changes
echo Building React frontend for production...
echo Building frontend assets - this may take 1-2 minutes...
cd src\frontend
call npm run build
set BUILD_ERROR=%errorlevel%
if exist "dist" (
    echo Copying from dist folder...
    if not exist "..\backend\public\" mkdir ..\backend\public
    xcopy /E /I /Y dist\* ..\backend\public\ >nul 2>&1
)
if exist "build" (
    echo Copying from build folder...
    if not exist "..\backend\public\" mkdir ..\backend\public
    xcopy /E /I /Y build\* ..\backend\public\ >nul 2>&1
    REM Also copy assets folder specifically
    if not exist "..\backend\public\assets\" mkdir ..\backend\public\assets
    xcopy /E /I /Y build\assets\* ..\backend\public\assets\ >nul 2>&1
)
cd ..\..
if not !BUILD_ERROR!==0 (
    echo [WARNING] Frontend build had issues, but backend will still run
) else (
    echo [OK] Frontend built successfully
)
echo.

echo ========================================================
echo    Starting Application...
echo ========================================================
echo.
echo Application will be available at: http://localhost:3000
echo API endpoints: http://localhost:3000/api/v1
echo Health Check: http://localhost:3000/api/v1/health
echo.
echo To stop the application: Press Ctrl+C
echo.
echo ========================================================
echo.

REM Start the backend server
echo Starting server...
echo.
echo ========================================================
echo    Browser will open automatically in 20 seconds
echo    Please wait while the server initializes...
echo ========================================================
echo.

REM Open browser after 20 seconds (enough time for server to start)
start /B cmd /c "timeout /t 20 /nobreak >nul && start http://localhost:3000"

REM Show message
echo Server is starting...
echo.
echo NOTE: First run may take 30-60 seconds to download MongoDB binaries
echo       Subsequent runs will be much faster (5-10 seconds)
echo.
echo ========================================================
echo.

REM Start Node.js server
node src/backend/server.js

REM If server stops
echo.
echo ========================================================
echo    Server Stopped
echo ========================================================
echo.
pause

