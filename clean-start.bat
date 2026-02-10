@echo off
echo ========================================
echo Niche Loyalty - Clean Start Script
echo ========================================
echo.

echo [1/3] Cleaning .next folder...
if exist .next (
    rmdir /s /q .next
    echo ✅ .next folder deleted
) else (
    echo ℹ️  .next folder not found
)
echo.

echo [2/3] Killing any running Node processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node processes terminated
) else (
    echo ℹ️  No Node processes running
)
echo.

echo [3/3] Starting development server...
echo.
pnpm dev

pause















