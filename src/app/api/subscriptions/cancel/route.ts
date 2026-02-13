import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscriptionId is required' },
        { status: 400 }
      );
    }

    // Cancel via LemonSqueezy API if configured
    if (LEMONSQUEEZY_API_KEY) {
      const response = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/vnd.api+json',
            'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('LemonSqueezy cancel error:', error);
        return NextResponse.json(
          { error: 'Failed to cancel subscription' },
          { status: 500 }
        );
      }
    }

    // Update local database
    const { error } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('lemonsqueezy_subscription_id', subscriptionId);

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      canceledAt: new Date().toISOString(),
      message: 'Subscription will be canceled at the end of the billing period',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
