
"use client"

import {
  SidebarContent,
  SidebarGroup,
} from "@/components/ui/sidebar"

import { dashboardLinks, appLinks, adminLinks } from "@/utils/dashboard/sidebar-links"
import SidebarNavItem from "./SidebarNavItem"
import { MeResponse } from "@/types/auth/auth.types";

export default function SidebarContentComponent({ user, userLoading }: { user: MeResponse["user"] | null; userLoading: boolean }) {
  return (
    <SidebarContent className="px-2 py-2 select-none">

      {/* Dashboard Section */}
      <SidebarGroup>
        <div className="px-3 py-1 text-xs font-medium text-mango-orange">
          Dashboard
        </div>

        <div className="mt-1 space-y-1">
          {dashboardLinks.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </div>
      </SidebarGroup>

      {/* App Section */}
      <SidebarGroup>
        <div className="px-3 py-3 text-xs font-medium text-mango-orange">
          App
        </div>

        <div className="space-y-1">
          {appLinks.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </div>
      </SidebarGroup>
       { user?.role === "admin" && <SidebarGroup>
        <div className="px-3 py-3 text-xs font-medium text-mango-orange">
          Admin
        </div>

        <div className="space-y-1">
          {adminLinks.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </div>
      </SidebarGroup>}

    </SidebarContent>
  )
}