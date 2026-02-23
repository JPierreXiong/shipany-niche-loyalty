/**
 * 完整链条测试脚本
 * 测试从登录到 Shopify 集成的完整流程
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_BRAND_NAME = 'Test Artisan Studio';

test.describe('完整业务流程测试', () => {
  
  // 测试 1: 用户注册/登录
  test('1. 用户注册和登录', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/sign-up`);
    
    // 输入邮箱
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.click('button[type="submit"]');
    
    // 等待 Magic Link 发送确认
    await expect(page.locator('text=Check your email')).toBeVisible();
  });

  // 测试 2: 访问 Dashboard
  test('2. 访问 Dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/niche-loyalty/dashboard`);
    
    // 检查是否需要登录
    const currentUrl = page.url();
    if (currentUrl.includes('sign-in')) {
      console.log('需要登录 - 这是正常的');
    }
  });

  // 测试 3: 品牌配置
  test('3. 配置品牌信息', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/niche-loyalty/dashboard`);
    
    // 查找品牌配置面板
    const brandNameInput = page.locator('input[placeholder*="Brand"]').first();
    if (await brandNameInput.isVisible()) {
      await brandNameInput.fill(TEST_BRAND_NAME);
    }
  });

  // 测试 4: 导入客户邮箱
  test('4. 导入客户邮箱', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/niche-loyalty/dashboard`);
    
    // 查找导入按钮
    const importButton = page.locator('button:has-text("Import")');
    if (await importButton.isVisible()) {
      await importButton.click();
    }
  });

  // 测试 5: Shopify 连接
  test('5. 连接 Shopify', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/niche-loyalty/dashboard`);
    
    // 查找 Shopify 连接按钮
    const shopifyButton = page.locator('button:has-text("Connect Shopify")');
    if (await shopifyButton.isVisible()) {
      await shopifyButton.click();
    }
  });

  // 测试 6: 创建促销活动
  test('6. 创建促销活动', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/niche-loyalty/dashboard`);
    
    // 查找创建活动按钮
    const createButton = page.locator('button:has-text("Create Campaign")');
    if (await createButton.isVisible()) {
      await createButton.click();
    }
  });

});






















