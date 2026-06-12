"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export default function SidebarNavItem({ item }: any) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  const { isMobile, setOpenMobile } = useSidebar()

  const Icon = item.icon

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start"
    >
      <Link href={item.href} target={item.label === "Pricing" ? "_blank" : ""} onClick={handleClick}>
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    </Button>
  )
}