"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Sparkles,
  Calendar,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  hour: number;
  engagement: number;
  label: string;
}

interface DaySchedule {
  day: string;
  shortDay: string;
  slots: TimeSlot[];
  bestTime: string;
  reason: string;
}

// Mock optimal times data
const weekSchedule: DaySchedule[] = [
  {
    day: "Monday",
    shortDay: "Mon",
    bestTime: "10:00 AM",
    reason: "High engagement as people start their week",
    slots: [
      { hour: 6, engagement: 20, label: "6AM" },
      { hour: 9, engagement: 65, label: "9AM" },
      { hour: 10, engagement: 85, label: "10AM" },
      { hour: 12, engagement: 70, label: "12PM" },
      { hour: 15, engagement: 55, label: "3PM" },
      { hour: 18, engagement: 60, label: "6PM" },
      { hour: 21, engagement: 45, label: "9PM" },
    ],
  },
  {
    day: "Tuesday",
    shortDay: "Tue",
    bestTime: "9:00 AM",
    reason: "Peak morning productivity hours",
    slots: [
      { hour: 6, engagement: 25, label: "6AM" },
      { hour: 9, engagement: 90, label: "9AM" },
      { hour: 10, engagement: 80, label: "10AM" },
      { hour: 12, engagement: 65, label: "12PM" },
      { hour: 15, engagement: 50, label: "3PM" },
      { hour: 18, engagement: 55, label: "6PM" },
      { hour: 21, engagement: 40, label: "9PM" },
    ],
  },
  {
    day: "Wednesday",
    shortDay: "Wed",
    bestTime: "11:00 AM",
    reason: "Mid-week engagement peak",
    slots: [
      { hour: 6, engagement: 30, label: "6AM" },
      { hour: 9, engagement: 75, label: "9AM" },
      { hour: 11, engagement: 88, label: "11AM" },
      { hour: 12, engagement: 70, label: "12PM" },
      { hour: 15, engagement: 55, label: "3PM" },
      { hour: 18, engagement: 65, label: "6PM" },
      { hour: 21, engagement: 50, label: "9PM" },
    ],
  },
  {
    day: "Thursday",
    shortDay: "Thu",
    bestTime: "12:00 PM",
    reason: "Lunch break browsing surge",
    slots: [
      { hour: 6, engagement: 25, label: "6AM" },
      { hour: 9, engagement: 70, label: "9AM" },
      { hour: 11, engagement: 80, label: "11AM" },
      { hour: 12, engagement: 92, label: "12PM" },
      { hour: 15, engagement: 60, label: "3PM" },
      { hour: 18, engagement: 70, label: "6PM" },
      { hour: 21, engagement: 55, label: "9PM" },
    ],
  },
  {
    day: "Friday",
    shortDay: "Fri",
    bestTime: "3:00 PM",
    reason: "Pre-weekend wind-down browsing",
    slots: [
      { hour: 6, engagement: 20, label: "6AM" },
      { hour: 9, engagement: 60, label: "9AM" },
      { hour: 11, engagement: 65, label: "11AM" },
      { hour: 12, engagement: 70, label: "12PM" },
      { hour: 15, engagement: 85, label: "3PM" },
      { hour: 18, engagement: 75, label: "6PM" },
      { hour: 21, engagement: 60, label: "9PM" },
    ],
  },
  {
    day: "Saturday",
    shortDay: "Sat",
    bestTime: "11:00 AM",
    reason: "Weekend morning leisure time",
    slots: [
      { hour: 8, engagement: 45, label: "8AM" },
      { hour: 10, engagement: 70, label: "10AM" },
      { hour: 11, engagement: 80, label: "11AM" },
      { hour: 14, engagement: 65, label: "2PM" },
      { hour: 17, engagement: 55, label: "5PM" },
      { hour: 20, engagement: 70, label: "8PM" },
      { hour: 22, engagement: 50, label: "10PM" },
    ],
  },
  {
    day: "Sunday",
    shortDay: "Sun",
    bestTime: "7:00 PM",
    reason: "Evening preparation for the week",
    slots: [
      { hour: 9, engagement: 40, label: "9AM" },
      { hour: 11, engagement: 55, label: "11AM" },
      { hour: 14, engagement: 50, label: "2PM" },
      { hour: 17, engagement: 65, label: "5PM" },
      { hour: 19, engagement: 85, label: "7PM" },
      { hour: 21, engagement: 70, label: "9PM" },
      { hour: 22, engagement: 45, label: "10PM" },
    ],
  },
];

const platformRecommendations: Record<string, { bestDays: string[]; bestTimes: string[]; tips: string }> = {
  instagram: {
    bestDays: ["Tuesday", "Wednesday", "Friday"],
    bestTimes: ["11 AM", "2 PM", "7 PM"],
    tips: "Reels perform best in the evening. Stories get more views during lunch breaks.",
  },
  twitter: {
    bestDays: ["Tuesday", "Wednesday", "Thursday"],
    bestTimes: ["9 AM", "12 PM", "5 PM"],
    tips: "Tweet threads perform best in the morning. Quick takes work well during commute hours.",
  },
  linkedin: {
    bestDays: ["Tuesday", "Wednesday", "Thursday"],
    bestTimes: ["7-8 AM", "12 PM", "5-6 PM"],
    tips: "Professional content performs best early morning. Avoid weekends for B2B content.",
  },
  facebook: {
    bestDays: ["Wednesday", "Thursday", "Friday"],
    bestTimes: ["1-4 PM", "6-9 PM"],
    tips: "Video content gets more engagement in the evening. Events perform well on weekends.",
  },
  tiktok: {
    bestDays: ["Tuesday", "Thursday", "Friday"],
    bestTimes: ["7-9 PM", "12-3 PM"],
    tips: "Trending sounds perform best. Evening posts get more engagement from Gen Z.",
  },
};

export function OptimalTimes() {
  const [platform, setPlatform] = useState("instagram");
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(weekSchedule[0]);

  const platformRecs = platformRecommendations[platform];

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return "bg-green-500";
    if (engagement >= 60) return "bg-yellow-500";
    if (engagement >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Optimal Posting Times</h2>
          <p className="text-gray-400">
            AI-powered recommendations for when to post for maximum engagement
          </p>
        </div>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter/X</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform Recommendations */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            {platform.charAt(0).toUpperCase() + platform.slice(1)} Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Best Days</p>
              <div className="flex flex-wrap gap-2">
                {platformRecs.bestDays.map((day) => (
                  <Badge key={day} className="bg-purple-600/30 text-purple-300">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Best Times</p>
              <div className="flex flex-wrap gap-2">
                {platformRecs.bestTimes.map((time) => (
                  <Badge key={time} className="bg-pink-600/30 text-pink-300">
                    <Clock className="h-3 w-3 mr-1" />
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Pro Tip</p>
              <p className="text-sm text-gray-300">{platformRecs.tips}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Heatmap */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Weekly Engagement Heatmap</CardTitle>
          <CardDescription className="text-gray-400">
            Click on a day to see detailed time recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {weekSchedule.map((day) => (
              <div
                key={day.day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "p-4 rounded-lg cursor-pointer transition-all text-center",
                  selectedDay?.day === day.day
                    ? "bg-purple-600/30 border-2 border-purple-500"
                    : "bg-slate-900/50 border border-slate-700 hover:border-slate-600"
                )}
              >
                <p className="text-white font-medium mb-1">{day.shortDay}</p>
                <p className="text-xs text-gray-400 mb-2">Best: {day.bestTime}</p>
                <div className="flex justify-center gap-1">
                  {day.slots.slice(0, 5).map((slot, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-6 rounded-full",
                        getEngagementColor(slot.engagement)
                      )}
                      style={{ opacity: slot.engagement / 100 }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-400">Low (0-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-gray-400">Medium (40-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-400">Good (60-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-400">Excellent (80%+)</span>
            </div>
          </div>

          {/* Selected Day Details */}
          {selectedDay && (
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{selectedDay.day}</h4>
                  <p className="text-sm text-gray-400">{selectedDay.reason}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Best: {selectedDay.bestTime}
                </Badge>
              </div>

              <div className="space-y-3">
                {selectedDay.slots.map((slot) => (
                  <div key={slot.hour} className="flex items-center gap-4">
                    <span className="w-16 text-sm text-gray-400">{slot.label}</span>
                    <div className="flex-1 h-8 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all flex items-center justify-end pr-3",
                          getEngagementColor(slot.engagement)
                        )}
                        style={{ width: `${slot.engagement}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {slot.engagement}%
                        </span>
                      </div>
                    </div>
                    {slot.engagement >= 80 && (
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        <Zap className="h-3 w-3 mr-1" />
                        Peak
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Schedule */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            Quick Schedule Suggestions
          </CardTitle>
          <CardDescription className="text-gray-400">
            One-click scheduling at optimal times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weekSchedule.slice(0, 3).map((day) => (
              <div
                key={day.day}
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{day.day}</span>
                  <Badge className="bg-green-500/20 text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    High
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-white mb-2">{day.bestTime}</p>
                <p className="text-sm text-gray-400 mb-3">{day.reason}</p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Schedule for {day.shortDay}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
