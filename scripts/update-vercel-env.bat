@echo off
echo ========================================
echo Updating Vercel Environment Variables
echo ========================================
echo.

REM 检查是否安装了 Vercel CLI
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Vercel CLI not found. Installing...
    npm install -g vercel
)

echo [INFO] Logging into Vercel...
vercel login

echo.
echo ========================================
echo Updating Critical Variables
echo ========================================
echo.

REM 删除旧的错误变量
echo [1/3] Removing old AUTH_URL...
vercel env rm AUTH_URL production --yes 2>nul
vercel env rm AUTH_URL preview --yes 2>nul
vercel env rm AUTH_URL development --yes 2>nul

echo [2/3] Removing old BETTER_AUTH_URL...
vercel env rm BETTER_AUTH_URL production --yes 2>nul
vercel env rm BETTER_AUTH_URL preview --yes 2>nul
vercel env rm BETTER_AUTH_URL development --yes 2>nul

echo [3/3] Removing old NEXT_PUBLIC_APP_URL...
vercel env rm NEXT_PUBLIC_APP_URL production --yes 2>nul
vercel env rm NEXT_PUBLIC_APP_URL preview --yes 2>nul
vercel env rm NEXT_PUBLIC_APP_URL development --yes 2>nul

echo.
echo ========================================
echo Adding Correct Variables
echo ========================================
echo.

REM 添加正确的变量
echo [1/3] Adding AUTH_URL...
echo https://glownicheloyalty.vercel.app | vercel env add AUTH_URL production
echo https://glownicheloyalty.vercel.app | vercel env add AUTH_URL preview
echo https://glownicheloyalty.vercel.app | vercel env add AUTH_URL development

echo [2/3] Adding BETTER_AUTH_URL...
echo https://glownicheloyalty.vercel.app | vercel env add BETTER_AUTH_URL production
echo https://glownicheloyalty.vercel.app | vercel env add BETTER_AUTH_URL preview
echo https://glownicheloyalty.vercel.app | vercel env add BETTER_AUTH_URL development

echo [3/3] Adding NEXT_PUBLIC_APP_URL...
echo https://glownicheloyalty.vercel.app | vercel env add NEXT_PUBLIC_APP_URL production
echo https://glownicheloyalty.vercel.app | vercel env add NEXT_PUBLIC_APP_URL preview
echo https://glownicheloyalty.vercel.app | vercel env add NEXT_PUBLIC_APP_URL development

echo.
echo ========================================
echo Verifying Other Required Variables
echo ========================================
echo.

REM 确保其他必需变量存在（如果不存在则添加）
echo [INFO] Checking AUTH_SECRET...
vercel env ls | findstr "AUTH_SECRET" >nul
if %errorlevel% neq 0 (
    echo [ADD] Adding AUTH_SECRET...
    echo niche-loyalty-secret-key-production-2025 | vercel env add AUTH_SECRET production
    echo niche-loyalty-secret-key-production-2025 | vercel env add AUTH_SECRET preview
    echo niche-loyalty-secret-key-production-2025 | vercel env add AUTH_SECRET development
)

echo [INFO] Checking BETTER_AUTH_SECRET...
vercel env ls | findstr "BETTER_AUTH_SECRET" >nul
if %errorlevel% neq 0 (
    echo [ADD] Adding BETTER_AUTH_SECRET...
    echo niche-loyalty-secret-key-production-2025 | vercel env add BETTER_AUTH_SECRET production
    echo niche-loyalty-secret-key-production-2025 | vercel env add BETTER_AUTH_SECRET preview
    echo niche-loyalty-secret-key-production-2025 | vercel env add BETTER_AUTH_SECRET development
)

echo.
echo ========================================
echo SUCCESS! Environment Variables Updated
echo ========================================
echo.
echo [NEXT STEP] Redeploy your project:
echo   1. Visit: https://vercel.com/dashboard
echo   2. Go to: glow_niche_loyalty project
echo   3. Click: Deployments tab
echo   4. Click: ... menu on latest deployment
echo   5. Click: Redeploy
echo.
echo Or run: vercel --prod
echo.
pause







