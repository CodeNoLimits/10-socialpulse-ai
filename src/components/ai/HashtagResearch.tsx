"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Hash,
  Sparkles,
  Loader2,
  TrendingUp,
  Copy,
  Check,
  Search,
  Flame,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Hashtag {
  tag: string;
  popularity: "trending" | "popular" | "niche";
  posts: string;
  relevanceScore: number;
  competition: "low" | "medium" | "high";
}

// Mock hashtag data
const mockHashtags: Hashtag[] = [
  { tag: "socialmedia", popularity: "popular", posts: "125M", relevanceScore: 95, competition: "high" },
  { tag: "digitalmarketing", popularity: "popular", posts: "89M", relevanceScore: 92, competition: "high" },
  { tag: "contentcreator", popularity: "popular", posts: "45M", relevanceScore: 88, competition: "medium" },
  { tag: "marketingtips", popularity: "trending", posts: "12M", relevanceScore: 85, competition: "medium" },
  { tag: "growthhacking", popularity: "niche", posts: "2.5M", relevanceScore: 82, competition: "low" },
  { tag: "socialmediamarketing", popularity: "popular", posts: "67M", relevanceScore: 90, competition: "high" },
  { tag: "brandstrategy", popularity: "niche", posts: "1.8M", relevanceScore: 78, competition: "low" },
  { tag: "contentmarketing", popularity: "popular", posts: "34M", relevanceScore: 86, competition: "medium" },
  { tag: "instagramgrowth", popularity: "trending", posts: "8.5M", relevanceScore: 84, competition: "medium" },
  { tag: "viralcontent", popularity: "trending", posts: "6.2M", relevanceScore: 80, competition: "medium" },
];

const popularityColors = {
  trending: "bg-orange-500 text-white",
  popular: "bg-blue-500 text-white",
  niche: "bg-purple-500 text-white",
};

const competitionColors = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

export function HashtagResearch() {
  const [hashtags, setHashtags] = useState<Hashtag[]>(mockHashtags);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);

    try {
      const response = await fetch("/api/ai/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchTerm, platform }),
      });

      const data = await response.json();
      if (data.hashtags) {
        setHashtags(data.hashtags);
      }
    } catch (error) {
      console.error("Failed to fetch hashtags:", error);
    }

    setLoading(false);
  };

  const toggleHashtag = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter((t) => t !== tag));
    } else {
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };

  const copyHashtags = () => {
    const text = selectedHashtags.map((t) => `#${t}`).join(" ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectAll = () => {
    setSelectedHashtags(hashtags.map((h) => h.tag));
  };

  const clearSelection = () => {
    setSelectedHashtags([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Hashtag Research</h2>
        <p className="text-gray-400">
          Find the best hashtags to increase your reach and engagement
        </p>
      </div>

      {/* Search Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-400" />
            Research Hashtags
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter a topic or keyword to find relevant hashtags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter topic (e.g., fitness, photography, tech)"
                className="pl-9 bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              disabled={loading || !searchTerm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Research
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Hashtags */}
      {selectedHashtags.length > 0 && (
        <Card className="bg-purple-900/20 border-purple-500/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">
                Selected Hashtags ({selectedHashtags.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-gray-400 hover:text-white"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={copyHashtags}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedHashtags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-purple-600/20 text-purple-300 cursor-pointer hover:bg-purple-600/30"
                  onClick={() => toggleHashtag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-3">
              {selectedHashtags.map((t) => `#${t}`).join(" ")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Hashtag Results */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Hashtag Suggestions</CardTitle>
              <CardDescription className="text-gray-400">
                Click to select hashtags for your post
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              className="border-slate-700 text-gray-400"
            >
              Select All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hashtags.map((hashtag) => (
              <div
                key={hashtag.tag}
                onClick={() => toggleHashtag(hashtag.tag)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all",
                  selectedHashtags.includes(hashtag.tag)
                    ? "bg-purple-900/30 border border-purple-500"
                    : "bg-slate-900/50 border border-slate-700 hover:border-slate-600"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-white font-medium">#{hashtag.tag}</span>
                  </div>
                  <Badge className={popularityColors[hashtag.popularity]}>
                    {hashtag.popularity === "trending" && <Flame className="h-3 w-3 mr-1" />}
                    {hashtag.popularity === "popular" && <Users className="h-3 w-3 mr-1" />}
                    {hashtag.popularity === "niche" && <Zap className="h-3 w-3 mr-1" />}
                    {hashtag.popularity}
                  </Badge>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Posts</p>
                    <p className="text-white font-medium">{hashtag.posts}</p>
                  </div>

                  <div className="text-right w-24">
                    <p className="text-sm text-gray-400 mb-1">Relevance</p>
                    <div className="flex items-center gap-2">
                      <Progress value={hashtag.relevanceScore} className="h-2 flex-1" />
                      <span className="text-sm text-white">{hashtag.relevanceScore}%</span>
                    </div>
                  </div>

                  <div className="text-right w-20">
                    <p className="text-sm text-gray-400">Competition</p>
                    <p className={cn("font-medium capitalize", competitionColors[hashtag.competition])}>
                      {hashtag.competition}
                    </p>
                  </div>

                  {selectedHashtags.includes(hashtag.tag) && (
                    <Check className="h-5 w-5 text-purple-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Hashtag Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-900/50">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Mix it up</span>
              </div>
              <p className="text-sm text-gray-400">
                Use a mix of trending, popular, and niche hashtags for best results.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Hash className="h-4 w-4" />
                <span className="font-medium">Optimal count</span>
              </div>
              <p className="text-sm text-gray-400">
                Instagram: 5-15 hashtags. Twitter: 2-3 hashtags. LinkedIn: 3-5 hashtags.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <Flame className="h-4 w-4" />
                <span className="font-medium">Stay relevant</span>
              </div>
              <p className="text-sm text-gray-400">
                Always use hashtags that are relevant to your content for better engagement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
