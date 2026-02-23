/**
 * Clear Digital Heirloom Project Data
 * 清空Digital Heirloom项目的数据
 */

import { db } from '@/core/db';
import * as schema from '@/config/db/schema';
import { eq } from 'drizzle-orm';

async function clearDigitalHeirloomData() {
  const dbInstance = db();
  
  console.log('🗑️  Starting to clear Digital Heirloom project data...');

  try {
    // 1. 清空折扣码
    const deletedDiscountCodes = await dbInstance
      .delete(schema.loyaltyDiscountCode)
      .returning();
    console.log(`✅ Deleted ${deletedDiscountCodes.length} discount codes`);

    // 2. 清空活动
    const deletedCampaigns = await dbInstance
      .delete(schema.loyaltyCampaign)
      .returning();
    console.log(`✅ Deleted ${deletedCampaigns.length} campaigns`);

    // 3. 清空会员
    const deletedMembers = await dbInstance
      .delete(schema.loyaltyMember)
      .returning();
    console.log(`✅ Deleted ${deletedMembers.length} members`);

    // 4. 清空店铺（如果需要）
    const deletedStores = await dbInstance
      .delete(schema.loyaltyStore)
      .returning();
    console.log(`✅ Deleted ${deletedStores.length} stores`);

    // 5. 清空订阅记录（可选）
    const deletedSubscriptions = await dbInstance
      .delete(schema.subscription)
      .returning();
    console.log(`✅ Deleted ${deletedSubscriptions.length} subscriptions`);

    console.log('\n✨ All Digital Heirloom project data has been cleared!');
    console.log('📊 Summary:');
    console.log(`   - Discount Codes: ${deletedDiscountCodes.length}`);
    console.log(`   - Campaigns: ${deletedCampaigns.length}`);
    console.log(`   - Members: ${deletedMembers.length}`);
    console.log(`   - Stores: ${deletedStores.length}`);
    console.log(`   - Subscriptions: ${deletedSubscriptions.length}`);

  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

// 执行清空操作
clearDigitalHeirloomData()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });








