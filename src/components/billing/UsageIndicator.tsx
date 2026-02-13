"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { checkUsageLimit } from "@/lib/lemonsqueezy";
import { useAppStore } from "@/lib/store";

interface UsageIndicatorProps {
  featureKey: string;
  label: string;
}

export function UsageIndicator({ featureKey, label }: UsageIndicatorProps) {
  const [usage, setUsage] = useState({ used: 0, limit: 0, allowed: true });
  const [loading, setLoading] = useState(true);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUsage = async () => {
      try {
        const data = await checkUsageLimit(user.id, featureKey);
        setUsage(data);
      } catch (error) {
        console.error("Failed to fetch usage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [user?.id, featureKey]);

  if (loading) {
    return (
      <div className="animate-pulse h-12 bg-slate-700/50 rounded-lg" />
    );
  }

  // Unlimited plan
  if (usage.limit === -1) {
    return (
      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          <span className="text-green-400 font-medium">Unlimited</span>
        </div>
      </div>
    );
  }

  const percentage = Math.min((usage.used / usage.limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={`p-3 rounded-lg ${
      isAtLimit
        ? "bg-red-500/10 border border-red-500/30"
        : isNearLimit
          ? "bg-yellow-500/10 border border-yellow-500/30"
          : "bg-slate-800/50 border border-slate-700"
    }`}>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-300">{label}</span>
        <span className={`font-medium ${
          isAtLimit ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-gray-300"
        }`}>
          {usage.used} / {usage.limit}
        </span>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${
          isAtLimit ? "bg-red-900/50" : isNearLimit ? "bg-yellow-900/50" : "bg-slate-700"
        }`}
      />
      {isAtLimit && (
        <p className="text-xs text-red-400 mt-2">
          Limit reached. Upgrade to continue.
        </p>
      )}
    </div>
  );
}
