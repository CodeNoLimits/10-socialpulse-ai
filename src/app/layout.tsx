import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocialPulse AI - AI-Powered Social Media Scheduler",
  description:
    "Schedule posts, generate AI content, and grow your social media presence with SocialPulse AI. The ultimate tool for social media managers, influencers, and small businesses.",
  keywords: [
    "social media scheduler",
    "AI content generator",
    "social media management",
    "content calendar",
    "hashtag research",
    "analytics dashboard",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
