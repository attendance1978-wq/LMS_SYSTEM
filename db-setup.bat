@echo off
title LMS Database Setup
color 0A

echo.
echo  ========================================
echo   LMS Database Setup
echo   Surigao del Norte - lms_db
echo  ========================================
echo.

:: Prompt for MySQL credentials
set /p MYSQL_USER=Enter MySQL username (default: root): 
if "%MYSQL_USER%"=="" set MYSQL_USER=root

set /p MYSQL_HOST=Enter MySQL host (default: localhost): 
if "%MYSQL_HOST%"=="" set MYSQL_HOST=localhost

echo.
echo  This will:
echo  1. Create database 'lms_db'
echo  2. Import schema (tables + indexes)
echo  3. Import seed data (locations, schools, users)
echo.
echo  Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo  [1/3] Creating database lms_db...
mysql -h %MYSQL_HOST% -u %MYSQL_USER% -p -e "CREATE DATABASE IF NOT EXISTS lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; SELECT 'Database created or already exists.' AS status;"

echo.
echo  [2/3] Importing schema...
mysql -h %MYSQL_HOST% -u %MYSQL_USER% -p lms_db < database\schema.sql

echo.
echo  [3/3] Importing seed data...
mysql -h %MYSQL_HOST% -u %MYSQL_USER% -p lms_db < database\seed.sql

echo.
echo  ========================================
echo   Database setup complete!
echo   Now run start.bat to launch the app.
echo  ========================================
echo.
pause
