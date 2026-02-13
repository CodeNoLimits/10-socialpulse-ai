"use client";

// cn utility available if needed
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Send,
  Repeat2,
} from "lucide-react";

interface PostPreviewProps {
  content: string;
  platform: string;
  accountName?: string;
  hashtags?: string[];
  imageUrl?: string;
}

export function PostPreview({
  content,
  platform,
  accountName = "Your Account",
  hashtags = [],
  imageUrl,
}: PostPreviewProps) {
  const renderTwitterPreview = () => (
    <Card className="max-w-[500px] bg-black border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback className="bg-blue-500 text-white">
              {accountName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-bold text-white">{accountName}</span>
              <span className="text-gray-500">@{accountName.toLowerCase().replace(/\s/g, "")}</span>
            </div>
          </div>
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white text-[15px] leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
        {hashtags.length > 0 && (
          <p className="text-blue-400 mt-2">
            {hashtags.map((tag) => `#${tag}`).join(" ")}
          </p>
        )}
        {imageUrl && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800">
            <img src={imageUrl} alt="Post" className="w-full" />
          </div>
        )}
        <div className="flex items-center justify-between mt-4 text-gray-500">
          <MessageCircle className="h-5 w-5 cursor-pointer hover:text-blue-500" />
          <Repeat2 className="h-5 w-5 cursor-pointer hover:text-green-500" />
          <Heart className="h-5 w-5 cursor-pointer hover:text-pink-500" />
          <Bookmark className="h-5 w-5 cursor-pointer hover:text-blue-500" />
          <Share2 className="h-5 w-5 cursor-pointer hover:text-blue-500" />
        </div>
      </CardContent>
    </Card>
  );

  const renderInstagramPreview = () => (
    <Card className="max-w-[400px] bg-black border-gray-800">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <Avatar className="h-8 w-8 border-2 border-black">
                <AvatarFallback className="bg-gray-800 text-white text-sm">
                  {accountName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="font-semibold text-white text-sm">{accountName.toLowerCase().replace(/\s/g, "")}</span>
          </div>
          <MoreHorizontal className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      {imageUrl && (
        <div className="aspect-square bg-gray-900">
          <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 text-white cursor-pointer hover:text-gray-400" />
            <MessageCircle className="h-6 w-6 text-white cursor-pointer hover:text-gray-400" />
            <Send className="h-6 w-6 text-white cursor-pointer hover:text-gray-400" />
          </div>
          <Bookmark className="h-6 w-6 text-white cursor-pointer hover:text-gray-400" />
        </div>
        <p className="text-white text-sm">
          <span className="font-semibold">{accountName.toLowerCase().replace(/\s/g, "")}</span>{" "}
          {content}
        </p>
        {hashtags.length > 0 && (
          <p className="text-blue-400 text-sm mt-1">
            {hashtags.map((tag) => `#${tag}`).join(" ")}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderFacebookPreview = () => (
    <Card className="max-w-[500px] bg-[#242526] border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">
              {accountName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <span className="font-semibold text-white">{accountName}</span>
            <p className="text-xs text-gray-400">Just now · Public</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white text-[15px] whitespace-pre-wrap">{content}</p>
        {hashtags.length > 0 && (
          <p className="text-blue-400 mt-2">
            {hashtags.map((tag) => `#${tag}`).join(" ")}
          </p>
        )}
        {imageUrl && (
          <div className="mt-3 -mx-4">
            <img src={imageUrl} alt="Post" className="w-full" />
          </div>
        )}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 cursor-pointer hover:bg-gray-700 px-4 py-2 rounded-lg">
            <ThumbsUp className="h-5 w-5" />
            <span>Like</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 cursor-pointer hover:bg-gray-700 px-4 py-2 rounded-lg">
            <MessageCircle className="h-5 w-5" />
            <span>Comment</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 cursor-pointer hover:bg-gray-700 px-4 py-2 rounded-lg">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLinkedInPreview = () => (
    <Card className="max-w-[550px] bg-white border-gray-300">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback className="bg-blue-700 text-white">
              {accountName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <span className="font-semibold text-gray-900">{accountName}</span>
            <p className="text-xs text-gray-500">Founder & CEO</p>
            <p className="text-xs text-gray-400">Just now</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-900 text-sm whitespace-pre-wrap">{content}</p>
        {hashtags.length > 0 && (
          <p className="text-blue-600 text-sm mt-2">
            {hashtags.map((tag) => `#${tag}`).join(" ")}
          </p>
        )}
        {imageUrl && (
          <div className="mt-3 -mx-4">
            <img src={imageUrl} alt="Post" className="w-full" />
          </div>
        )}
        <div className="flex items-center gap-1 mt-4 pt-2 border-t border-gray-200 text-gray-600 text-sm">
          <button className="flex items-center gap-1 px-4 py-2 hover:bg-gray-100 rounded">
            <ThumbsUp className="h-4 w-4" /> Like
          </button>
          <button className="flex items-center gap-1 px-4 py-2 hover:bg-gray-100 rounded">
            <MessageCircle className="h-4 w-4" /> Comment
          </button>
          <button className="flex items-center gap-1 px-4 py-2 hover:bg-gray-100 rounded">
            <Repeat2 className="h-4 w-4" /> Repost
          </button>
          <button className="flex items-center gap-1 px-4 py-2 hover:bg-gray-100 rounded">
            <Send className="h-4 w-4" /> Send
          </button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTikTokPreview = () => (
    <Card className="max-w-[350px] bg-black border-gray-800">
      <div className="aspect-[9/16] bg-gray-900 relative flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <p className="text-white text-sm">{content}</p>
          </div>
        )}
        <div className="absolute right-3 bottom-20 flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center">
            <Heart className="h-8 w-8 text-white" />
            <span className="text-white text-xs">1.2K</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="h-8 w-8 text-white" />
            <span className="text-white text-xs">234</span>
          </div>
          <div className="flex flex-col items-center">
            <Bookmark className="h-8 w-8 text-white" />
            <span className="text-white text-xs">56</span>
          </div>
          <div className="flex flex-col items-center">
            <Share2 className="h-8 w-8 text-white" />
            <span className="text-white text-xs">89</span>
          </div>
        </div>
        <div className="absolute left-3 bottom-4 right-16">
          <p className="font-semibold text-white">@{accountName.toLowerCase().replace(/\s/g, "")}</p>
          <p className="text-white text-sm line-clamp-2">{content}</p>
          {hashtags.length > 0 && (
            <p className="text-white text-sm mt-1">
              {hashtags.map((tag) => `#${tag}`).join(" ")}
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  const previewComponents: Record<string, () => JSX.Element> = {
    twitter: renderTwitterPreview,
    instagram: renderInstagramPreview,
    facebook: renderFacebookPreview,
    linkedin: renderLinkedInPreview,
    tiktok: renderTikTokPreview,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant={platform as "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok"} className="capitalize">
          {platform}
        </Badge>
        <span className="text-sm text-gray-400">Preview</span>
      </div>
      {previewComponents[platform]?.() || renderTwitterPreview()}
    </div>
  );
}
