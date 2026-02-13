import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, featureKey } = await request.json();

    if (!userId || !featureKey) {
      return NextResponse.json(
        { error: 'userId and featureKey are required' },
        { status: 400 }
      );
    }

    // Get start of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get end of current month
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    // Try to update existing usage record
    const { data: existing, error: selectError } = await supabase
      .from('usage')
      .select('id, count')
      .eq('user_id', userId)
      .eq('feature_key', featureKey)
      .gte('period_start', startOfMonth.toISOString())
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    let newCount: number;

    if (existing) {
      // Update existing record
      newCount = existing.count + 1;
      const { error } = await supabase
        .from('usage')
        .update({ count: newCount })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Create new record
      newCount = 1;
      const { error } = await supabase.from('usage').insert({
        user_id: userId,
        feature_key: featureKey,
        count: newCount,
        period_start: startOfMonth.toISOString(),
        period_end: endOfMonth.toISOString(),
      });

      if (error) throw error;
    }

    return NextResponse.json({ newCount });
  } catch (error) {
    console.error('Usage increment error:', error);
    return NextResponse.json(
      { error: 'Failed to increment usage' },
      { status: 500 }
    );
  }
}
