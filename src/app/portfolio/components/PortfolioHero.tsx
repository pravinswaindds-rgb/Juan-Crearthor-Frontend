"use client";

import { useRef } from "react";
import { useTextReveal } from "@/hooks/useTextReveal";
import { SectionLabel, Heading } from "@/components/ui";
import type { StrapiPortfolioHero } from "@/types/strapi";

export default function PortfolioHero({ data }: { data?: StrapiPortfolioHero | null }) {
  const container = useRef<HTMLElement>(null);
  useTextReveal(container);

  return (
    <section ref={container} className="relative pt-[164px] pb-16 md:pb-[120px] px-6 max-w-[1440px] mx-auto text-center overflow-hidden no-global-reveal">
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gradient-radial from-cyan/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-magenta/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <SectionLabel responsive className="mb-6 split">
        {data?.eyebrow || "Our Portfolio"}
      </SectionLabel>
      <Heading level={1}>
        <span className="gradient-text block split">{data?.titleone || "Showcasing Our Crafted"}</span>
        <span className="block split">{data?.titletwo || "Solutions"}</span>
        {data?.titlethree && <span className="block mt-2 text-3xl md:text-5xl split">{data.titlethree}</span>}
      </Heading>
    </section>
  );
}
