# SocialPulse AI - AI-Powered Social Media Scheduler

App #10 of the Dream Nova Ecosystem "Cash Machine" apps.

## Overview

SocialPulse AI is a comprehensive social media scheduling platform powered by AI. It helps social media managers, influencers, and small businesses create, schedule, and optimize their social media content across multiple platforms.

## Features

### Core Features

- **Visual Content Calendar** - Drag-and-drop calendar interface to plan and schedule posts
- **AI Content Generation** - Generate engaging posts using Google Gemini AI
- **Multi-Platform Support** - Twitter/X, Instagram, Facebook, LinkedIn, and TikTok
- **Platform-Specific Previews** - See how your posts will look on each platform
- **Hashtag Research** - AI-powered hashtag suggestions with popularity and competition metrics
- **Optimal Posting Times** - AI recommendations for when to post for maximum engagement
- **Analytics Dashboard** - Track engagement, reach, and performance metrics
- **Team Collaboration** - Invite team members with role-based permissions
- **Bulk Scheduling** - Schedule multiple posts at once
- **Content Recycling** - Repurpose content across platforms

### AI-Powered Features

- **Smart Content Suggestions** - Generate content ideas based on trends and your niche
- **Tone Customization** - Professional, casual, humorous, inspirational, or educational
- **Engagement Prediction** - AI scores for predicting post performance
- **Content Analysis** - Get feedback on your content before posting

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini API
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd /Users/codenolimits-dreamai-nanach/Desktop/DREAMNOVA-CASH-MACHINES/10-socialpulse-ai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (already configured in `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the database migrations (copy schema from `src/lib/supabase.ts` and run in Supabase SQL Editor)

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── generate/route.ts    # AI content generation
│   │       ├── hashtags/route.ts    # Hashtag suggestions
│   │       └── ideas/route.ts       # Content ideas
│   ├── dashboard/
│   │   ├── analytics/page.tsx       # Analytics dashboard
│   │   ├── calendar/page.tsx        # Content calendar
│   │   ├── hashtags/page.tsx        # Hashtag research
│   │   ├── ideas/page.tsx           # AI content ideas
│   │   ├── optimal-times/page.tsx   # Best posting times
│   │   ├── posts/page.tsx           # Posts management
│   │   ├── settings/page.tsx        # User settings
│   │   ├── team/page.tsx            # Team management
│   │   ├── layout.tsx               # Dashboard layout
│   │   └── page.tsx                 # Dashboard home
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # Login page
├── components/
│   ├── ai/
│   │   ├── ContentIdeas.tsx         # AI ideas component
│   │   ├── HashtagResearch.tsx      # Hashtag tool
│   │   └── OptimalTimes.tsx         # Best times component
│   ├── analytics/
│   │   └── AnalyticsDashboard.tsx   # Charts and metrics
│   ├── auth/
│   │   ├── AuthProvider.tsx         # Auth context
│   │   └── LoginForm.tsx            # Login/signup form
│   ├── calendar/
│   │   ├── CalendarDay.tsx          # Calendar day cell
│   │   ├── ContentCalendar.tsx      # Main calendar
│   │   └── PostCard.tsx             # Draggable post card
│   ├── posts/
│   │   ├── CreatePostDialog.tsx     # Create post modal
│   │   └── PostPreview.tsx          # Platform previews
│   ├── sidebar/
│   │   └── Sidebar.tsx              # Navigation sidebar
│   └── ui/                          # shadcn/ui components
└── lib/
    ├── gemini.ts                    # Gemini AI functions
    ├── store.ts                     # Zustand store
    ├── supabase.ts                  # Supabase client & schema
    └── utils.ts                     # Utility functions
```

## Monetization

### Pricing Tiers

| Feature | Free | Starter ($12/mo) | Pro ($29/mo) |
|---------|------|------------------|--------------|
| Social Accounts | 2 | 5 | Unlimited |
| Scheduled Posts | 10/mo | Unlimited | Unlimited |
| AI Generation | 5/mo | 50/mo | Unlimited |
| Analytics | Basic | Standard | Advanced |
| Team Members | 1 | 3 | Unlimited |
| Support | Community | Email | Priority |

### Revenue Potential

- **Target MRR**: $25K - $100K
- **Target Customers**: Social media managers, influencers, small businesses, agencies

## Database Schema

The application uses Supabase with the following main tables:

- `profiles` - User profiles extending Supabase auth
- `social_accounts` - Connected social media accounts
- `scheduled_posts` - Posts with scheduling info
- `content_ideas` - AI-generated content ideas
- `post_analytics` - Engagement metrics
- `teams` - Team workspaces
- `team_members` - Team membership and roles
- `optimal_times` - Calculated best posting times

## API Routes

### POST /api/ai/generate
Generate AI content for a specific platform and topic.

### POST /api/ai/hashtags
Get hashtag suggestions with popularity metrics.

### POST /api/ai/ideas
Generate content ideas based on niche and platform.

## Key Components

### ContentCalendar
Drag-and-drop calendar using dnd-kit for scheduling posts.

### CreatePostDialog
Modal for creating new posts with AI generation option.

### PostPreview
Platform-specific post previews (Twitter, Instagram, Facebook, LinkedIn, TikTok).

### AnalyticsDashboard
Charts and metrics using Recharts for engagement tracking.

### HashtagResearch
AI-powered hashtag discovery with filtering and copying.

### OptimalTimes
Visual heatmap showing best posting times by day and hour.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `NEXT_PUBLIC_APP_URL` | Application URL |
| `NEXT_PUBLIC_APP_NAME` | Application name |

## Demo Mode

The application includes a "Demo Mode" that allows users to explore the interface without authentication. Click "Continue with Demo Account" on the login page.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - Part of Dream Nova Ecosystem

## Support

For support, email support@dreamnova.com or join our Discord community.

---

Built with love by Dream Nova Team
