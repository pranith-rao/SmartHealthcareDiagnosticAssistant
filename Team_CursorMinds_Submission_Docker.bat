@echo off
REM ================================================================
REM Team CursorMinds - Healthcare Diagnostic Assistant
REM DOCKER DEPLOYMENT - Submission Batch File for Technothon 2025
REM ================================================================

REM CRITICAL: Change to the directory where this batch file is located
cd /d "%~dp0"

echo.
echo ========================================================
echo    Team CursorMinds Healthcare Diagnostic Assistant
echo    DOCKER DEPLOYMENT
echo ========================================================
echo.
echo Current Directory: %CD%
echo.

REM Check if Docker is installed
echo [1/5] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop and try again.
    echo Download from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo [OK] Docker is installed
echo.

REM Check if Docker is running
echo [2/5] Checking if Docker is running...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo [OK] Docker is running
echo.

REM Check if port 3000 is available
echo [3/5] Checking if port 3000 is available...
netstat -ano | findstr :3000 >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Port 3000 is already in use
    echo Attempting to stop existing containers...
    docker-compose down >nul 2>&1
    timeout /t 3 /nobreak >nul
)
echo [OK] Port 3000 is available
echo.

REM Build Docker image
echo [4/5] Building Docker images...
echo This may take 5-10 minutes on first run...
echo Please wait...
docker-compose build
if errorlevel 1 (
    echo [ERROR] Docker build failed
    echo Please check your Docker installation and try again.
    pause
    exit /b 1
)
echo [OK] Docker images built successfully
echo.

REM Start the application
echo [5/5] Starting Team CursorMinds Healthcare Assistant with Docker...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start application
    pause
    exit /b 1
)

echo.
echo ========================================================
echo    Application Started Successfully with Docker!
echo ========================================================
echo.
echo Application is running on: http://localhost:3000
echo API Health Check: http://localhost:3000/api/v1/health
echo.
echo Services running:
echo   - Healthcare Assistant (Node.js + React)
echo   - MongoDB Database
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
echo ========================================================
echo.

REM Wait for services to start
echo Waiting for services to initialize...
timeout /t 10 /nobreak >nul

REM Check health
echo Checking application health...
curl -s http://localhost:3000/api/v1/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Application may still be starting up...
    echo Please wait 30 seconds and visit http://localhost:3000
) else (
    echo [OK] Application is healthy and ready!
    echo.
    echo Opening browser...
    start http://localhost:3000
)

echo.
echo Press any key to view application logs...
pause >nul
docker-compose logs -f

