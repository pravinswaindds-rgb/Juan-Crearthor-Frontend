"use client";

import { useRef } from "react";
import { useTextReveal } from "@/hooks/useTextReveal";
import { SectionLabel, Heading } from "@/components/ui";
import { StrapiBlogHero } from "@/types/strapi";

interface BlogHeroProps {
  heroData?: StrapiBlogHero | null;
}

export default function BlogHero({ heroData }: BlogHeroProps) {
  const container = useRef<HTMLElement>(null);
  useTextReveal(container);

  return (
    <section ref={container} className="relative pt-32 pb-16 px-6 lg:px-10 max-w-[1440px] mx-auto text-center overflow-hidden no-global-reveal">
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gradient-radial from-cyan/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-magenta/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {heroData?.eyebrow ? (
        <SectionLabel responsive className="mb-6 split">
          {heroData.eyebrow}
        </SectionLabel>
      ) : (
        <SectionLabel responsive className="mb-6 split">
          Our Blog
        </SectionLabel>
      )}

      <Heading level={1}>
        {heroData?.titleone ? (
          <span className="gradient-text block split">{heroData.titleone}</span>
        ) : (
          <span className="gradient-text block split">Insights, Ideas &</span>
        )}
        {heroData?.titletwo ? (
          <span className="text-white block split">{heroData.titletwo}</span>
        ) : (
          <span className="text-white block split">Innovation</span>
        )}
      </Heading>

      {heroData?.description ? (
        <p className="mt-6 text-text-muted max-w-2xl mx-auto leading-relaxed split">
          {heroData.description}
        </p>
      ) : (
        <p className="mt-6 text-text-muted max-w-2xl mx-auto leading-relaxed split">
          Explore our latest articles on software architecture, advanced AI, cloud orchestration, and the strategies shaping tomorrow's digital ecosystem.
        </p>
      )}
    </section>
  );
}
