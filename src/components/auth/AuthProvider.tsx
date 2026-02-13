"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setStoreUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    // If Supabase is not configured, skip auth check and go to demo mode
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          setStoreUser({
            id: session.user.id,
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name || "",
            avatarUrl: session.user.user_metadata?.avatar_url,
            subscriptionTier: "free",
          });
        }
      } catch (err) {
        console.warn("Supabase auth check failed, running in demo mode:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          if (session?.user) {
            setStoreUser({
              id: session.user.id,
              email: session.user.email || "",
              fullName: session.user.user_metadata?.full_name || "",
              avatarUrl: session.user.user_metadata?.avatar_url,
              subscriptionTier: "free",
            });
          } else {
            setStoreUser(null);
          }
          setLoading(false);
        }
      );
      subscription = data.subscription;
    } catch (err) {
      console.warn("Supabase auth listener failed:", err);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [setStoreUser]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error as Error | null };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return { error: new Error("Authentication service unavailable. Try demo mode.") };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      return { error: error as Error | null };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return { error: new Error("Authentication service unavailable. Try demo mode.") };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out failed:", err);
    }
    setStoreUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
