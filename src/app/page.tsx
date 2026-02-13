"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
    if (!loading && !user) {
      setShowLogin(true);
    }
  }, [user, loading, router]);

  // Fallback: if still loading after 3s, show login anyway
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showLogin) {
        setShowLogin(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [showLogin]);

  if (!showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return <LoginForm />;
}
