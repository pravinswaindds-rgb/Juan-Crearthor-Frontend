"use client";

import { useRef } from "react";
import { useTextReveal } from "@/hooks/useTextReveal";
import { SectionLabel, Heading, DecorativeDots } from "@/components/ui";
import type { StrapiServicesHero } from "@/types/strapi";

export default function ServicesHero({ data }: { data?: StrapiServicesHero }) {
  const container = useRef<HTMLElement>(null);
  useTextReveal(container);

  return (
    <section ref={container} className="relative pt-[164px] pb-16 md:pb-[120px] px-6 max-w-[1440px] mx-auto text-center overflow-hidden no-global-reveal">
      <DecorativeDots />

      <SectionLabel responsive className="mb-6 text-cyan-light uppercase split">
        {data?.eyebrow || "Our Services"}
      </SectionLabel>

      <Heading level={1} className="mb-8 lg:text-[90px] uppercase">
        <span className="gradient-text block split">{data?.titleone || "Innovative Service"}</span>
        <span className="text-white block split">{data?.titletwo || "Design to Business"}</span>
        {data?.titlethree && (
          <span className="text-white block mt-2 split">{data.titlethree}</span>
        )}
      </Heading>

      <p className="px-[311px] mx-auto text-text-muted text-sm sm:text-base leading-relaxed split">
        {data?.description || "We deliver future-ready digital solutions that help businesses grow, innovate, and lead in the digital era. From strategy to execution, we build experiences that make an impact."}
      </p>
    </section>
  );
}
