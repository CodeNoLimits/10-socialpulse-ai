"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useAppStore, Post } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  generateCalendarDays,
  getWeekDays,
  getMonthName,
  isSameDay,
  isToday,
  formatTime,
} from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarDay } from "./CalendarDay";

const platformColors: Record<string, string> = {
  twitter: "bg-blue-500",
  instagram: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
  facebook: "bg-blue-600",
  linkedin: "bg-blue-700",
  tiktok: "bg-black",
};

export function ContentCalendar() {
  const { posts, movePost, selectedDate, setSelectedDate } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activePost, setActivePost] = useState<Post | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const calendarDays = useMemo(() => {
    return generateCalendarDays(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
  }, [currentDate]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const post = posts.find((p) => p.id === active.id);
    if (post) {
      setActivePost(post);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePost(null);

    if (over && active.id !== over.id) {
      const postId = active.id as string;
      const targetDateStr = over.id as string;

      // Parse the target date
      const targetDate = new Date(targetDateStr);
      if (!isNaN(targetDate.getTime())) {
        // Keep the same time, just change the date
        const post = posts.find((p) => p.id === postId);
        if (post) {
          const oldDate = new Date(post.scheduledFor);
          targetDate.setHours(oldDate.getHours(), oldDate.getMinutes());
          movePost(postId, targetDate);
        }
      }
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) =>
      isSameDay(new Date(post.scheduledFor), day)
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">
              {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousMonth}
                className="border-slate-700 text-gray-400 hover:text-white hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextMonth}
                className="border-slate-700 text-gray-400 hover:text-white hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="border-slate-700 text-gray-400 hover:text-white hover:bg-slate-800"
            >
              Today
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Platform filter badges */}
            <div className="flex items-center gap-2">
              {["twitter", "instagram", "facebook", "linkedin", "tiktok"].map(
                (platform) => (
                  <Badge
                    key={platform}
                    variant={platform as "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok"}
                    className="cursor-pointer text-xs"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Badge>
                )
              )}
            </div>
            <Button variant="gradient">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {getWeekDays().map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {calendarDays.map((day, index) => {
            const dayPosts = getPostsForDay(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isSelected = isSameDay(day, selectedDate);
            const dayIsToday = isToday(day);

            return (
              <CalendarDay
                key={index}
                day={day}
                posts={dayPosts}
                isCurrentMonth={isCurrentMonth}
                isSelected={isSelected}
                isToday={dayIsToday}
                onClick={() => setSelectedDate(day)}
              />
            );
          })}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activePost ? (
          <div className="bg-slate-800 rounded-lg p-2 shadow-xl border border-purple-500 opacity-90">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-white text-xs",
                  platformColors[activePost.platform]
                )}
              >
                {activePost.platform.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">
                  {activePost.content.slice(0, 30)}...
                </p>
                <p className="text-xs text-gray-400">
                  {formatTime(activePost.scheduledFor)}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
