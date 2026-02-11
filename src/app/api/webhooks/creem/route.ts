/**
 * Creem Payment Webhook Handler
 * 处理 Creem 支付回调，自动创建/取消订阅
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSubscription, cancelSubscription } from '@/shared/models/subscription';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('[CREEM_WEBHOOK] Received:', JSON.stringify(body, null, 2));

    const { event, data } = body;

    switch (event) {
      case 'payment.succeeded':
      case 'checkout.completed':
        await handlePaymentSuccess(data);
        break;

      case 'payment.refunded':
      case 'subscription.cancelled':
        await handlePaymentRefund(data);
        break;

      default:
        console.log(`[CREEM_WEBHOOK] Unhandled event: ${event}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('[CREEM_WEBHOOK] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * 处理支付成功
 */
async function handlePaymentSuccess(data: any) {
  const {
    customer_email,
    customer_id,
    product_id,
    amount,
    payment_id,
  } = data;

  console.log('[CREEM_WEBHOOK] Payment succeeded:', {
    email: customer_email,
    productId: product_id,
    amount,
    paymentId: payment_id,
  });

  // 根据产品ID确定计划类型
  let planType: 'base' | 'pro';
  
  if (product_id === process.env.CREEM_PRODUCT_STUDIO || product_id === 'prod_5bo10kkVzObfuZIjUglgI0') {
    planType = 'base';
  } else if (product_id === process.env.CREEM_PRODUCT_ATELIER || product_id === 'prod_1lQWMwrdWZFzo6AgpVcCc7') {
    planType = 'pro';
  } else {
    console.error('[CREEM_WEBHOOK] Unknown product ID:', product_id);
    return;
  }

  // 查找用户
  const { db } = await import('@/core/db');
  const { user } = await import('@/config/db/schema');
  const { eq } = await import('drizzle-orm');

  const dbInstance = db();
  const [foundUser] = await dbInstance
    .select()
    .from(user)
    .where(eq(user.email, customer_email))
    .limit(1);

  if (!foundUser) {
    console.error('[CREEM_WEBHOOK] User not found:', customer_email);
    return;
  }

  // 创建订阅（支付日 + 30天）
  await createSubscription(
    foundUser.id,
    planType,
    payment_id,
    parseFloat(amount) || (planType === 'base' ? 19.9 : 59.9)
  );

  console.log(`[CREEM_WEBHOOK] Subscription created for user ${foundUser.id}, plan: ${planType}`);
}

/**
 * 处理退款
 */
async function handlePaymentRefund(data: any) {
  const { payment_id, reason } = data;

  console.log('[CREEM_WEBHOOK] Payment refunded:', {
    paymentId: payment_id,
    reason,
  });

  // 取消订阅，立即降级到免费计划
  const cancelled = await cancelSubscription(payment_id, reason || 'refund');

  if (cancelled) {
    console.log(`[CREEM_WEBHOOK] Subscription cancelled for payment ${payment_id}`);
  } else {
    console.error(`[CREEM_WEBHOOK] Failed to cancel subscription for payment ${payment_id}`);
  }
}

