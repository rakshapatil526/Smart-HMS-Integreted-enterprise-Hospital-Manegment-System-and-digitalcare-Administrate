@echo off
title SmartCare HMS - Frontend
color 0E
echo Starting SmartCare HMS Vite React Frontend...

set "ROOT_DIR=%~dp0"
set "FRONTEND_DIR="

if exist "%ROOT_DIR%frontend\vite.config.ts" (
    set "FRONTEND_DIR=%ROOT_DIR%frontend"
) else if exist "%ROOT_DIR%hospital_manegment 4\hospital_manegment (2)\hospital_manegment\hospital_manegment\frontend\vite.config.ts" (
    set "FRONTEND_DIR=%ROOT_DIR%hospital_manegment 4\hospital_manegment (2)\hospital_manegment\hospital_manegment\frontend"
)

if "%FRONTEND_DIR%"=="" (
    for /f "delims=" %%F in ('dir /b /s /a:-d "%ROOT_DIR%vite.config.ts" 2^>nul') do (
        set "FRONTEND_DIR=%%~dpF"
    )
)

if "%FRONTEND_DIR:~-1%"=="\" set "FRONTEND_DIR=%FRONTEND_DIR:~0,-1%"

cd /d "%FRONTEND_DIR%"
echo Running in: %CD%
echo Running command: npm run dev
npm run dev
pause
