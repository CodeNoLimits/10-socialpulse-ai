"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// Tabs available for future use
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Loader2,
  TrendingUp,
  Bookmark,
  Plus,
  RefreshCw,
  Flame,
  Zap,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  trendingScore: number;
  suggestedHashtags: string[];
}

// Mock trending topics
const trendingTopics = [
  { topic: "#AIRevolution", growth: "+245%", platform: "twitter" },
  { topic: "#SustainableLiving", growth: "+189%", platform: "instagram" },
  { topic: "#RemoteWork", growth: "+156%", platform: "linkedin" },
  { topic: "#TechTips", growth: "+134%", platform: "tiktok" },
  { topic: "#Entrepreneurship", growth: "+112%", platform: "facebook" },
];

const mockIdeas: ContentIdea[] = [
  {
    id: "1",
    title: "5 AI Tools That Will Transform Your Workflow",
    description: "Share a listicle of AI tools that your audience can start using today to boost productivity.",
    category: "educational",
    platform: "linkedin",
    trendingScore: 92,
    suggestedHashtags: ["AI", "Productivity", "TechTools", "FutureOfWork"],
  },
  {
    id: "2",
    title: "Behind the Scenes: A Day in the Life",
    description: "Take your followers through a typical day, showing the human side of your brand.",
    category: "behind-the-scenes",
    platform: "instagram",
    trendingScore: 87,
    suggestedHashtags: ["BTS", "DayInMyLife", "Authentic", "RealTalk"],
  },
  {
    id: "3",
    title: "Quick Tip Thread on [Your Expertise]",
    description: "Create a thread with bite-sized tips that provide immediate value to your audience.",
    category: "educational",
    platform: "twitter",
    trendingScore: 85,
    suggestedHashtags: ["Tips", "Thread", "Learn", "Growth"],
  },
  {
    id: "4",
    title: "Myth vs Reality in [Your Industry]",
    description: "Debunk common misconceptions and establish thought leadership.",
    category: "thought-leadership",
    platform: "linkedin",
    trendingScore: 81,
    suggestedHashtags: ["MythBusting", "Industry", "Facts", "Expert"],
  },
  {
    id: "5",
    title: "User Success Story Highlight",
    description: "Feature a customer or user success story with their permission.",
    category: "social-proof",
    platform: "facebook",
    trendingScore: 78,
    suggestedHashtags: ["SuccessStory", "CustomerLove", "Results", "Testimonial"],
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  educational: <Zap className="h-4 w-4" />,
  "behind-the-scenes": <Target className="h-4 w-4" />,
  "thought-leadership": <Flame className="h-4 w-4" />,
  "social-proof": <TrendingUp className="h-4 w-4" />,
};

export function ContentIdeas() {
  const [ideas, setIdeas] = useState<ContentIdea[]>(mockIdeas);
  const [loading, setLoading] = useState(false);
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("all");
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);

  const handleGenerateIdeas = async () => {
    if (!niche) return;
    setLoading(true);

    try {
      const response = await fetch("/api/ai/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform }),
      });

      const data = await response.json();
      if (data.ideas) {
        setIdeas(data.ideas);
      }
    } catch (error) {
      console.error("Failed to generate ideas:", error);
    }

    setLoading(false);
  };

  const handleSaveIdea = (id: string) => {
    if (savedIdeas.includes(id)) {
      setSavedIdeas(savedIdeas.filter((i) => i !== id));
    } else {
      setSavedIdeas([...savedIdeas, id]);
    }
  };

  const filteredIdeas =
    platform === "all"
      ? ideas
      : ideas.filter((idea) => idea.platform === platform);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">AI Content Ideas</h2>
        <p className="text-gray-400">
          Get AI-powered content suggestions based on trends and your niche
        </p>
      </div>

      {/* Trending Topics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Trending Now
          </CardTitle>
          <CardDescription className="text-gray-400">
            Hot topics across social platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-purple-500 cursor-pointer transition-colors"
              >
                <Badge variant={topic.platform as "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok"} className="text-xs">
                  {topic.platform}
                </Badge>
                <span className="text-white font-medium">{topic.topic}</span>
                <span className="text-green-400 text-sm">{topic.growth}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Ideas */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Generate Custom Ideas</CardTitle>
          <CardDescription className="text-gray-400">
            Tell us about your niche and we&apos;ll generate personalized content ideas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Enter your niche (e.g., fitness, tech, cooking)"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-white">
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
            <Button
              onClick={handleGenerateIdeas}
              disabled={loading || !niche}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Ideas
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ideas List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Content Ideas ({filteredIdeas.length})
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-gray-400"
            onClick={() => setIdeas(mockIdeas)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIdeas.map((idea) => (
            <Card
              key={idea.id}
              className={cn(
                "bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all",
                savedIdeas.includes(idea.id) && "ring-2 ring-purple-500"
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-purple-600/20 text-purple-400">
                      {categoryIcons[idea.category] || <Sparkles className="h-4 w-4" />}
                    </div>
                    <Badge variant={idea.platform as "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok"}>{idea.platform}</Badge>
                    <Badge variant="outline" className="border-slate-600 text-gray-400">
                      {idea.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">{idea.trendingScore}%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="text-white font-semibold mb-2">{idea.title}</h4>
                <p className="text-gray-400 text-sm mb-3">{idea.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {idea.suggestedHashtags.map((tag) => (
                    <span key={tag} className="text-xs text-purple-400">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveIdea(idea.id)}
                    className={cn(
                      "border-slate-700",
                      savedIdeas.includes(idea.id)
                        ? "text-purple-400 border-purple-500"
                        : "text-gray-400"
                    )}
                  >
                    <Bookmark
                      className={cn(
                        "h-4 w-4",
                        savedIdeas.includes(idea.id) && "fill-current"
                      )}
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
