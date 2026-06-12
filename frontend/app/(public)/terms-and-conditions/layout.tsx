import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Mango Review Terms of Service. Learn about our policies, client responsibilities, review integrity, data usage, and compliance guidelines.',
  keywords: ['terms of service', 'terms and conditions', 'policies', 'mango review', 'compliance'],
  openGraph: {
    title: 'Terms of Service | Mango Review',
    description:
      'Read the Mango Review Terms of Service. Learn about our policies, client responsibilities, review integrity, data usage, and compliance guidelines.',
    type: 'website',
    images: [{ url: '/logo.png', alt: 'Mango Review Logo' }],
  },
}

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
