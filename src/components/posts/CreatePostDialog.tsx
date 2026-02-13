"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Loader2,
  Calendar,
  Clock,
  Hash,
  X,
} from "lucide-react";
import { getCharacterLimit, cn } from "@/lib/utils";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const platforms = [
  { id: "twitter", name: "Twitter/X", color: "bg-blue-500" },
  { id: "instagram", name: "Instagram", color: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" },
  { id: "facebook", name: "Facebook", color: "bg-blue-600" },
  { id: "linkedin", name: "LinkedIn", color: "bg-blue-700" },
  { id: "tiktok", name: "TikTok", color: "bg-black" },
];

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const { addPost, accounts } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("professional");

  const characterLimit = getCharacterLimit(platform);
  const characterCount = content.length;
  const characterPercentage = (characterCount / characterLimit) * 100;

  const handleAddHashtag = () => {
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag.replace("#", "")]);
      setNewHashtag("");
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleGenerateAI = async () => {
    if (!aiTopic) return;
    setGeneratingAI(true);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          topic: aiTopic,
          tone: aiTone,
        }),
      });

      const data = await response.json();
      if (data.content) {
        setContent(data.content);
        if (data.hashtags) {
          setHashtags(data.hashtags);
        }
      }
    } catch (error) {
      console.error("AI generation failed:", error);
    }

    setGeneratingAI(false);
  };

  const handleSubmit = async () => {
    if (!content || !scheduledDate || !scheduledTime) return;

    setLoading(true);

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);

    const newPost = {
      id: crypto.randomUUID(),
      content,
      platform,
      accountId: accounts[0]?.id || "demo",
      accountName: accounts[0]?.accountName || "Demo Account",
      scheduledFor,
      status: "scheduled" as const,
      hashtags,
      mediaUrls: [],
      aiGenerated: generatingAI,
    };

    addPost(newPost);
    setLoading(false);
    onOpenChange(false);

    // Reset form
    setContent("");
    setHashtags([]);
    setScheduledDate("");
    setScheduledTime("");
    setAiTopic("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Post</DialogTitle>
          <DialogDescription className="text-gray-400">
            Schedule a new social media post or let AI generate content for you.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            {/* Platform Selection */}
            <div className="space-y-2">
              <Label className="text-gray-200">Platform</Label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <Button
                    key={p.id}
                    variant={platform === p.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlatform(p.id)}
                    className={cn(
                      platform === p.id
                        ? `${p.color} text-white border-none`
                        : "border-slate-700 text-gray-400"
                    )}
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-200">Content</Label>
                <span
                  className={cn(
                    "text-xs",
                    characterPercentage > 90
                      ? "text-red-400"
                      : characterPercentage > 70
                      ? "text-yellow-400"
                      : "text-gray-400"
                  )}
                >
                  {characterCount}/{characterLimit}
                </span>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="min-h-[150px] bg-slate-800 border-slate-700 text-white resize-none"
                maxLength={characterLimit}
              />
              <Progress
                value={characterPercentage}
                className="h-1"
              />
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label className="text-gray-200">Hashtags</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddHashtag()}
                    placeholder="Add hashtag"
                    className="pl-9 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleAddHashtag}
                  className="border-slate-700 text-gray-400"
                >
                  Add
                </Button>
              </div>
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {hashtags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-purple-600/20 text-purple-400"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveHashtag(tag)}
                        className="ml-1 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-4">
            {/* AI Topic */}
            <div className="space-y-2">
              <Label className="text-gray-200">What would you like to post about?</Label>
              <Textarea
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="E.g., Launch of our new product feature, Tips for productivity, Behind the scenes..."
                className="min-h-[100px] bg-slate-800 border-slate-700 text-white resize-none"
              />
            </div>

            {/* Tone Selection */}
            <div className="space-y-2">
              <Label className="text-gray-200">Tone</Label>
              <Select value={aiTone} onValueChange={setAiTone}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Platform for AI */}
            <div className="space-y-2">
              <Label className="text-gray-200">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {platforms.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateAI}
              disabled={generatingAI || !aiTopic}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {generatingAI ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>

            {/* Generated Content Preview */}
            {content && (
              <div className="space-y-2">
                <Label className="text-gray-200">Generated Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] bg-slate-800 border-slate-700 text-white resize-none"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    You can edit the generated content above
                  </span>
                  <span className="text-gray-400">
                    {content.length}/{characterLimit}
                  </span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Scheduling */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="pl-9 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="pl-9 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-700 text-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !content || !scheduledDate || !scheduledTime}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
