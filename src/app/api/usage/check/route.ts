import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PLANS } from '@/lib/lemonsqueezy';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const feature = searchParams.get('feature');

    if (!userId || !feature) {
      return NextResponse.json(
        { error: 'userId and feature are required' },
        { status: 400 }
      );
    }

    // Get user's subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    const tier = (profile?.subscription_tier || 'free').toUpperCase() as keyof typeof PLANS;
    const plan = PLANS[tier] || PLANS.FREE;

    // Get feature limit
    const limitKey = feature as keyof typeof plan.limits;
    const limit = plan.limits[limitKey] ?? 0;

    // If unlimited (-1), always allow
    if (limit === -1) {
      return NextResponse.json({
        allowed: true,
        used: 0,
        limit: -1,
      });
    }

    // Get current usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: usage } = await supabase
      .from('usage')
      .select('count')
      .eq('user_id', userId)
      .eq('feature_key', feature)
      .gte('period_start', startOfMonth.toISOString())
      .single();

    const used = usage?.count || 0;
    const allowed = used < limit;

    return NextResponse.json({
      allowed,
      used,
      limit,
    });
  } catch (error) {
    console.error('Usage check error:', error);
    return NextResponse.json(
      { error: 'Failed to check usage' },
      { status: 500 }
    );
  }
}
