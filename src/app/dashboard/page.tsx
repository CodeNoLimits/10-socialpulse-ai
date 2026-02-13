"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreatePostDialog } from "@/components/posts/CreatePostDialog";
import {
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  Plus,
  Sparkles,
  ArrowRight,
  Eye,
  Heart,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn, getRelativeTime } from "@/lib/utils";

// Mock data for quick stats
const quickStats = [
  {
    title: "Scheduled Posts",
    value: "12",
    change: "+3 this week",
    icon: Calendar,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    title: "Total Reach",
    value: "45.2K",
    change: "+12% vs last week",
    icon: Eye,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    title: "Engagement Rate",
    value: "4.8%",
    change: "+0.5% vs last week",
    icon: Heart,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
  {
    title: "New Followers",
    value: "+234",
    change: "Across all platforms",
    icon: Users,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
];

// Mock upcoming posts
const upcomingPosts = [
  {
    id: "1",
    content: "Excited to share our latest product update! Stay tuned for...",
    platform: "twitter",
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: "scheduled",
  },
  {
    id: "2",
    content: "Behind the scenes look at our team working on something special...",
    platform: "instagram",
    scheduledFor: new Date(Date.now() + 5 * 60 * 60 * 1000),
    status: "scheduled",
  },
  {
    id: "3",
    content: "Industry insights: The future of AI in business...",
    platform: "linkedin",
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: "scheduled",
  },
];

const platformColors: Record<string, string> = {
  twitter: "bg-blue-500",
  instagram: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
  facebook: "bg-blue-600",
  linkedin: "bg-blue-700",
  tiktok: "bg-black",
};

// Content ideas preview
const contentIdeas = [
  { title: "AI Productivity Tips Thread", category: "educational", score: 92 },
  { title: "Behind the Scenes Story", category: "engagement", score: 88 },
  { title: "Weekly Wins Celebration", category: "community", score: 85 },
];

export default function DashboardPage() {
  const { posts, accounts, user } = useAppStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Count stats (can be used for future enhancements)
  void posts.filter((p) => p.status === "scheduled").length;
  void posts.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ""}!
          </h1>
          <p className="text-gray-400 mt-1">
            Here&apos;s what&apos;s happening with your social media
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Posts */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Upcoming Posts</CardTitle>
              <CardDescription className="text-gray-400">
                Your next scheduled content
              </CardDescription>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                View Calendar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingPosts.length > 0 ? (
              <div className="space-y-4">
                {upcomingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0",
                        platformColors[post.platform]
                      )}
                    >
                      {post.platform.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant={post.platform as "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok"} className="text-xs">
                          {post.platform}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getRelativeTime(post.scheduledFor)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-green-500/50 text-green-400 flex-shrink-0"
                    >
                      {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">No upcoming posts scheduled</p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Your First Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Content Ideas */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                AI Ideas
              </CardTitle>
              <CardDescription className="text-gray-400">
                Trending content suggestions
              </CardDescription>
            </div>
            <Link href="/dashboard/ideas">
              <Button variant="ghost" size="sm" className="text-purple-400">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentIdeas.map((idea, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{idea.title}</p>
                      <Badge
                        variant="outline"
                        className="mt-1 border-slate-600 text-gray-400 text-xs"
                      >
                        {idea.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <TrendingUp className="h-3 w-3" />
                      {idea.score}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-slate-900/50 hover:bg-slate-900 text-gray-300 border border-slate-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate More Ideas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Accounts Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Connected Accounts</CardTitle>
            <CardDescription className="text-gray-400">
              {accounts.length} of 5 accounts connected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(accounts.length / 5) * 100} className="h-2 mb-4" />
            {accounts.length > 0 ? (
              <div className="space-y-2">
                {accounts.slice(0, 3).map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center gap-3 p-2 rounded-lg"
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-white text-xs",
                        platformColors[account.platform]
                      )}
                    >
                      {account.accountName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{account.accountName}</p>
                      <p className="text-xs text-gray-500">@{account.accountHandle}</p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-3">
                  Connect your social accounts to start scheduling
                </p>
                <Button variant="outline" className="border-slate-700 text-gray-400">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Common tasks at your fingertips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-slate-700 text-gray-300 hover:bg-slate-800 h-auto py-4 flex-col"
                onClick={() => setCreateDialogOpen(true)}
              >
                <FileText className="h-5 w-5 mb-2" />
                <span className="text-xs">New Post</span>
              </Button>
              <Link href="/dashboard/calendar" className="w-full">
                <Button
                  variant="outline"
                  className="border-slate-700 text-gray-300 hover:bg-slate-800 h-auto py-4 flex-col w-full"
                >
                  <Calendar className="h-5 w-5 mb-2" />
                  <span className="text-xs">Calendar</span>
                </Button>
              </Link>
              <Link href="/dashboard/ideas" className="w-full">
                <Button
                  variant="outline"
                  className="border-slate-700 text-gray-300 hover:bg-slate-800 h-auto py-4 flex-col w-full"
                >
                  <Sparkles className="h-5 w-5 mb-2" />
                  <span className="text-xs">AI Ideas</span>
                </Button>
              </Link>
              <Link href="/dashboard/analytics" className="w-full">
                <Button
                  variant="outline"
                  className="border-slate-700 text-gray-300 hover:bg-slate-800 h-auto py-4 flex-col w-full"
                >
                  <TrendingUp className="h-5 w-5 mb-2" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Optimal Times Preview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Best Times Today
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI-suggested posting times
              </CardDescription>
            </div>
            <Link href="/dashboard/optimal-times">
              <Button variant="ghost" size="sm" className="text-purple-400">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div>
                  <p className="text-sm font-medium text-white">9:00 AM - 11:00 AM</p>
                  <p className="text-xs text-gray-400">High engagement window</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400">Peak</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div>
                  <p className="text-sm font-medium text-white">12:00 PM - 1:00 PM</p>
                  <p className="text-xs text-gray-400">Lunch break traffic</p>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400">Good</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div>
                  <p className="text-sm font-medium text-white">6:00 PM - 8:00 PM</p>
                  <p className="text-xs text-gray-400">Evening scroll time</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400">Great</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
