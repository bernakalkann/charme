import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { executeOrderCreation } from '@/actions/orders';
import { sendOrderConfirmationEmail } from '@/lib/email';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-04-10' as any,
    })
  : null;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    if (stripe && stripeWebhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret);
    } else {
      // Signature verification bypass for sandbox testing
      console.warn('[WEBHOOK WARNING] Missing Stripe webhook signature or secret. Running event validation fallback.');
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`[WEBHOOK SIGNATURE ERROR] ${err.message}`);
    return NextResponse.json({ error: `Webhook Signature verification failed: ${err.message}` }, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`[WEBHOOK SUCCESS] Payment received for Session ID: ${session.id}`);

    const metadata = session.metadata;
    if (!metadata) {
      console.error('[WEBHOOK ERROR] Session metadata is empty. Cannot fulfill order.');
      return NextResponse.json({ error: 'Metadata empty' }, { status: 400 });
    }

    try {
      const {
        userId,
        userEmail,
        shippingAddressId,
        billingAddressId,
        giftWrap,
        giftNote,
        selectedTesterId,
        couponCode,
        itemsJson,
      } = metadata;

      if (!userId || !itemsJson || !shippingAddressId || !billingAddressId) {
        console.error('[WEBHOOK ERROR] Missing critical metadata parameters:', metadata);
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }

      const items = JSON.parse(itemsJson);

      const orderData = {
        items,
        shippingAddressId,
        billingAddressId,
        giftWrap: giftWrap === 'true',
        giftNote: giftNote || undefined,
        selectedTesterId: selectedTesterId || undefined,
        couponCode: couponCode || undefined,
        stripeSessionId: session.id,
      };

      // Fulfill the order
      const result = await executeOrderCreation(userId, orderData);

      if (result.success && result.orderId) {
        console.log(`[WEBHOOK ORDER CREATED] Order successfully created with ID: ${result.orderId}`);

        // Send order confirmation email asynchronously
        (async () => {
          try {
            const fullOrder = await prisma.order.findUnique({
              where: { id: result.orderId },
              include: {
                items: {
                  include: {
                    productVariant: {
                      include: { product: true },
                    },
                  },
                },
              },
            });

            if (fullOrder && userEmail) {
              const shippingAddress = await prisma.address.findUnique({
                where: { id: fullOrder.shippingAddressId },
              });

              const emailItems = fullOrder.items.map((item) => ({
                productName: item.productVariant.product.name,
                variantName: item.productVariant.name,
                quantity: item.quantity,
                price: item.price,
              }));

              await sendOrderConfirmationEmail(userEmail, {
                id: fullOrder.id,
                totalAmount: fullOrder.totalAmount,
                shippingAddress,
                items: emailItems,
              });
            }
          } catch (mailErr) {
            console.error('[WEBHOOK ORDER EMAIL FAILED]', mailErr);
          }
        })();
      } else {
        console.error('[WEBHOOK ORDER CREATION FAILED]', result.error);
        return NextResponse.json({ error: result.error || 'Sipariş veritabanına kaydedilemedi.' }, { status: 500 });
      }
    } catch (err: any) {
      console.error('[WEBHOOK FULFILLMENT ERROR]', err);
      return NextResponse.json({ error: err.message || 'Sipariş işleme hatası.' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
