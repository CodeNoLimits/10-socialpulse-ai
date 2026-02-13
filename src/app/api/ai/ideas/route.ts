import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { niche, platform } = await request.json();

    if (!niche) {
      return NextResponse.json(
        { error: "Niche is required" },
        { status: 400 }
      );
    }

    const platformFilter = platform && platform !== "all" ? `specifically for ${platform}` : "for various social platforms";

    const prompt = `Generate 8 unique content ideas for a social media account in the "${niche}" niche ${platformFilter}.

For each idea, provide:
- A catchy, actionable title
- A brief description of the content
- A category
- A platform recommendation
- A trending score (0-100)
- Suggested hashtags

Focus on:
- Current trends
- Engagement potential
- Shareability
- Audience value

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "ideas": [
    {
      "id": "1",
      "title": "Content Title",
      "description": "Brief description of the content and how to create it",
      "category": "educational",
      "platform": "instagram",
      "trendingScore": 85,
      "suggestedHashtags": ["hashtag1", "hashtag2", "hashtag3"]
    }
  ]
}

category must be one of: "educational", "entertaining", "promotional", "behind-the-scenes", "thought-leadership", "social-proof", "trending", "engagement"
platform must be one of: "twitter", "instagram", "facebook", "linkedin", "tiktok"`;

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
    console.error("Ideas generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate ideas" },
      { status: 500 }
    );
  }
}
