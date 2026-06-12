import { SidebarHeader } from "@/components/ui/sidebar"
import logo from "@/public/MangoLogo.png"
import Image from "next/image"

const SidebarHeaderComponent = () => {
  return (
    <SidebarHeader className="border-b border-sidebar-border">
      <div className="px-2 py-2">
        <Image
          src={logo.src}
          alt="Logo"
          className="h-10 w-fit rounded-md object-contain"
          width={1000}
          height={1000}
        />
      </div>
    </SidebarHeader>
  )
}

export default SidebarHeaderComponent