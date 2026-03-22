# ============================================================
# LMS System - PowerShell Setup Script
# Creates full directory structure and sets up project
# Run from the folder where you want to create lms-system/
# Usage: .\setup.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = Join-Path (Get-Location) "lms-system"

Write-Host "`n🚀 LMS System Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# ─── Create all directories ────────────────────────────────
$dirs = @(
    "backend\config",
    "backend\routes",
    "backend\controllers",
    "backend\models",
    "backend\middleware",
    "backend\utils",
    "frontend\public",
    "frontend\src\routes",
    "frontend\src\pages\Superadmin",
    "frontend\src\pages\MainAdmin",
    "frontend\src\pages\SchoolAdmin",
    "frontend\src\pages\Teacher",
    "frontend\src\pages\Student",
    "frontend\src\components",
    "frontend\src\context",
    "frontend\src\utils",
    "database",
    "deployment\nginx",
    "deployment\pm2",
    "deployment\backups\daily",
    "deployment\backups\weekly",
    "logs"
)

Write-Host "`n📁 Creating directory structure..." -ForegroundColor Yellow
foreach ($dir in $dirs) {
    $fullPath = Join-Path $ProjectRoot $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "  ✅ Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "  ⏭️  Exists:  $dir" -ForegroundColor DarkGray
    }
}

# ─── Create .env file from template ────────────────────────
$envContent = @"
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lms_db
DB_USER=root
DB_PASS=your_password_here

# JWT
JWT_SECRET=lms_super_secret_change_in_production_$(Get-Random -Minimum 100000 -Maximum 999999)
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=LMS System <noreply@lms.edu.ph>

# Backup
BACKUP_DIR=./deployment/backups

# Frontend URL
FRONTEND_URL=http://localhost:3000
"@

$envPath = Join-Path $ProjectRoot "backend\.env"
if (-not (Test-Path $envPath)) {
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "`n✅ Created: backend\.env" -ForegroundColor Green
} else {
    Write-Host "`n⏭️  Skipped: backend\.env (already exists)" -ForegroundColor DarkGray
}

# ─── Create .gitignore ─────────────────────────────────────
$gitignore = @"
# Dependencies
node_modules/
*/node_modules/

# Environment
.env
backend/.env

# Build
frontend/build/

# Logs
logs/
*.log

# Backups
deployment/backups/daily/
deployment/backups/weekly/

# OS
.DS_Store
Thumbs.db
"@

$gitignorePath = Join-Path $ProjectRoot ".gitignore"
$gitignore | Out-File -FilePath $gitignorePath -Encoding UTF8
Write-Host "✅ Created: .gitignore" -ForegroundColor Green

# ─── Install dependencies ──────────────────────────────────
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Push-Location (Join-Path $ProjectRoot "backend")
try {
    & npm install
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  npm install failed. Run manually: cd backend && npm install" -ForegroundColor Red
}
Pop-Location

Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Push-Location (Join-Path $ProjectRoot "frontend")
try {
    & npm install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  npm install failed. Run manually: cd frontend && npm install" -ForegroundColor Red
}
Pop-Location

# ─── Summary ───────────────────────────────────────────────
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "✅ LMS System setup complete!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Edit backend\.env with your MySQL credentials"
Write-Host "  2. Create MySQL database:"
Write-Host "     mysql -u root -p < database\schema.sql"
Write-Host "     mysql -u root -p lms_db < database\seed.sql"
Write-Host "  3. Start backend:"
Write-Host "     cd backend && npm run dev"
Write-Host "  4. Start frontend (new terminal):"
Write-Host "     cd frontend && npm start"
Write-Host "`n🌐 Access the app at: http://localhost:3000"
Write-Host "🔌 API running at:    http://localhost:5000/api"
Write-Host "`n👤 Default Login Credentials:"
Write-Host "  Superadmin : superadmin@lms.edu.ph"
Write-Host "  Main Admin : admin.surigao@lms.edu.ph"
Write-Host "  SchoolAdmin: admin@snnhs.edu.ph"
Write-Host "  Teacher    : a.torres@snnhs.edu.ph"
Write-Host "  Student    : juan.delacruz@student.lms.edu.ph"
Write-Host "  Password   : password123 (all accounts)"
Write-Host "`n==========================================" -ForegroundColor Cyan
