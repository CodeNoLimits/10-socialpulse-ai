import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { platform, topic, tone } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const platformLimits: Record<string, number> = {
      twitter: 280,
      instagram: 2200,
      facebook: 63206,
      linkedin: 3000,
      tiktok: 2200,
    };

    const prompt = `Generate a ${platform} post about "${topic}" with a ${tone} tone.

Requirements:
- Character limit: ${platformLimits[platform] || 500} characters
- Include relevant emojis where appropriate
- Make it engaging and shareable
- Include a call-to-action

Platform-specific guidelines:
- Twitter/X: Concise, punchy, conversation-starting
- Instagram: Visual-focused, storytelling, community-building
- Facebook: Informative, shareable, discussion-prompting
- LinkedIn: Professional, thought-leadership, industry insights
- TikTok: Trendy, fun, hook-focused

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "content": "The post content here",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "bestTime": "Best time to post (e.g., '9:00 AM - 11:00 AM')",
  "engagementPrediction": "high"
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        content: parsed.content,
        hashtags: parsed.hashtags || [],
        bestTime: parsed.bestTime,
        engagementPrediction: parsed.engagementPrediction,
        platform,
      });
    }

    return NextResponse.json(
      { error: "Could not parse AI response" },
      { status: 500 }
    );
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
