"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/store";
import { PostCard } from "./PostCard";

interface CalendarDayProps {
  day: Date;
  posts: Post[];
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}

export function CalendarDay({
  day,
  posts,
  isCurrentMonth,
  isSelected,
  isToday,
  onClick,
}: CalendarDayProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.toISOString(),
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        "min-h-[120px] rounded-lg border p-2 transition-all cursor-pointer",
        isCurrentMonth
          ? "bg-slate-800/50 border-slate-700"
          : "bg-slate-900/50 border-slate-800",
        isSelected && "ring-2 ring-purple-500 border-purple-500",
        isOver && "bg-purple-900/30 border-purple-500",
        "hover:border-slate-600"
      )}
    >
      {/* Day Number */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            "text-sm font-medium",
            isCurrentMonth ? "text-white" : "text-gray-600",
            isToday &&
              "bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
          )}
        >
          {day.getDate()}
        </span>
        {posts.length > 0 && (
          <span className="text-xs text-gray-400">{posts.length} posts</span>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-1 overflow-hidden max-h-[80px]">
        {posts.slice(0, 3).map((post) => (
          <PostCard key={post.id} post={post} compact />
        ))}
        {posts.length > 3 && (
          <p className="text-xs text-gray-500 text-center">
            +{posts.length - 3} more
          </p>
        )}
      </div>
    </div>
  );
}
