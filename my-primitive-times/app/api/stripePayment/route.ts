// app/api/create-payment-intent.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import db from '@/app/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

export async function POST(req: NextRequest) {
  const { paymentMethodId, amount, productId, userId } = await req.json();

  try {
    // 제품 가격 검증
    const productQuery = `
      SELECT price FROM uploads WHERE product_id = $1
    `;
    const productResult = await db.query(productQuery, [productId]);
    
    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const productPrice = parseFloat(productResult.rows[0].price) * 100;

    console.log('Requested Amount:', amount);
    console.log('Database Product Price:', productPrice);
    console.log('User ID:', userId);

    if (amount !== productPrice) {
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
      },
    //   confirm: true,
    //   // Option 1: Provide a return_url for redirect-based payment methods
    //   return_url: 'https://yourwebsite.com/return', // Replace with your actual return URL

    });

    return NextResponse.json({ success: true, paymentIntent });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating payment intent:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}