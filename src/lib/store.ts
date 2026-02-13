import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Post {
  id: string;
  content: string;
  platform: string;
  accountId: string;
  accountName: string;
  scheduledFor: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  hashtags: string[];
  mediaUrls: string[];
  aiGenerated: boolean;
  engagementScore?: number;
}

export interface SocialAccount {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  accountName: string;
  accountHandle: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  trendingScore: number;
  suggestedHashtags: string[];
}

interface AppState {
  // User
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    subscriptionTier: 'free' | 'starter' | 'pro';
  } | null;
  setUser: (user: AppState['user']) => void;

  // Social Accounts
  accounts: SocialAccount[];
  setAccounts: (accounts: SocialAccount[]) => void;
  addAccount: (account: SocialAccount) => void;
  removeAccount: (id: string) => void;

  // Posts
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  removePost: (id: string) => void;
  movePost: (id: string, newDate: Date) => void;

  // Content Ideas
  ideas: ContentIdea[];
  setIdeas: (ideas: ContentIdea[]) => void;
  addIdea: (idea: ContentIdea) => void;
  removeIdea: (id: string) => void;

  // UI State
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedPlatform: string | null;
  setSelectedPlatform: (platform: string | null) => void;
  isCalendarView: boolean;
  setIsCalendarView: (value: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Social Accounts
      accounts: [],
      setAccounts: (accounts) => set({ accounts }),
      addAccount: (account) =>
        set((state) => ({ accounts: [...state.accounts, account] })),
      removeAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),

      // Posts
      posts: [],
      setPosts: (posts) => set({ posts }),
      addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
      updatePost: (id, updates) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      removePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),
      movePost: (id, newDate) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, scheduledFor: newDate } : p
          ),
        })),

      // Content Ideas
      ideas: [],
      setIdeas: (ideas) => set({ ideas }),
      addIdea: (idea) => set((state) => ({ ideas: [...state.ideas, idea] })),
      removeIdea: (id) =>
        set((state) => ({
          ideas: state.ideas.filter((i) => i.id !== id),
        })),

      // UI State
      selectedDate: new Date(),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      selectedPlatform: null,
      setSelectedPlatform: (selectedPlatform) => set({ selectedPlatform }),
      isCalendarView: true,
      setIsCalendarView: (isCalendarView) => set({ isCalendarView }),
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'socialpulse-storage',
      partialize: (state) => ({
        user: state.user,
        accounts: state.accounts,
        posts: state.posts,
        ideas: state.ideas,
      }),
    }
  )
);
