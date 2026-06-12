"use client"

import { useState } from "react"
import { SidebarFooter } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, KeyRound, UserPen, ChevronUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ConfirmModal from "../shared/ConfirmModal"
import ChangePasswordForm from "@/components/auth/ChangePasswordForm"
import EditProfile from "@/components/auth/EditProfile"
import { logout } from "@/services/auth/auth.services"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query-keys"
import { MeResponse } from "@/types/auth/auth.types"
import { useQueryClient } from "@tanstack/react-query"
import { useLocationContext } from "@/context/selectedLocation.context"

export default function SidebarFooterComponent() {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const {setSelectedLocation}=useLocationContext();
  const queryClient=useQueryClient();

  const router = useRouter()
  const data = queryClient.getQueryData(queryKeys.auth.me) as MeResponse
  const user = data?.user
  
  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || ""

  const handleLogout = async () => {
  try {
    setIsLoading(true);
    setLogoutOpen(false);

    await logout();

    queryClient.clear();
    setSelectedLocation(null);

    toast.success("Logged out successfully");

    router.replace("/auth/login");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-sidebar-accent transition-colors group">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm leading-tight flex-1 min-w-0">
                <span className="font-medium truncate">{user?.name || ""}</span>
                <span className="text-muted-foreground text-xs truncate">{user?.email || ""}</span>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w- mb-2 p-0 overflow-hidden">

            {/* user info header */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-muted/50 border-b border-border">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{user?.name || ""}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email || ""}</span>
              </div>
            </div>

            {/* actions */}
            <div className="p-1.5 grid gap-0.5">
              <DropdownMenuItem
                className="gap-2.5 cursor-pointer rounded-lg px-3 py-2.5"
                onClick={() => setShowEditProfile(true)}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted shrink-0">
                  <UserPen className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">Edit Profile</span>
                  <span className="text-xs text-muted-foreground">Update your name & info</span>
                </div>
              </DropdownMenuItem>

              {user?.provider === "local" && (
                <DropdownMenuItem
                  className="gap-2.5 cursor-pointer rounded-lg px-3 py-2.5"
                  onClick={() => setShowChangePassword(true)}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted shrink-0">
                    <KeyRound className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">Change Password</span>
                    <span className="text-xs text-muted-foreground">Update your password</span>
                  </div>
                </DropdownMenuItem>
              )}
            </div>

            <div className="p-1.5 border-t border-border">
              <DropdownMenuItem
                className="gap-2.5 cursor-pointer rounded-lg px-3 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => setLogoutOpen(true)}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/10 shrink-0">
                  <LogOut className="h-3.5 w-3.5 text-destructive" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">Logout</span>
                  <span className="text-xs text-destructive/70">Sign out of your account</span>
                </div>
              </DropdownMenuItem>
            </div>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <ConfirmModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoading}
        texts={{
          heading: "Logout",
          description: "Are you sure you want to logout?",
          cancelText: "Cancel",
          confirmText: "Logout",
          loading: "Logging out...",
        }}
      />

      {showChangePassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowChangePassword(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowChangePassword(false)}
              className="absolute right-4 top-4 text-xl text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
            <ChangePasswordForm />
          </div>
        </div>
      )}

      {showEditProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowEditProfile(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute right-4 top-4 text-xl text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
            <EditProfile onClose={() => setShowEditProfile(false)} />
          </div>
        </div>
      )}
    </>
  )
}