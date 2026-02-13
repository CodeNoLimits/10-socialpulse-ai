-- Migration: Add subscription and payment tables
-- Project: SocialPulse AI (and all 10 Cash Machines)
-- Date: 2026-01-19

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add payment-related columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS lemonsqueezy_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS current_plan_id TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS billing_email TEXT;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  lemonsqueezy_subscription_id TEXT UNIQUE,
  lemonsqueezy_order_id TEXT,
  plan_id TEXT NOT NULL DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'on_trial', 'past_due', 'canceled', 'free')) DEFAULT 'free',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create usage tracking table (for freemium features)
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  period_start TIMESTAMPTZ DEFAULT NOW(),
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_key, period_start)
);

-- Create payment/webhook events table (for logging)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service can insert subscriptions"
ON public.subscriptions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can update subscriptions"
ON public.subscriptions FOR UPDATE
USING (true);

-- Usage policies
CREATE POLICY "Users can view own usage"
ON public.usage FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
ON public.usage FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
ON public.usage FOR UPDATE
USING (auth.uid() = user_id);

-- Webhook events - service only (for security)
CREATE POLICY "Service can manage webhook events"
ON public.webhook_events FOR ALL
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_user_feature ON public.usage(user_id, feature_key);
CREATE INDEX IF NOT EXISTS idx_usage_period ON public.usage(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed);

-- Function to reset monthly usage (run via cron)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  -- Archive old usage records and create new period
  INSERT INTO public.usage (user_id, feature_key, count, period_start, period_end)
  SELECT
    user_id,
    feature_key,
    0,
    date_trunc('month', NOW()),
    date_trunc('month', NOW()) + interval '1 month'
  FROM public.usage
  WHERE period_end < NOW()
  GROUP BY user_id, feature_key;

  -- Delete old records
  DELETE FROM public.usage WHERE period_end < NOW() - interval '3 months';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.subscriptions IS 'User subscriptions managed by LemonSqueezy';
COMMENT ON TABLE public.usage IS 'Feature usage tracking for freemium limits';
COMMENT ON TABLE public.webhook_events IS 'Payment webhook event log for debugging';
