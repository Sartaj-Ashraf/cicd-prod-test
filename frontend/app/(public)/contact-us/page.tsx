import { Metadata } from 'next'
import { ContactPage } from '@/components/public/pages/contact-page'

export const metadata: Metadata = {
  title: 'Contact Us | Mango Review',
  description:
    'Get in touch with the Mango Review team. We are here to help with your questions, feedback, and support needs.',
  keywords: ['contact', 'support', 'help', 'mango review', 'get in touch'],
  openGraph: {
    title: 'Contact Us | Mango Review',
    description:
      'Get in touch with the Mango Review team. We are here to help with your questions, feedback, and support needs.',
    type: 'website',
    images: [{ url: '/logo.png', alt: 'Mango Review Logo' }],
  },
}

export default function ContactUsPage() {
  return <ContactPage />
}
