"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostCard } from "@/components/calendar/PostCard";
import { CreatePostDialog } from "@/components/posts/CreatePostDialog";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
// Utility imports available for future use

const statusTabs = [
  { value: "all", label: "All Posts", icon: FileText },
  { value: "draft", label: "Drafts", icon: Clock },
  { value: "scheduled", label: "Scheduled", icon: Calendar },
  { value: "published", label: "Published", icon: CheckCircle },
  { value: "failed", label: "Failed", icon: XCircle },
];

// Platform colors available for future styling
void {
  twitter: "bg-blue-500",
  instagram: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
  facebook: "bg-blue-600",
  linkedin: "bg-blue-700",
  tiktok: "bg-black",
};

// Mock posts for demo
const mockPosts = [
  {
    id: "1",
    content: "Excited to announce our latest feature! AI-powered content suggestions are now live. Try it out and let us know what you think! #AI #ProductUpdate",
    platform: "twitter",
    accountId: "1",
    accountName: "TechStartup",
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: "scheduled" as const,
    hashtags: ["AI", "ProductUpdate", "Tech"],
    mediaUrls: [],
    aiGenerated: true,
    engagementScore: 85,
  },
  {
    id: "2",
    content: "Behind the scenes look at our office! Our team is hard at work building something amazing. Stay tuned for more updates coming soon!",
    platform: "instagram",
    accountId: "2",
    accountName: "OurBrand",
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: "scheduled" as const,
    hashtags: ["BTS", "Startup", "TeamWork"],
    mediaUrls: [],
    aiGenerated: false,
  },
  {
    id: "3",
    content: "Industry insights: How AI is transforming the way businesses operate. Read our full analysis on the blog.",
    platform: "linkedin",
    accountId: "3",
    accountName: "CEO Name",
    scheduledFor: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "published" as const,
    hashtags: ["AI", "Business", "ThoughtLeadership"],
    mediaUrls: [],
    aiGenerated: true,
    engagementScore: 92,
  },
  {
    id: "4",
    content: "Draft post for our upcoming campaign launch. Need to add images and finalize the copy.",
    platform: "facebook",
    accountId: "4",
    accountName: "BrandPage",
    scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000),
    status: "draft" as const,
    hashtags: [],
    mediaUrls: [],
    aiGenerated: false,
  },
];

export default function PostsPage() {
  const { posts } = useAppStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");

  // Use mock posts if store is empty
  const displayPosts = posts.length > 0 ? posts : mockPosts;

  const filteredPosts = displayPosts.filter((post) => {
    const matchesStatus = activeTab === "all" || post.status === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.hashtags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesPlatform =
      platformFilter === "all" || post.platform === platformFilter;

    return matchesStatus && matchesSearch && matchesPlatform;
  });

  const getStatusCount = (status: string) => {
    if (status === "all") return displayPosts.length;
    return displayPosts.filter((p) => p.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Posts</h2>
          <p className="text-gray-400">Manage all your scheduled and published content</p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border border-slate-700">
          {statusTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
              <Badge
                variant="secondary"
                className="ml-2 bg-slate-700 text-gray-300"
              >
                {getStatusCount(tab.value)}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-400 mb-4">
                  {activeTab === "all"
                    ? "Get started by creating your first post"
                    : `No ${activeTab} posts yet`}
                </p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
