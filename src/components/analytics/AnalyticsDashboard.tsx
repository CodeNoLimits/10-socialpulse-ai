"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Tabs available for future use
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  MousePointer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for analytics
const engagementData = [
  { name: "Mon", twitter: 420, instagram: 580, facebook: 320, linkedin: 180 },
  { name: "Tue", twitter: 380, instagram: 620, facebook: 350, linkedin: 220 },
  { name: "Wed", twitter: 520, instagram: 700, facebook: 400, linkedin: 250 },
  { name: "Thu", twitter: 450, instagram: 650, facebook: 380, linkedin: 200 },
  { name: "Fri", twitter: 580, instagram: 800, facebook: 420, linkedin: 280 },
  { name: "Sat", twitter: 620, instagram: 900, facebook: 380, linkedin: 150 },
  { name: "Sun", twitter: 540, instagram: 850, facebook: 320, linkedin: 120 },
];

const reachData = [
  { name: "Week 1", reach: 12500, impressions: 45000 },
  { name: "Week 2", reach: 15200, impressions: 52000 },
  { name: "Week 3", reach: 18400, impressions: 61000 },
  { name: "Week 4", reach: 22100, impressions: 75000 },
];

const platformDistribution = [
  { name: "Instagram", value: 45, color: "#E1306C" },
  { name: "Twitter", value: 25, color: "#1DA1F2" },
  { name: "Facebook", value: 18, color: "#1877F2" },
  { name: "LinkedIn", value: 12, color: "#0A66C2" },
];

const topPosts = [
  {
    id: 1,
    platform: "instagram",
    content: "Excited to announce our new product launch! Stay tuned...",
    likes: 1245,
    comments: 89,
    shares: 234,
    reach: 15600,
    engagementRate: 8.2,
  },
  {
    id: 2,
    platform: "twitter",
    content: "Just shipped a major update! Check out what's new...",
    likes: 892,
    comments: 156,
    shares: 345,
    reach: 12300,
    engagementRate: 7.5,
  },
  {
    id: 3,
    platform: "linkedin",
    content: "Thrilled to share our latest industry insights...",
    likes: 567,
    comments: 78,
    shares: 189,
    reach: 8900,
    engagementRate: 6.8,
  },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, change, icon, description }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        <div className="text-purple-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center mt-1">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span
            className={cn(
              "text-sm",
              isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last period</span>
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics</h2>
          <p className="text-gray-400">Track your social media performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reach"
          value="68.2K"
          change={12.5}
          icon={<Eye className="h-5 w-5" />}
          description="Unique accounts reached"
        />
        <StatCard
          title="Engagements"
          value="4,892"
          change={8.3}
          icon={<Heart className="h-5 w-5" />}
          description="Likes, comments & shares"
        />
        <StatCard
          title="Link Clicks"
          value="1,234"
          change={-2.1}
          icon={<MousePointer className="h-5 w-5" />}
          description="Clicks on your links"
        />
        <StatCard
          title="New Followers"
          value="+847"
          change={15.7}
          icon={<Users className="h-5 w-5" />}
          description="Across all platforms"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement by Platform */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Engagement by Platform</CardTitle>
            <CardDescription className="text-gray-400">
              Daily engagement across your connected accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="instagram"
                  stackId="1"
                  stroke="#E1306C"
                  fill="#E1306C"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="twitter"
                  stackId="1"
                  stroke="#1DA1F2"
                  fill="#1DA1F2"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="facebook"
                  stackId="1"
                  stroke="#1877F2"
                  fill="#1877F2"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="linkedin"
                  stackId="1"
                  stroke="#0A66C2"
                  fill="#0A66C2"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reach & Impressions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Reach & Impressions</CardTitle>
            <CardDescription className="text-gray-400">
              Weekly growth in visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reachData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="reach"
                  stroke="#A855F7"
                  strokeWidth={3}
                  dot={{ fill: "#A855F7" }}
                />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="#EC4899"
                  strokeWidth={3}
                  dot={{ fill: "#EC4899" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Distribution & Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Platform Distribution</CardTitle>
            <CardDescription className="text-gray-400">
              Engagement share by platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {platformDistribution.map((platform) => (
                <div key={platform.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm text-gray-400">
                    {platform.name} ({platform.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Posts */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Posts</CardTitle>
            <CardDescription className="text-gray-400">
              Your best content this period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/50"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={post.platform as "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok"}>
                        {post.platform}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {post.engagementRate}% engagement
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 truncate">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-gray-500 text-xs">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" /> {post.shares}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {post.reach.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
