#!/bin/bash

# Vercel 部署脚本
# 使用方法: ./deploy-to-vercel.sh

echo "🚀 开始部署到 Vercel..."
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI 未安装"
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI 已就绪"
echo ""

# 检查是否已登录
echo "🔐 检查登录状态..."
vercel whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo "📝 请登录 Vercel..."
    vercel login
fi

echo "✅ 已登录 Vercel"
echo ""

# 显示环境变量提醒
echo "⚠️  重要提醒：请确保已在 Vercel Dashboard 配置以下环境变量："
echo ""
echo "必需的环境变量："
echo "  - DATABASE_URL"
echo "  - BETTER_AUTH_SECRET"
echo "  - BETTER_AUTH_URL"
echo "  - RESEND_API_KEY"
echo "  - QSTASH_CURRENT_SIGNING_KEY"
echo "  - QSTASH_NEXT_SIGNING_KEY"
echo "  - QSTASH_TOKEN"
echo ""
echo "可选的环境变量："
echo "  - SHOPIFY_STORE_DOMAIN"
echo "  - SHOPIFY_ACCESS_TOKEN"
echo "  - CREEM_API_KEY"
echo ""

read -p "是否已配置所有必需的环境变量？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ 请先在 Vercel Dashboard 配置环境变量"
    echo "📖 访问: https://vercel.com/dashboard"
    exit 1
fi

echo ""
echo "🏗️  开始部署到生产环境..."
echo ""

# 部署到生产环境
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "📋 下一步操作："
    echo "1. 访问 Vercel Dashboard 查看部署详情"
    echo "2. 在 Upstash Console 配置 QStash Schedule"
    echo "3. 测试网站功能"
    echo "4. 查看文档: VERCEL_DEPLOYMENT_NEXT_STEPS.md"
    echo ""
else
    echo ""
    echo "❌ 部署失败"
    echo "📖 请查看错误信息并修复问题"
    echo ""
fi

































