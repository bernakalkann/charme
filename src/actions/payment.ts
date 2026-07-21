'use server';

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-04-10' as any,
    })
  : null;

export async function createStripeCheckoutSession(data: {
  amount: number;
  items: { name: string; price: number; quantity: number }[];
  successUrl: string;
  cancelUrl: string;
}) {
  console.log(`[PAYMENT] Creating Stripe Checkout Session for amount: ${data.amount} TL`);

  if (!stripe) {
    console.warn(
      '[PAYMENT WARNING] STRIPE_SECRET_KEY is not defined in .env. Running in interactive Sandbox/Mock mode.'
    );

    // In sandbox/mock mode, we simulate the Stripe checkout page redirect by redirecting
    // the user directly to the success page with a generated mock session ID.
    const mockSessionId = `mock_cs_${Math.random().toString(36).substring(2, 11)}`;
    return {
      success: true,
      url: `${data.successUrl}&session_id=${mockSessionId}`,
      gateway: 'Sandbox/Mock Redirect Gateway',
    };
  }

  try {
    // Map cart items to Stripe line items
    const lineItems = data.items.map((item) => ({
      price_data: {
        currency: 'try',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    // Create a hosted Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${data.successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: data.cancelUrl,
    });

    console.log(`[PAYMENT] Stripe Checkout Session created: ${session.id}`);

    return {
      success: true,
      url: session.url,
      gateway: 'Stripe Hosted Gateway',
    };
  } catch (error: any) {
    console.error('[PAYMENT ERROR] Stripe Checkout Session creation error:', error);
    return {
      success: false,
      error: error.message || 'Ödeme oturumu başlatılamadı.',
    };
  }
}
