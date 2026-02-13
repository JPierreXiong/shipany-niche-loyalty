# Vercel 环境变量自动更新脚本
# 使用方法：在 PowerShell 中运行 .\scripts\update-vercel-env.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vercel 环境变量更新脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置项目目录
$projectDir = "d:\AIsoftware\niche_loyalty"
Set-Location $projectDir

Write-Host "[1/11] 检查 Vercel CLI..." -ForegroundColor Yellow
$vercelExists = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelExists) {
    Write-Host "❌ Vercel CLI 未安装，请先运行: npm install -g vercel" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Vercel CLI 已安装" -ForegroundColor Green
Write-Host ""

Write-Host "[2/11] 检查登录状态..." -ForegroundColor Yellow
Write-Host "如果未登录，请在浏览器中完成登录" -ForegroundColor Gray
vercel whoami
Write-Host ""

Write-Host "[3/11] 删除旧的 AUTH_URL (production)..." -ForegroundColor Yellow
vercel env rm AUTH_URL production --yes 2>$null
Write-Host "✅ 完成" -ForegroundColor Green

Write-Host "[4/11] 删除旧的 AUTH_URL (preview & development)..." -ForegroundColor Yellow
vercel env rm AUTH_URL preview --yes 2>$null
vercel env rm AUTH_URL development --yes 2>$null
Write-Host "✅ 完成" -ForegroundColor Green

Write-Host "[5/11] 添加新的 AUTH_URL..." -ForegroundColor Yellow
"https://glownicheloyalty.vercel.app" | vercel env add AUTH_URL production
"https://glownicheloyalty.vercel.app" | vercel env add AUTH_URL preview
"https://glownicheloyalty.vercel.app" | vercel env add AUTH_URL development
Write-Host "✅ 完成" -ForegroundColor Green
Write-Host ""

Write-Host "[6/11] 删除旧的 BETTER_AUTH_URL..." -ForegroundColor Yellow
vercel env rm BETTER_AUTH_URL production --yes 2>$null
vercel env rm BETTER_AUTH_URL preview --yes 2>$null
vercel env rm BETTER_AUTH_URL development --yes 2>$null
Write-Host "✅ 完成" -ForegroundColor Green

Write-Host "[7/11] 添加新的 BETTER_AUTH_URL..." -ForegroundColor Yellow
"https://glownicheloyalty.vercel.app" | vercel env add BETTER_AUTH_URL production
"https://glownicheloyalty.vercel.app" | vercel env add BETTER_AUTH_URL preview
"https://glownicheloyalty.vercel.app" | vercel env add BETTER_AUTH_URL development
Write-Host "✅ 完成" -ForegroundColor Green
Write-Host ""

Write-Host "[8/11] 删除旧的 NEXT_PUBLIC_APP_URL..." -ForegroundColor Yellow
vercel env rm NEXT_PUBLIC_APP_URL production --yes 2>$null
vercel env rm NEXT_PUBLIC_APP_URL preview --yes 2>$null
vercel env rm NEXT_PUBLIC_APP_URL development --yes 2>$null
Write-Host "✅ 完成" -ForegroundColor Green

Write-Host "[9/11] 添加新的 NEXT_PUBLIC_APP_URL..." -ForegroundColor Yellow
"https://glownicheloyalty.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production
"https://glownicheloyalty.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL preview
"https://glownicheloyalty.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL development
Write-Host "✅ 完成" -ForegroundColor Green
Write-Host ""

Write-Host "[10/11] 查看所有环境变量..." -ForegroundColor Yellow
vercel env ls
Write-Host ""

Write-Host "[11/11] 准备重新部署..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ 环境变量更新完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步：重新部署到生产环境" -ForegroundColor Yellow
Write-Host ""
$deploy = Read-Host "是否立即部署到生产环境？(y/n)"
if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host ""
    Write-Host "🚀 开始部署..." -ForegroundColor Cyan
    vercel --prod
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "🎉 部署完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "测试以下 URL：" -ForegroundColor Yellow
    Write-Host "  - https://glownicheloyalty.vercel.app/en/sign-up" -ForegroundColor Gray
    Write-Host "  - https://glownicheloyalty.vercel.app/zh/sign-up" -ForegroundColor Gray
    Write-Host "  - https://glownicheloyalty.vercel.app/fr/sign-up" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "⚠️  请手动部署：" -ForegroundColor Yellow
    Write-Host "   方法1: 运行 'vercel --prod'" -ForegroundColor Gray
    Write-Host "   方法2: 访问 Vercel Dashboard 手动触发部署" -ForegroundColor Gray
}
Write-Host ""




