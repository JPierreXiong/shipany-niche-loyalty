# Vercel 部署脚本 (PowerShell)
# 使用方法: .\deploy-to-vercel.ps1

Write-Host "🚀 开始部署到 Vercel..." -ForegroundColor Green
Write-Host ""

# 检查是否安装了 Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI 未安装" -ForegroundColor Red
    Write-Host "📦 正在安装 Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI 已就绪" -ForegroundColor Green
Write-Host ""

# 检查是否已登录
Write-Host "🔐 检查登录状态..." -ForegroundColor Cyan
$loginCheck = vercel whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "📝 请登录 Vercel..." -ForegroundColor Yellow
    vercel login
}

Write-Host "✅ 已登录 Vercel" -ForegroundColor Green
Write-Host ""

# 显示环境变量提醒
Write-Host "⚠️  重要提醒：请确保已在 Vercel Dashboard 配置以下环境变量：" -ForegroundColor Yellow
Write-Host ""
Write-Host "必需的环境变量：" -ForegroundColor White
Write-Host "  - DATABASE_URL"
Write-Host "  - BETTER_AUTH_SECRET"
Write-Host "  - BETTER_AUTH_URL"
Write-Host "  - RESEND_API_KEY"
Write-Host "  - QSTASH_CURRENT_SIGNING_KEY"
Write-Host "  - QSTASH_NEXT_SIGNING_KEY"
Write-Host "  - QSTASH_TOKEN"
Write-Host ""
Write-Host "可选的环境变量：" -ForegroundColor Gray
Write-Host "  - SHOPIFY_STORE_DOMAIN"
Write-Host "  - SHOPIFY_ACCESS_TOKEN"
Write-Host "  - CREEM_API_KEY"
Write-Host ""

$response = Read-Host "是否已配置所有必需的环境变量？(y/n)"

if ($response -ne "y" -and $response -ne "Y") {
    Write-Host "❌ 请先在 Vercel Dashboard 配置环境变量" -ForegroundColor Red
    Write-Host "📖 访问: https://vercel.com/dashboard" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "🏗️  开始部署到生产环境..." -ForegroundColor Cyan
Write-Host ""

# 部署到生产环境
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ 部署成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 下一步操作：" -ForegroundColor Cyan
    Write-Host "1. 访问 Vercel Dashboard 查看部署详情"
    Write-Host "2. 在 Upstash Console 配置 QStash Schedule"
    Write-Host "3. 测试网站功能"
    Write-Host "4. 查看文档: VERCEL_DEPLOYMENT_NEXT_STEPS.md"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ 部署失败" -ForegroundColor Red
    Write-Host "📖 请查看错误信息并修复问题" -ForegroundColor Yellow
    Write-Host ""
}





























