import {
  LayoutDashboard,
  MapPin,
  Star,
  QrCode,
  CreditCard,
  HelpCircle,
  TrendingUp,
  Building2,
} from "lucide-react"

export const dashboardLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   label: "Users",
  //   href: "/dashboard/users",
  //   icon: Users,
  // },
  
  {
    label: "Google Reviews",
    href: "/dashboard/reviews",
    icon: Star,
  },
  {
    label: "Private Reviews",
    href: "/dashboard/private-reviews",
    icon: Star,
  },


]

export const appLinks = [
  {
    label: "QR Code",
    href: "/dashboard/qr-code",
    icon: QrCode,
  },
  // {
  //   label: "Templates",
  //   href: "/dashboard/templates",
  //   icon: FileText,
  // },
  
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: Building2,
  },
  {
    label: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
]

export const adminLinks = [
 {
    label: "Locations",
    href: "/dashboard/locations",
    icon: MapPin,
  },
 {
    label: "Questions",
    href: "/dashboard/questions",
    icon: HelpCircle,
  },
  {
    label: "Competitor Analysis",
    href: "/dashboard/competitor-analysis",
    icon: TrendingUp,
  },
]
