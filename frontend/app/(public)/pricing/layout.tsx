import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Explore Mango Review pricing plans. Simple, transparent pricing for businesses looking to collect customer feedback and manage online reviews.',
  keywords: ['pricing', 'plans', 'subscription', 'mango review', 'feedback tools', 'review management'],
  openGraph: {
    title: 'Pricing | Mango Review',
    description:
      'Explore Mango Review pricing plans. Simple, transparent pricing for businesses looking to collect customer feedback and manage online reviews.',
    type: 'website',
    images: [{ url: '/logo.png', alt: 'Mango Review Logo' }],
  },
}

export default function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
