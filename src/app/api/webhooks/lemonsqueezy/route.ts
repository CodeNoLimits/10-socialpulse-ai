import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

// Verify webhook signature
function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true; // Skip in development

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('X-Signature') || '';

    // Verify webhook signature
    if (WEBHOOK_SECRET && !verifySignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventType = event.meta.event_name;
    const data = event.data;

    console.log(`Processing webhook: ${eventType}`);

    // Log webhook event
    await supabase.from('webhook_events').insert({
      event_id: event.meta.event_id || data.id,
      event_type: eventType,
      payload: event,
      processed: false,
    });

    // Handle different event types
    switch (eventType) {
      case 'subscription_created':
      case 'subscription_updated':
        await handleSubscriptionUpdate(data, event.meta.custom_data);
        break;

      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data);
        break;

      case 'subscription_payment_success':
        await handlePaymentSuccess(data);
        break;

      case 'subscription_payment_failed':
        await handlePaymentFailed(data);
        break;

      case 'order_created':
        console.log('Order created:', data.id);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    // Mark as processed
    await supabase
      .from('webhook_events')
      .update({ processed: true })
      .eq('event_id', event.meta.event_id || data.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

interface WebhookData {
  id: string | number;
  attributes: {
    status: string;
    variant_id: string;
    renews_at?: string;
    created_at?: string;
    cancelled?: boolean;
  };
}

interface CustomData {
  user_id?: string;
}

async function handleSubscriptionUpdate(
  data: WebhookData,
  customData: CustomData
) {
  const userId = customData?.user_id;
  if (!userId) {
    console.error('No user_id in custom data');
    return;
  }

  const attributes = data.attributes;
  const status = attributes.status;
  const variantId = attributes.variant_id;

  // Determine plan from variant
  const planId = determinePlanFromVariant(variantId);

  // Update or create subscription
  const { error } = await supabase.from('subscriptions').upsert({
    user_id: userId,
    lemonsqueezy_subscription_id: data.id.toString(),
    plan_id: planId,
    status: status,
    current_period_start: attributes.renews_at && attributes.created_at ? new Date(attributes.created_at).toISOString() : null,
    current_period_end: attributes.renews_at ? new Date(attributes.renews_at).toISOString() : null,
    cancel_at_period_end: attributes.cancelled || false,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'user_id',
  });

  if (error) {
    console.error('Failed to update subscription:', error);
    return;
  }

  // Update profile subscription tier
  await supabase
    .from('profiles')
    .update({
      subscription_tier: planId,
      subscription_status: status,
    })
    .eq('id', userId);

  console.log(`Updated subscription for user ${userId}: ${planId} (${status})`);
}

async function handleSubscriptionCancelled(data: WebhookData) {
  const subscriptionId = data.id.toString();

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('lemonsqueezy_subscription_id', subscriptionId);

  if (error) {
    console.error('Failed to cancel subscription:', error);
  }
}

async function handlePaymentSuccess(data: WebhookData) {
  console.log('Payment successful for subscription:', data.id);
  // Could send confirmation email here
}

async function handlePaymentFailed(data: WebhookData) {
  console.log('Payment failed for subscription:', data.id);

  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('lemonsqueezy_subscription_id', data.id.toString());
}

function determinePlanFromVariant(variantId: string): string {
  const starterVariant = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STARTER_VARIANT_ID;
  const proVariant = process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID;

  if (variantId === starterVariant) return 'starter';
  if (variantId === proVariant) return 'pro';
  return 'free';
}
