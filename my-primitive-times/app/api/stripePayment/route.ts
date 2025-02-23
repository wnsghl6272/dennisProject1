// app/api/create-payment-intent.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import db from '@/app/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

interface CartItem {
  product_id: string;
  price: string;
}

interface SimplifiedCartItem {
  productId: string;
  price: string;
}

// 로그 기록 함수
const logPayment = async (userId: string, productId: string, amount: number, status: string, errorMessage?: string) => {
    const query = `
        INSERT INTO payment_logs (user_id, product_id, amount, status, error_message)
        VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(query, [userId, productId, amount, status, errorMessage || null]);
};

export async function POST(req: NextRequest) {
  const { paymentMethodId, amount, userId, fromCart, cartItems, productId, shippingInfo } = await req.json();
  
  try {
    console.log('Payment request received:', { paymentMethodId, amount, userId, fromCart });

    // 장바구니 결제인 경우
    if (fromCart && cartItems) {
      // 필요한 정보만 추출
      const simplifiedCartItems = cartItems.map((item: CartItem) => ({
        productId: item.product_id,
        price: item.price
      }));

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'aud',
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        metadata: {
          userId,
          fromCart: 'true',
          cartItemIds: simplifiedCartItems.map((item: SimplifiedCartItem) => item.productId).join(','),
          shippingInfo: JSON.stringify(shippingInfo)
        },
      });

      // 각 상품별로 결제 로그 기록
      for (const item of simplifiedCartItems) {
        await logPayment(userId, item.productId, parseFloat(item.price) * 100, 'successful');
      }

      // 장바구니 비우기
      await db.query('DELETE FROM cart WHERE user_id = $1', [userId]);

      return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } 
    // 단일 상품 결제인 경우 (기존 로직)
    else if (productId) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'aud',
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        metadata: {
          userId,
          productId,
          shippingInfo: JSON.stringify(shippingInfo)
        },
      });

      // 단일 상품 결제 로그 기록
      await logPayment(userId, productId, amount, 'successful');

      return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    }

    return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Payment error:', error);
    // 결제 실패 시 로그 기록
    if (fromCart && cartItems) {
      for (const item of cartItems) {
        await logPayment(userId, item.product_id, parseFloat(item.price) * 100, 'failed', error.message);
      }
    } else if (productId) {
      await logPayment(userId, productId, amount, 'failed', error.message);
    }
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}