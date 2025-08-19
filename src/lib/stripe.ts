import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Client-side Stripe
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Server-side Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export interface CreateCheckoutSessionParams {
  amount: number; // in USD
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({
  amount,
  email,
  successUrl,
  cancelUrl
}: CreateCheckoutSessionParams): Promise<{ sessionId: string; url: string }> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: amount === 1 ? 'Digital Entity Creation' : 'Digital Entity Creation + Ecosystem Influence',
              description: amount === 1 
                ? 'Create a unique digital being in the ecosystem garden'
                : `Create a unique digital being and influence ecosystem events ($${amount} donation)`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        donationAmount: amount.toString(),
        donorEmail: email,
      },
    });

    return {
      sessionId: session.id,
      url: session.url!
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

export async function verifyPayment(sessionId: string): Promise<{
  success: boolean;
  email: string;
  amount: number;
}> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      return {
        success: true,
        email: session.customer_email || session.metadata?.donorEmail || '',
        amount: session.amount_total! / 100 // Convert from cents
      };
    }
    
    return {
      success: false,
      email: '',
      amount: 0
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      email: '',
      amount: 0
    };
  }
}

export function constructWebhookEvent(payload: string, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }
  
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}