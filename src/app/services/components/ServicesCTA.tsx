import type { StrapiCTAA } from "@/types/strapi";
import { SectionLabel, Heading, DecorativeDots, Button } from "@/components/ui";

interface ServicesCTAProps {
  data?: StrapiCTAA | null;
}

export default function ServicesCTA({ data }: ServicesCTAProps) {
  return (
    <section className="py-24 pb-72 px-6 lg:px-10 max-w-[1440px] mx-auto">
      <div className="relative rounded-3xl overflow-hidden py-20 px-12 text-center">
        {/* Radial cyan gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14)_0%,transparent_70%)] pointer-events-none" />

        <DecorativeDots />

        <div className="relative z-10">
          <SectionLabel className="mb-4 text-cyan-light">
            {data?.eyebrow || "Let's Work Together"}
          </SectionLabel>
          <Heading level={2} gradient className="mb-6 md:text-[60px] leading-[1]">
            {data?.title || "Let's Connect and Collaborate"}
          </Heading>
          <p className="max-w-xl mx-auto text-text-muted text-sm leading-[24px] tracking-[-0.02em] mb-10">
            {data?.description || "Have an idea, project, or opportunity in mind? Let's connect and create something meaningful together. We're always ready to turn great ideas into impactful digital experiences."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button href={data?.primaryButton?.url || "/contact"} variant="secondary" size="lg">
              {data?.primaryButton?.label || "Contact Now"}
            </Button>
            <Button
              href={data?.secondaryButton?.url || "/contact"}
              variant="outline"
              size="lg"
              className="border-magenta-light/40 text-magenta-lighter bg-magenta-light/10 shadow-[0_0_32px_rgba(244,168,255,0.15)] hover:shadow-[0_0_32px_rgba(244,168,255,0.3)]"
            >
              {data?.secondaryButton?.label || "Get in Touch"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
