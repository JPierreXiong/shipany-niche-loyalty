const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/config/locale/messages/zh/landing.json');

console.log('Reading file...');

// Read with proper encoding
const content = fs.readFileSync(filePath, 'utf8');

console.log('Parsing JSON...');

try {
  const data = JSON.parse(content);
  console.log('✅ JSON is valid!');
} catch (e) {
  console.log('❌ JSON Error:', e.message);
  console.log('\nAttempting to fix...');
  
  // The file is corrupted. Let's rebuild it from the English version
  const enPath = path.join(process.cwd(), 'src/config/locale/messages/en/landing.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  // Create Chinese version with proper translations
  const zhData = JSON.parse(JSON.stringify(enData));
  
  // Update key sections with Chinese
  zhData.hero.title = "让您的品牌焕发光彩";
  zhData.hero.description = "跳过复杂的积分系统。创建一个客户真正想加入的精美数字会员俱乐部。专为手工艺者设计。";
  zhData.hero.announcement.badge = "5分钟设置";
  zhData.hero.announcement.title = "🎨 原生钱包集成";
  zhData.hero.tip = "<span style=\"font-size: 0.75rem; font-weight: 300;\">前50名会员永久免费</span>";
  zhData.hero.buttons[0].title = "启动您的俱乐部";
  zhData.hero.buttons[1].title = "试用演示";
  
  zhData.logos.title = "Glow 建立在巨人的肩膀上";
  
  zhData.benefits.title = "为什么选择 Glow";
  zhData.benefits.label = "核心卖点";
  zhData.benefits.description = "您的忠诚度计划不应该看起来像电子表格。Glow 融入您品牌的灵魂。";
  zhData.benefits.items[0].title = "美学优先，软件其次";
  zhData.benefits.items[0].description = "您的忠诚度计划不应该看起来像电子表格。Glow 通过实时 UI 定制融入您品牌的灵魂，匹配您的十六进制颜色和排版。";
  zhData.benefits.items[1].title = "5分钟设置";
  zhData.benefits.items[1].description = "跳过手册。在拉一杯浓缩咖啡的时间内启动您的奖励俱乐部。设置自动奖励触发器并忘记它。";
  zhData.benefits.items[2].title = "原生钱包集成";
  zhData.benefits.items[2].description = "您的客户无需下载应用程序。只需一张精美的卡片原生存在于他们的 Apple 或 Google 钱包中。无摩擦的愉悦。";
  
  zhData["how-it-works"].title = "无缝集成，点亮品牌";
  zhData["how-it-works"].description = "Glow 深度嵌入您的 Shopify 店铺，却是为客户的日常生活而生。";
  zhData["how-it-works"].items[0].title = "自动安装";
  zhData["how-it-works"].items[0].description = "我们的轻量化脚本与您的主题无缝融合，绝不拖慢加载速度。零拖累代码，尊重您网站的性能表现。";
  zhData["how-it-works"].items[1].title = "每单积分";
  zhData["how-it-works"].items[1].description = "无论是手工戒指还是数字画作，积分都会在下单后即时更新。设置自动奖励触发器，一劳永逸。";
  zhData["how-it-works"].items[2].title = "钱包体验";
  zhData["how-it-works"].items[2].description = "无需登录。客户只需点击订单确认函中的链接，即可将会员卡存入手机钱包。这就是极致简单的忠诚度管理。";
  
  zhData.features.title = "功能亮点";
  zhData.features.description = "创建一个感觉像社区邀请的忠诚度计划所需的一切。";
  zhData.features.items[0].title = "动态卡片设计器";
  zhData.features.items[0].description = "实时 UI 定制以匹配您品牌的十六进制颜色和排版。让它成为您的。";
  zhData.features.items[1].title = "自动奖励触发器";
  zhData.features.items[1].description = "设置后忘记它。Glow 自动为购买、生日和推荐奖励客户。";
  zhData.features.items[2].title = "Shopify 深度同步";
  zhData.features.items[2].description = "与您的 Shopify 结账和客户细分零延迟集成。无缝。";
  zhData.features.items[3].title = "轻量级脚本";
  zhData.features.items[3].description = "一个零拖累应用程序，不会减慢您网站的加载速度。对 SEO 和客户体验至关重要。";
  zhData.features.items[4].title = "原生钱包集成";
  zhData.features.items[4].description = "无需下载应用程序。精美的卡片原生存在于 Apple 或 Google 钱包中。";
  zhData.features.items[5].title = "无摩擦的愉悦";
  zhData.features.items[5].description = "积分很无聊。Glow会员资格是您的客户想要加入的社区的邀请。";
  
  zhData.testimonials.title = "用户对 Glow 的评价";
  zhData.testimonials.description = "听听使用 Glow 转变忠诚度计划的手工艺品牌的声音。";
  
  zhData.faq.title = "常见问题";
  zhData.faq.description = "还有其他问题？通过电子邮件联系我们。";
  zhData.faq.tip = "找不到您要找的内容？联系我们的 <a href='mailto:support@glow.app' class='text-primary font-medium hover:underline'>客户支持团队</a>";
  
  zhData["technical-architecture"].title = "为什么 Shopify 卖家选择 Niche Loyalty";
  zhData["technical-architecture"].description = "用我们精简、高利润的架构替代 Smile.io 等昂贵工具";
  zhData["technical-architecture"].items[0].title = "降低 80% 的成本";
  zhData["technical-architecture"].items[0].description = "用我们精简、高利润的架构替代 Smile.io 等昂贵工具。以极低的成本获得企业级忠诚度功能。前 50 名会员永久免费，随着业务增长可负担地扩展。";
  zhData["technical-architecture"].items[1].title = "忠诚度与邮件营销一体化";
  zhData["technical-architecture"].items[1].description = "集成了会员管理与通过 Resend 实现的自动化邮件营销。创建活动、发送个性化折扣码、追踪核销率——全部在一个精美的仪表板中完成。";
  zhData["technical-architecture"].items[2].title = "零阻力 Shopify 同步";
  zhData["technical-architecture"].items[2].description = "支持 CSV 批量导入会员，并通过 Shopify Webhook 自动同步订单数据。自动生成折扣码并追踪核销情况。无需手动操作。";
  zhData["technical-architecture"].items[3].title = "以投资回报率为核心的分析";
  zhData["technical-architecture"].items[3].description = "通过简洁的仪表板追踪折扣核销率和收入增长。精确了解哪些活动带来销售，哪些会员是您最有价值的客户。";
  
  zhData.cta.title = "准备让您的品牌焕发光彩？";
  zhData.cta.description = "加入数百个手工艺品牌，创建感觉像礼物的忠诚度计划。";
  zhData.cta.tip = "<span style=\"font-size: 0.75rem; font-weight: 300;\">前50名会员永久免费</span>";
  zhData.cta.buttons[0].title = "启动您的俱乐部";
  
  // Write fixed version
  fs.writeFileSync(filePath, JSON.stringify(zhData, null, 2), 'utf8');
  console.log('✅ File fixed and saved!');
}








