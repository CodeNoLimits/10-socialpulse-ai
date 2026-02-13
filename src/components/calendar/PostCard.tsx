"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/store";
import { formatTime, truncateText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const platformColors: Record<string, string> = {
  twitter: "bg-blue-500",
  instagram: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
  facebook: "bg-blue-600",
  linkedin: "bg-blue-700",
  tiktok: "bg-black",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-500",
  scheduled: "bg-yellow-500",
  published: "bg-green-500",
  failed: "bg-red-500",
};

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: post.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={cn(
          "flex items-center gap-1.5 p-1.5 rounded bg-slate-700/50 cursor-grab",
          isDragging && "opacity-50"
        )}
      >
        <div
          className={cn(
            "h-4 w-4 rounded-full flex-shrink-0",
            platformColors[post.platform]
          )}
        />
        <span className="text-xs text-gray-300 truncate flex-1">
          {truncateText(post.content, 20)}
        </span>
        <span className="text-xs text-gray-500">
          {formatTime(post.scheduledFor)}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-slate-800 rounded-lg p-4 border border-slate-700 cursor-grab hover:border-slate-600 transition-all",
        isDragging && "opacity-50 ring-2 ring-purple-500"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
              platformColors[post.platform]
            )}
          >
            {post.platform.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{post.accountName}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {formatTime(post.scheduledFor)}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-slate-800 border-slate-700"
          >
            <DropdownMenuItem className="text-gray-300">Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300">Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300">Reschedule</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-gray-300 mb-3 line-clamp-3">{post.content}</p>

      {post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {post.hashtags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs text-purple-400">
              #{tag}
            </span>
          ))}
          {post.hashtags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{post.hashtags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs border-none",
              statusColors[post.status],
              "text-white"
            )}
          >
            {post.status}
          </Badge>
          {post.aiGenerated && (
            <Badge
              variant="outline"
              className="text-xs border-purple-500 text-purple-400"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI
            </Badge>
          )}
        </div>
        {post.engagementScore && (
          <span className="text-xs text-gray-400">
            Score: {post.engagementScore}%
          </span>
        )}
      </div>
    </div>
  );
}
