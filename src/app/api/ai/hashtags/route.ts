import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { topic, platform } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const prompt = `Generate 15 relevant hashtags for a ${platform} post about "${topic}".

Consider:
- Mix of trending, popular, and niche hashtags
- Platform-specific hashtag culture
- Relevance to the topic
- Discoverability potential

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "hashtags": [
    {
      "tag": "example",
      "popularity": "trending",
      "posts": "5.2M",
      "relevanceScore": 95,
      "competition": "medium"
    }
  ]
}

popularity must be one of: "trending", "popular", "niche"
competition must be one of: "low", "medium", "high"
relevanceScore should be 0-100`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    }

    return NextResponse.json(
      { error: "Could not parse AI response" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Hashtag generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate hashtags" },
      { status: 500 }
    );
  }
}
