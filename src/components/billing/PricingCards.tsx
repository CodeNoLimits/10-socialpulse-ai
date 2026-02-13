"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { createCheckout, PLANS } from "@/lib/lemonsqueezy";
import { useAppStore } from "@/lib/store";

interface PricingCardsProps {
  currentPlan?: string;
}

export function PricingCards({ currentPlan = "free" }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const user = useAppStore((state) => state.user);

  const handleUpgrade = async (planId: "starter" | "pro") => {
    if (!user?.id || !user?.email) {
      alert("Please log in to upgrade your plan");
      return;
    }

    setLoading(planId);

    try {
      const { checkoutUrl } = await createCheckout(planId, user.id, user.email);
      // Redirect to checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Starter Plan */}
      <Card className="bg-purple-900/20 border-purple-500/30">
        <CardContent className="p-6">
          <Badge className="bg-purple-500/20 text-purple-400 mb-3">
            Starter
          </Badge>
          <p className="text-2xl font-bold text-white mb-2">
            ${PLANS.STARTER.price}/mo
          </p>
          <ul className="space-y-2 text-sm text-gray-300 mb-4">
            {PLANS.STARTER.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => handleUpgrade("starter")}
            disabled={loading !== null || currentPlan === "starter"}
          >
            {loading === "starter" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : currentPlan === "starter" ? (
              "Current Plan"
            ) : (
              "Upgrade to Starter"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Pro Plan */}
      <Card className="bg-pink-900/20 border-pink-500/30">
        <CardContent className="p-6">
          <Badge className="bg-pink-500/20 text-pink-400 mb-3">Pro</Badge>
          <p className="text-2xl font-bold text-white mb-2">
            ${PLANS.PRO.price}/mo
          </p>
          <ul className="space-y-2 text-sm text-gray-300 mb-4">
            {PLANS.PRO.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => handleUpgrade("pro")}
            disabled={loading !== null || currentPlan === "pro"}
          >
            {loading === "pro" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : currentPlan === "pro" ? (
              "Current Plan"
            ) : (
              "Upgrade to Pro"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
