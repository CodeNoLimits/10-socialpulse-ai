"use client";

import { useAppStore } from "@/lib/store";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Calendar,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Users,
  Hash,
  Lightbulb,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  CreditCard,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Posts", href: "/dashboard/posts", icon: FileText },
  { name: "AI Ideas", href: "/dashboard/ideas", icon: Lightbulb },
  { name: "Hashtags", href: "/dashboard/hashtags", icon: Hash },
  { name: "Best Times", href: "/dashboard/optimal-times", icon: Clock },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const platformColors: Record<string, string> = {
  twitter: "bg-blue-500",
  instagram: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
  facebook: "bg-blue-600",
  linkedin: "bg-blue-700",
  tiktok: "bg-black",
};

export function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const { sidebarOpen, setSidebarOpen, accounts } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg text-white">SocialPulse</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive
                        ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30"
                        : "text-gray-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Connected Accounts */}
          {sidebarOpen && (
            <div className="mt-8">
              <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="text-sm font-medium text-gray-400">Accounts</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 cursor-pointer"
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-white text-xs",
                          platformColors[account.platform]
                        )}
                      >
                        {account.accountName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {account.accountName}
                        </p>
                        <p className="text-xs text-gray-500">@{account.accountHandle}</p>
                      </div>
                      {account.isActive && (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No accounts connected</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-dashed border-gray-600 text-gray-400"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* User Profile */}
        <div className="border-t border-slate-800 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-left",
                  sidebarOpen ? "px-2" : "px-0 justify-center"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.user_metadata?.full_name || user?.email || "Demo User"}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Free Plan
                    </Badge>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
              <DropdownMenuLabel className="text-gray-400">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-slate-700">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-slate-700">
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Plan
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                className="text-red-400 focus:text-red-300 focus:bg-slate-700"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
