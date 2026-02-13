"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Bell,
  CreditCard,
  Link,
  Trash2,
  Plus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingCards } from "@/components/billing/PricingCards";
import { UsageIndicator } from "@/components/billing/UsageIndicator";
import { useAppStore } from "@/lib/store";

const connectedAccounts = [
  { platform: "twitter", name: "@yourhandle", connected: true },
  { platform: "instagram", name: "@yourbrand", connected: true },
  { platform: "facebook", name: "Your Page", connected: false },
  { platform: "linkedin", name: "Your Name", connected: true },
  { platform: "tiktok", name: "@yourtiktok", connected: false },
];

const platformColors: Record<string, string> = {
  twitter: "bg-blue-500",
  instagram: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
  facebook: "bg-blue-600",
  linkedin: "bg-blue-700",
  tiktok: "bg-black",
};

export default function SettingsPage() {
  const user = useAppStore((state) => state.user);
  const currentPlan = user?.subscriptionTier || 'free';

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    postReminders: true,
    weeklyReport: true,
    teamUpdates: false,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="accounts"
            className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
          >
            <Link className="h-4 w-4 mr-2" />
            Accounts
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-purple-600 text-white text-2xl">
                    U
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="border-slate-700 text-gray-300">
                    Change Photo
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Full Name</Label>
                  <Input
                    defaultValue="Demo User"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Email</Label>
                  <Input
                    defaultValue="demo@example.com"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Company</Label>
                  <Input
                    placeholder="Your company name"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                      <SelectItem value="est">Eastern Time (GMT-5)</SelectItem>
                      <SelectItem value="pst">Pacific Time (GMT-8)</SelectItem>
                      <SelectItem value="cet">Central European (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Password</CardTitle>
              <CardDescription className="text-gray-400">
                Change your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Current Password</Label>
                <Input
                  type="password"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">New Password</Label>
                  <Input
                    type="password"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Confirm Password</Label>
                  <Input
                    type="password"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-slate-700 text-gray-300">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Connected Accounts</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your social media connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedAccounts.map((account) => (
                  <div
                    key={account.platform}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center text-white font-medium",
                          platformColors[account.platform]
                        )}
                      >
                        {account.platform.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">
                          {account.platform}
                        </p>
                        <p className="text-sm text-gray-400">
                          {account.connected ? account.name : "Not connected"}
                        </p>
                      </div>
                    </div>
                    {account.connected ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500/20 text-green-400">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-slate-700 text-gray-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-400">Browser push notifications</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Post Reminders</p>
                  <p className="text-sm text-gray-400">
                    Remind me before scheduled posts
                  </p>
                </div>
                <Switch
                  checked={notifications.postReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, postReminders: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Weekly Report</p>
                  <p className="text-sm text-gray-400">
                    Receive weekly analytics summary
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReport: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Team Updates</p>
                  <p className="text-sm text-gray-400">
                    Notifications about team activity
                  </p>
                </div>
                <Switch
                  checked={notifications.teamUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, teamUpdates: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Current Plan</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700 mb-6">
                <div>
                  <Badge className={`mb-2 ${
                    currentPlan === 'pro' ? 'bg-pink-500/20 text-pink-400' :
                    currentPlan === 'starter' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
                  </Badge>
                  <p className="text-white font-medium">
                    {currentPlan === 'free' ? 'Free Forever' :
                     currentPlan === 'starter' ? 'Starter Plan' : 'Pro Plan'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {currentPlan === 'free' ? 'Up to 2 social accounts' :
                     currentPlan === 'starter' ? 'Up to 5 social accounts' : 'Unlimited accounts'}
                  </p>
                </div>
                <p className="text-3xl font-bold text-white">
                  ${currentPlan === 'free' ? '0' : currentPlan === 'starter' ? '12' : '29'}/mo
                </p>
              </div>

              {/* Usage Indicators (for free/starter plans) */}
              {currentPlan !== 'pro' && (
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Usage This Month</h4>
                  <UsageIndicator featureKey="accounts" label="Social Accounts" />
                  <UsageIndicator featureKey="postsPerMonth" label="Scheduled Posts" />
                  <UsageIndicator featureKey="aiGenerations" label="AI Generations" />
                </div>
              )}

              <PricingCards currentPlan={currentPlan} />
            </CardContent>
          </Card>

          <Card className="bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
              <CardDescription className="text-gray-400">
                Irreversible actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Delete Account</p>
                  <p className="text-sm text-gray-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
