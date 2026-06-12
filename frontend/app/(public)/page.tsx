import type { Metadata } from 'next'
import { HeroSection } from "@/components/public/home-page/hero-section";
import { BrandMarquee } from "@/components/public/shared/brand-marquee";
import { ProgressProof } from "@/components/public/home-page/progress-proof";
import {StepsToGrow} from "@/components/public/home-page/steps-to-grow";
import {ReviewHealthSection} from "@/components/public/home-page/review-health-section";
import { SmartApproach } from "@/components/public/home-page/smart-approach";
import { CtaSection } from "@/components/public/shared/cta-section";
import { ThreePackageComparison } from "@/components/public/home-page/three-pack-solution";

export const metadata: Metadata = {
  title: 'Mango Review',
  description:
    'Mango Review helps businesses collect authentic customer feedback, manage reviews, and grow their online reputation with powerful QR-based tools.',
  keywords: ['reviews', 'feedback', 'customer reviews', 'reputation management', 'QR feedback', 'mango review'],
  openGraph: {
    title: 'Mango Review',
    description:
      'Mango Review helps businesses collect authentic customer feedback, manage reviews, and grow their online reputation with powerful QR-based tools.',
    type: 'website',
    images: [{ url: '/logo.png', alt: 'Mango Review Logo' }],
  },
}

export default function Home() {
  return (
    <>
      <HeroSection />
    <div className="container space-y-20 md:space-y-36">
      {/* <BrandMarquee /> */}
      <ProgressProof />
      <StepsToGrow />
      <ThreePackageComparison />
      <ReviewHealthSection />
      <SmartApproach/>
      <CtaSection />
    </div>
    </>
  );
}
