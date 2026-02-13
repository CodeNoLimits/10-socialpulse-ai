"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  UserPlus,
  Mail,
  MoreHorizontal,
  Crown,
  Shield,
  Edit3,
  Eye,
  Trash2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "editor" | "viewer";
  status: "active" | "pending";
  joinedAt: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "You",
    email: "you@example.com",
    role: "owner",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@example.com",
    role: "editor",
    status: "active",
    joinedAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "viewer",
    status: "pending",
    joinedAt: "2024-03-15",
  },
];

const roleInfo = {
  owner: {
    label: "Owner",
    description: "Full access to all features and billing",
    icon: Crown,
    color: "text-yellow-400 bg-yellow-400/10",
  },
  admin: {
    label: "Admin",
    description: "Can manage team and all content",
    icon: Shield,
    color: "text-purple-400 bg-purple-400/10",
  },
  editor: {
    label: "Editor",
    description: "Can create and edit posts",
    icon: Edit3,
    color: "text-blue-400 bg-blue-400/10",
  },
  viewer: {
    label: "Viewer",
    description: "Can view content and analytics",
    icon: Eye,
    color: "text-gray-400 bg-gray-400/10",
  },
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("editor");

  const handleInvite = () => {
    if (!inviteEmail) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setMembers([...members, newMember]);
    setInviteEmail("");
    setInviteDialogOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleChangeRole = (id: string, newRole: TeamMember["role"]) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Team</h2>
          <p className="text-gray-400">
            Manage your team members and their permissions
          </p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Invite Team Member</DialogTitle>
              <DialogDescription className="text-gray-400">
                Send an invitation to collaborate on your social media accounts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Email Address</label>
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Role</label>
                <Select value={inviteRole} onValueChange={(v: "admin" | "editor" | "viewer") => setInviteRole(v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-400" />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="editor">
                      <div className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-blue-400" />
                        Editor
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        Viewer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {roleInfo[inviteRole].description}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setInviteDialogOpen(false)}
                className="border-slate-700 text-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(roleInfo).map(([key, info]) => {
          const count = members.filter((m) => m.role === key).length;
          return (
            <Card key={key} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", info.color)}>
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{info.label}</p>
                    <p className="text-xs text-gray-400">{count} member{count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Team Members List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            Team Members ({members.length})
          </CardTitle>
          <CardDescription className="text-gray-400">
            People with access to your SocialPulse workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => {
              const role = roleInfo[member.role];
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{member.name}</p>
                        {member.status === "pending" && (
                          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={cn("text-xs", role.color)}>
                      <role.icon className="h-3 w-3 mr-1" />
                      {role.label}
                    </Badge>

                    {member.role !== "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800 border-slate-700"
                        >
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.id, "admin")}
                            className="text-gray-300"
                          >
                            <Shield className="h-4 w-4 mr-2 text-purple-400" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.id, "editor")}
                            className="text-gray-300"
                          >
                            <Edit3 className="h-4 w-4 mr-2 text-blue-400" />
                            Make Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.id, "viewer")}
                            className="text-gray-300"
                          >
                            <Eye className="h-4 w-4 mr-2 text-gray-400" />
                            Make Viewer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Banner */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Need more team members?
              </h3>
              <p className="text-gray-400">
                Upgrade to Pro for unlimited team members and advanced collaboration features.
              </p>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              Upgrade to Pro - $29/mo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
