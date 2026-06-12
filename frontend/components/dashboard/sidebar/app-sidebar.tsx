"use client"
import {
  Sidebar,
} from "@/components/ui/sidebar"
import SidebarHeaderComponent from "./SidebarHeader"
import SidebarFooterComponent from "./SidebarFooter"
import SidebarContentComponent from "./SidebarContent"
import { useAuth } from "@/hooks/auth.hooks"
import { MeResponse } from "@/types/auth/auth.types";

export function AppSidebar() {
  const { data, isLoading } = useAuth();
  const user = data?.user as MeResponse["user"];

  return (
    <Sidebar>

      {/* Header */}
      <SidebarHeaderComponent  />

      {/* Content */}
      <SidebarContentComponent user={user} userLoading={isLoading} />

      {/* Footer */}
      <SidebarFooterComponent />

    </Sidebar>
  )
}