# Smart Care HMS PowerShell Launcher
Write-Host "===================================================" -ForegroundColor Green
Write-Host "    SMART CARE HOSPITAL MANAGEMENT SYSTEM (HMS)     " -ForegroundColor Cyan
Write-Host "                 PowerShell Launcher               " -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Green

$rootDir = $PSScriptRoot

# Locate Backend
$backendDir = Join-Path $rootDir "hospital_manegment 4\hospital_manegment (2)\hospital_manegment\hospital_manegment\backend"
if (-not (Test-Path (Join-Path $backendDir "manage.py"))) {
    $backendDir = Join-Path $rootDir "backend"
}
if (-not (Test-Path (Join-Path $backendDir "manage.py"))) {
    $found = Get-ChildItem -Path $rootDir -Filter "manage.py" -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) { $backendDir = $found.DirectoryName }
}

# Locate Frontend
$frontendDir = Join-Path $rootDir "hospital_manegment 4\hospital_manegment (2)\hospital_manegment\hospital_manegment\frontend"
if (-not (Test-Path (Join-Path $frontendDir "vite.config.ts"))) {
    $frontendDir = Join-Path $rootDir "frontend"
}
if (-not (Test-Path (Join-Path $frontendDir "vite.config.ts"))) {
    $found = Get-ChildItem -Path $rootDir -Filter "vite.config.ts" -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) { $frontendDir = $found.DirectoryName }
}

Write-Host "[INFO] Backend Path : $backendDir" -ForegroundColor Gray
Write-Host "[INFO] Frontend Path: $frontendDir" -ForegroundColor Gray

# Python executable
$pythonExe = "python"
$venvPython = Join-Path $backendDir "venv\Scripts\python.exe"
if (Test-Path $venvPython) {
    $pythonExe = $venvPython
    Write-Host "[OK] Using Virtualenv Python: $pythonExe" -ForegroundColor Green
}

# Start Backend in new process
Write-Host "`n[1/2] Starting Backend (Django) on http://127.0.0.1:8000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; & '$pythonExe' manage.py runserver 127.0.0.1:8000"

Start-Sleep -Seconds 2

# Start Frontend in new process
Write-Host "[2/2] Starting Frontend (Vite React) on http://localhost:3000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "`n===================================================" -ForegroundColor Green
Write-Host "  Hospital Management System is now RUNNING!      " -ForegroundColor Green
Write-Host "  Frontend URL : http://localhost:3000            " -ForegroundColor White
Write-Host "  Backend API  : http://127.0.0.1:8000            " -ForegroundColor White
Write-Host "  Admin Panel  : http://127.0.0.1:8000/admin/     " -ForegroundColor White
Write-Host "`n  Demo Admin Credentials:                        " -ForegroundColor Yellow
Write-Host "    Email    : admin@smartcare.com                " -ForegroundColor White
Write-Host "    Password : Password@123                       " -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Green

Start-Process "http://localhost:3000"
