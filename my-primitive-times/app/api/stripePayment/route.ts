// app/api/create-payment-intent.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia', // Update to the latest version you want to use
});

export async function POST(req: NextRequest) {
  const { paymentMethodId, amount } = await req.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'aud',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Prevent redirect-based payment methods
      },
    //   confirm: true,
    //   // Option 1: Provide a return_url for redirect-based payment methods
    //   return_url: 'https://yourwebsite.com/return', // Replace with your actual return URL

    });

    return NextResponse.json({ success: true, paymentIntent });
  } catch (error) {
    // Type assertion to handle the error as an instance of Error
    if (error instanceof Error) {
      console.error('Error creating payment intent:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}