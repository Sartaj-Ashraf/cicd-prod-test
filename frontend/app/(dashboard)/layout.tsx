"use client"
import type { Metadata } from "next";

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar"
import AppHeader from "@/components/dashboard/header/Header"
import { queryClient } from "@/utils/query-client"
import EditProfile from "@/components/auth/EditProfile"
import { useState } from "react"
import { MeResponse } from "@/types/auth/auth.types";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: MeResponse = queryClient.getQueryData(["auth", "me"])!
  const [showEditProfile, setShowEditProfile] = useState(true)
  return (


    <div className="h-full">
      {user.user?.provider === "google" && !user.user?.phoneNumber && showEditProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"

        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
          >


            <EditProfile onClose={() => setShowEditProfile(false)} />
          </div>
        </div>
      )}
      <SidebarProvider>

        {/* Layout Wrapper */}
        <div className="flex h-screen w-full">

          {/* Sidebar */}
          <AppSidebar />

          {/* Right Side */}
          <div className="flex flex-col flex-1">

            {/* Header */}
            <AppHeader />

            {/* Page Content */}
            <main className="flex-1 overflow-auto md:p-4 bg-background">
              {children}
            </main>


          </div>

        </div>

      </SidebarProvider>


    </div>


  )
}