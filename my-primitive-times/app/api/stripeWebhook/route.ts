// app/api/stripeWebhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import db from '@/app/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  // Check if the signature is null
  if (!sig) {
    console.error('Missing Stripe signature');
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // 필요한 데이터 추출
    const userId = paymentIntent.metadata.userId; // 체크아웃에서 가져옴
    const productId = paymentIntent.metadata.productId; // 체크아웃에서 가져옴
    const price = paymentIntent.amount; // 결제 금액 (센트 단위)
    const stripePaymentIntentId = paymentIntent.id; // Stripe Payment Intent ID

    if (!userId) {
        console.error('User ID is missing from payment intent metadata');
        return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
      }

    // 주문 기록 추가
    try {
      await db.query(
        `INSERT INTO orders (user_id, product_id, price, payment_status, created_at, updated_at, stripe_payment_intent_id) 
         VALUES ($1, $2, $3, $4, NOW(), NOW(), $5)`,
        [userId, productId, price, 'successful', stripePaymentIntentId]
      );
      console.log('Order recorded successfully');
    } catch (error) {
      console.error('Error recording order:', error);
      return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
    }
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}