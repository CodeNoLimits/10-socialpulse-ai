import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface ContentSuggestion {
  content: string;
  hashtags: string[];
  bestTime: string;
  engagementPrediction: 'low' | 'medium' | 'high';
  platform: string;
}

export interface HashtagSuggestion {
  hashtag: string;
  popularity: 'trending' | 'popular' | 'niche';
  relevanceScore: number;
}

export async function generatePostContent(
  platform: string,
  topic: string,
  tone: string = 'professional',
  includeEmojis: boolean = true
): Promise<ContentSuggestion> {
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
  - ${includeEmojis ? 'Include relevant emojis' : 'No emojis'}
  - Make it engaging and shareable
  - Include a call-to-action

  Platform-specific guidelines:
  - Twitter/X: Concise, punchy, conversation-starting
  - Instagram: Visual-focused, storytelling, community-building
  - Facebook: Informative, shareable, discussion-prompting
  - LinkedIn: Professional, thought-leadership, industry insights
  - TikTok: Trendy, fun, hook-focused

  Respond in JSON format:
  {
    "content": "The post content here",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
    "bestTime": "Best time to post (e.g., '9:00 AM - 11:00 AM')",
    "engagementPrediction": "low|medium|high"
  }`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        platform,
      };
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      content: `Check out our latest update on ${topic}! Stay tuned for more.`,
      hashtags: [topic.toLowerCase().replace(/\s+/g, '')],
      bestTime: '9:00 AM - 11:00 AM',
      engagementPrediction: 'medium',
      platform,
    };
  }
}

export async function generateHashtagSuggestions(
  topic: string,
  platform: string,
  count: number = 10
): Promise<HashtagSuggestion[]> {
  const prompt = `Generate ${count} relevant hashtags for a ${platform} post about "${topic}".

  Consider:
  - Mix of trending, popular, and niche hashtags
  - Platform-specific hashtag culture
  - Relevance to the topic
  - Discoverability potential

  Respond in JSON format:
  {
    "hashtags": [
      {
        "hashtag": "#example",
        "popularity": "trending|popular|niche",
        "relevanceScore": 0.95
      }
    ]
  }`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.hashtags;
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Gemini API error:', error);
    return [
      { hashtag: `#${topic.toLowerCase().replace(/\s+/g, '')}`, popularity: 'niche', relevanceScore: 0.8 },
    ];
  }
}

export async function generateContentIdeas(
  niche: string,
  platform: string,
  count: number = 5
): Promise<Array<{ title: string; description: string; category: string }>> {
  const prompt = `Generate ${count} content ideas for a ${platform} account in the "${niche}" niche.

  For each idea, provide:
  - A catchy title
  - A brief description of the content
  - A category (e.g., educational, entertaining, promotional, behind-the-scenes)

  Focus on:
  - Current trends
  - Engagement potential
  - Sharability
  - Audience value

  Respond in JSON format:
  {
    "ideas": [
      {
        "title": "Content Title",
        "description": "Brief description of the content",
        "category": "educational"
      }
    ]
  }`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.ideas;
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Gemini API error:', error);
    return [
      { title: `${niche} Tips`, description: 'Share valuable tips with your audience', category: 'educational' },
    ];
  }
}

export async function repurposeContent(
  originalContent: string,
  fromPlatform: string,
  toPlatform: string
): Promise<string> {
  const prompt = `Repurpose this ${fromPlatform} post for ${toPlatform}:

  Original content:
  "${originalContent}"

  Adapt the content for ${toPlatform}'s:
  - Character limits and format
  - Audience expectations
  - Best practices
  - Tone and style

  Return only the repurposed content, no explanations.`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return originalContent;
  }
}

export async function suggestOptimalPostingTime(
  platform: string,
  targetAudience: string,
  timezone: string = 'UTC'
): Promise<{ day: string; time: string; reason: string }[]> {
  const prompt = `Suggest the best times to post on ${platform} for a ${targetAudience} audience in ${timezone} timezone.

  Consider:
  - Platform-specific peak engagement times
  - Audience behavior patterns
  - Competition levels at different times

  Respond in JSON format:
  {
    "suggestions": [
      {
        "day": "Monday",
        "time": "9:00 AM",
        "reason": "High engagement during morning commute"
      }
    ]
  }

  Provide top 5 suggestions.`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.suggestions;
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Gemini API error:', error);
    return [
      { day: 'Tuesday', time: '9:00 AM', reason: 'General high engagement time' },
      { day: 'Wednesday', time: '12:00 PM', reason: 'Lunch break browsing' },
      { day: 'Thursday', time: '7:00 PM', reason: 'Evening relaxation time' },
    ];
  }
}

export async function analyzeContentPerformance(
  content: string,
  platform: string
): Promise<{ score: number; suggestions: string[]; strengths: string[]; weaknesses: string[] }> {
  const prompt = `Analyze this ${platform} post and predict its performance:

  "${content}"

  Evaluate:
  - Hook strength
  - Engagement potential
  - Call-to-action effectiveness
  - Hashtag relevance
  - Overall quality

  Respond in JSON format:
  {
    "score": 85,
    "suggestions": ["Add a question to encourage comments"],
    "strengths": ["Strong opening hook"],
    "weaknesses": ["Could use more specific CTA"]
  }

  Score should be 0-100.`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      score: 70,
      suggestions: ['Consider adding more engaging elements'],
      strengths: ['Clear message'],
      weaknesses: ['Could be more interactive'],
    };
  }
}
