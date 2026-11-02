@echo off
title Smart Care HMS - Launcher
color 0A
echo ===================================================
echo     SMART CARE HOSPITAL MANAGEMENT SYSTEM (HMS)
echo                  Quick Launcher
echo ===================================================
echo.

:: Detect Backend and Frontend directories
set "ROOT_DIR=%~dp0"
set "BACKEND_DIR="
set "FRONTEND_DIR="

if exist "%ROOT_DIR%backend\manage.py" (
    set "BACKEND_DIR=%ROOT_DIR%backend"
    set "FRONTEND_DIR=%ROOT_DIR%frontend"
) else if exist "%ROOT_DIR%hospital_manegment 4\hospital_manegment (2)\hospital_manegment\hospital_manegment\backend\manage.py" (
    set "BACKEND_DIR=%ROOT_DIR%hospital_manegment 4\hospital_manegment (2)\hospital_manegment\hospital_manegment\backend"
    set "FRONTEND_DIR=%ROOT_DIR%hospital_manegment 4\hospital_manegment (2)\hospital_manegment\hospital_manegment\frontend"
)

:: Fallback recursive search if path moved
if "%BACKEND_DIR%"=="" (
    for /f "delims=" %%F in ('dir /b /s /a:-d "%ROOT_DIR%manage.py" 2^>nul') do (
        set "BACKEND_DIR=%%~dpF"
    )
)
if "%FRONTEND_DIR%"=="" (
    for /f "delims=" %%F in ('dir /b /s /a:-d "%ROOT_DIR%vite.config.ts" 2^>nul') do (
        set "FRONTEND_DIR=%%~dpF"
    )
)

:: Trim trailing backslashes
if "%BACKEND_DIR:~-1%"=="\" set "BACKEND_DIR=%BACKEND_DIR:~0,-1%"
if "%FRONTEND_DIR:~-1%"=="\" set "FRONTEND_DIR=%FRONTEND_DIR:~0,-1%"

echo [INFO] Backend Directory:  "%BACKEND_DIR%"
echo [INFO] Frontend Directory: "%FRONTEND_DIR%"
echo.

:: Check for Python in venv or system
set "PY_CMD=%BACKEND_DIR%\venv\Scripts\python.exe"
if exist "%PY_CMD%" (
    echo [OK] Using Backend Virtualenv: "%BACKEND_DIR%\venv\Scripts\python.exe"
) else (
    set "PY_CMD=python"
    echo [INFO] Using System Python
)

:: Start Backend in new terminal window
echo [1/2] Starting Django Backend Server on http://127.0.0.1:8000 ...
start "SmartCare HMS - Backend (Django)" cmd /k "cd /d "%BACKEND_DIR%" && "%PY_CMD%" manage.py runserver 127.0.0.1:8000"

:: Wait 3 seconds
ping 127.0.0.1 -n 4 >nul 2>&1

:: Start Frontend in new terminal window
echo [2/2] Starting Vite Frontend Server on http://localhost:3000 ...
start "SmartCare HMS - Frontend (Vite React)" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

:: Wait 4 seconds then open browser
ping 127.0.0.1 -n 5 >nul 2>&1
echo.
echo ===================================================
echo   System Started Successfully!
echo   Frontend URL : http://localhost:3000
echo   Backend API  : http://127.0.0.1:8000
echo   Admin Panel  : http://127.0.0.1:8000/admin/
echo.
echo   Demo Login:
echo     Email    : admin@smartcare.com
echo     Password : Password@123
echo ===================================================
echo Opening application in default browser...
start http://localhost:3000

timeout /t 5 >nul 2>&1

