import type { Metadata } from "next";
import { Navbar } from "@/components/public/shared/navbar";
import { Footer } from "@/components/public/shared/footer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Mango Review',
    template: '%s | Mango Review',
  },
  description:
    'Mango Review helps businesses collect authentic customer feedback, manage reviews, and grow their online reputation.',
  keywords: ['reviews', 'feedback', 'customer reviews', 'reputation management', 'mango review'],
  openGraph: {
    title: 'Mango Review',
    description:
      'Mango Review helps businesses collect authentic customer feedback, manage reviews, and grow their online reputation.',
    type: 'website',
    images: [{ url: '/logo.png', alt: 'Mango Review Logo' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
