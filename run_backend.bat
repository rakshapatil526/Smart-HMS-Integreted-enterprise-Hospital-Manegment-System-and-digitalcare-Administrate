@echo off
title SmartCare HMS - Backend
color 0B
echo Starting SmartCare HMS Django Backend...

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR="

if exist "%ROOT_DIR%backend\manage.py" (
    set "BACKEND_DIR=%ROOT_DIR%backend"
) else if exist "%ROOT_DIR%hospital_manegment 4\hospital_manegment (2)\hospital_manegment\hospital_manegment\backend\manage.py" (
    set "BACKEND_DIR=%ROOT_DIR%hospital_manegment 4\hospital_manegment (2)\hospital_manegment\hospital_manegment\backend"
)

if "%BACKEND_DIR%"=="" (
    for /f "delims=" %%F in ('dir /b /s /a:-d "%ROOT_DIR%manage.py" 2^>nul') do (
        set "BACKEND_DIR=%%~dpF"
    )
)

if "%BACKEND_DIR:~-1%"=="\" set "BACKEND_DIR=%BACKEND_DIR:~0,-1%"

set "PY_CMD=python"
if exist "%BACKEND_DIR%\venv\Scripts\python.exe" (
    set "PY_CMD=%BACKEND_DIR%\venv\Scripts\python.exe"
)

cd /d "%BACKEND_DIR%"
echo Running in: %CD%
echo Running command: "%PY_CMD%" manage.py runserver 127.0.0.1:8000
"%PY_CMD%" manage.py runserver 127.0.0.1:8000
pause
