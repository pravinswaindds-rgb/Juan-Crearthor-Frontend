"use client";

import { useRef } from "react";
import { useTextReveal } from "@/hooks/useTextReveal";
import { SectionLabel, Heading } from "@/components/ui";
import type { StrapiHero } from "@/types/strapi";

export default function AboutHero({ data }: { data?: StrapiHero }) {
  const container = useRef<HTMLElement>(null);
  useTextReveal(container);

  return (
      <section ref={container} className="relative pt-32 pb-16 md:pb-29 px-6 xl:px-77.75 mx-auto text-center overflow-hidden no-global-reveal">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gradient-radial from-cyan/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-magenta/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <SectionLabel responsive className="mb-6 split">
          {data?.eyebroww || "About Us"}
        </SectionLabel>

        <Heading level={1} className="mb-8">
          <span className="gradient-text block split">{data?.titleLine1 || "Who We Are &"}</span>
          <span className="gradient-text block split">{data?.titleLine2 || "What We Stand For"}</span>
        </Heading>

        <p className="mx-auto text-[#5E6670] text-sm sm:text-base leading-relaxed split">
          {data?.description || "Crearthor is a software development laboratory, solution architect, and strategy creator. Founded on July 12, 2024, in Pennsylvania, USA, Crearthor was born from a bold vision to build a powerful collective of creators, innovators, and strategists who reshape the future of technology."}
        </p>
      </section>
    );
  }
