"use client";

import { useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950 p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">SocialPulse AI</h1>
        <p className="text-gray-400 mb-6">
          Something went wrong loading the app.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="block w-full px-6 py-3 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go to Dashboard (Demo)
          </a>
        </div>
      </div>
    </div>
  );
}
