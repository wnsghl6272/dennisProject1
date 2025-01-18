// app/api/create-payment-intent.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import db from '@/app/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

// 로그 기록 함수
const logPayment = async (userId: string, productId: string, amount: number, status: string, errorMessage?: string) => {
    const query = `
        INSERT INTO payment_logs (user_id, product_id, amount, status, error_message)
        VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(query, [userId, productId, amount, status, errorMessage || null]);
};

export async function POST(req: NextRequest) {
  const { paymentMethodId, amount, productId, userId, shippingInfo } = await req.json();
  try {
    console.log('Payment request received:', { paymentMethodId, amount, productId, userId }); //로그

    // 제품 가격 검증
    const productQuery = `
      SELECT price FROM uploads WHERE product_id = $1
    `;
    const productResult = await db.query(productQuery, [productId]);
    
    if (productResult.rows.length === 0) {
      console.error('Product not found for ID:', productId); //로그
      await logPayment(userId, productId, amount, 'failed', 'Product not found');
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const productPrice = parseFloat(productResult.rows[0].price) * 100;

    console.log('Requested Amount:', amount);
    console.log('Database Product Price:', productPrice);
    console.log('User ID:', userId);

    if (amount !== productPrice) {
      console.error('Price mismatch:', { requestedAmount: amount, databasePrice: productPrice }); //로그
      await logPayment(userId, productId, amount, 'failed', 'Price mismatch');
      return NextResponse.json({ error: 'Price mismatch' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'aud',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Prevent redirect-based payment methods
      },
      metadata: {
        userId: userId,
        productId: productId,
        shippingInfo: JSON.stringify(shippingInfo),
      },
    //   confirm: true,
    //   // Option 1: Provide a return_url for redirect-based payment methods
    //   return_url: 'https://yourwebsite.com/return', // Replace with your actual return URL

    });

    console.log('Payment successful:', { paymentIntentId: paymentIntent.id, userId });
    await logPayment(userId, productId, amount, 'successful'); // 성공 로그 기록
    return NextResponse.json({ success: true, paymentIntent });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating payment intent:', error.message);
      await logPayment(userId, productId, amount, 'failed', error.message); // 에러 로그 기록
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unexpected error:', error);
      await logPayment(userId, productId, amount, 'failed', 'An unexpected error occurred'); // 예기치 않은 에러 로그 기록
      return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
  }
}