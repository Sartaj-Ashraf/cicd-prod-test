"use client";

const termsSections = [
  {
    id: "01",
    title: "Service Overview",
    content: [
      "Mango Review provides customer feedback management and engagement tools.",
      "The platform allows customers to scan a QR code or access a secure link to share authentic feedback and optionally visit supported third-party platforms.",
      "The system may collect customer feedback submitted through the platform dashboard for internal engagement and service improvement purposes.",
      "Any review submitted on third-party platforms is posted directly by the customer. Mango Review does not control or modify third-party content.",
    ],
  },
  {
    id: "02",
    title: "Client Responsibility",
    content: [
      "Our platform provides QR-based customer feedback tools ",
      "All reviews posted on third-party platforms remain under the control of the customer and the respective platform provider.",
    ],
  },
  {
    id: "03",
    title: "Review Integrity Policy",
    content: [
      "Mango Review does not support fake reviews, misleading content, review gating, incentivized reviews, or any activity that violates third-party platform policies.",
      "Clients must use the platform only for collecting authentic customer feedback and managing engagement responsibly.",
      "If misuse, spam, fraudulent activity, or policy violations are detected, service access may be suspended or terminated without prior notice.",
    ],
  },
  {
    id: "04",
    title: "Data Usage & Privacy",
    content: [
      "Customer feedback collected through the platform is visible only within the client dashboard and authorized systems.",
      "We do not sell or transfer customer data to unrelated third parties.",
      "Third-party platforms may independently collect and store data according to their own policies. Mango Review does not control third-party data practices.",
    ],
  },
  {
    id: "05",
    title: "Technical Limitations",
    content: [
      "Temporary disruptions may occur due to internet issues, device compatibility, server downtime, maintenance, or third-party platform availability.",
      "We are not responsible for technical issues outside our reasonable control.",
    ],
  },
  {
    id: "06",
    title: "Limitation of Liability",
    content: [
      "Mango Review provides tools to support customer feedback management and engagement workflows.",
      "We are not liable for customer behavior, customer-submitted content, negative feedback, business impact, or actions taken by third-party platforms.",
      "Any action taken by third-party platforms, directly or indirectly, against the client shall not be the responsibility of Mango Review (Oasis Ascend).",
      "We do not control or modify customer-submitted content on third-party platforms.",
    ],
  },
  {
    id: "07",
    title: "Cancellation & Refund Policy",
    content: [
      "Once the service has been activated and used, refunds may not be provided for the used service period.",
      "If the client misuses the platform or violates applicable policies, the service may be suspended or terminated.",
    ],
  },
  {
    id: "08",
    title: "Compliance with Third-Party Policies",
    content: [
      "Clients are responsible for using the platform in compliance with all applicable third-party platform guidelines.",
      "Any guideline changes introduced by third-party platforms shall be applicable to clients using our platform.",
      "Mango Review does not permit fake reviews, review gating, incentivized reviews, or misleading practices.",
    ],
  },
  {
    id: "09",
    title: "Acceptance of Terms",
    content: [
      "By using Mango Review, the client acknowledges and agrees to all Terms & Conditions described above.",
      "Any new policies, updates, or modifications introduced by Mango Review will be updated in this section.",
    "Clients are encouraged to review this section periodically to stay informed about the latest terms and guidelines.",
    "Continued use of the platform after any updates constitutes acceptance of the revised policies.",
    "Any updates or changes introduced by third-party platforms will also be applicable to clients using our platform.",
    ],
    
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground mb-5">
            Mango Review
          </div>

          <h3 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-3">
            Terms of Service
          </h3>

          <p className="text-xs md:text-sm text-muted-foreground">
            Effective Date: April 2026
          </p>
        </div>

        {/* Intro */}
        <div className="mb-10">
          <p className="text-[13px] md:text-sm leading-7 text-muted-foreground max-w-3xl">
            These Terms of Service ("Terms") govern your use of Mango
            Review&apos;s customer feedback management platform and related
            services. By accessing or using Mango Review, you agree to comply
            with these Terms.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {termsSections.map((section) => (
            <section
              key={section.id} className="mb-10"
            >
              {/* Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center text-[11px] font-semibold">
                  {section.id}
                </div>

                <h4 className="text-sm md:text-base font-semibold text-foreground">
                  {section.title}
                </h4>   
              </div>

              {/* Content */}
              <div className="space-y-3">
                {section.content.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-[12px] md:text-[13px] leading-6 text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}