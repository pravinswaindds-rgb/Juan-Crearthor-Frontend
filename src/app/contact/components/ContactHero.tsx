"use client";

import { useRef } from "react";
import { useTextReveal } from "@/hooks/useTextReveal";
import { SectionLabel, Heading } from "@/components/ui";
import type { StrapiContactHero } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";

interface ContactHeroProps {
  data?: StrapiContactHero | null;
}

export default function ContactHero({ data }: ContactHeroProps) {
  const container = useRef<HTMLElement>(null);
  useTextReveal(container);

  const bgImage = data?.backgroundImage ? getStrapiMedia(data.backgroundImage.url) : null;

  return (
    <section ref={container}
      className="relative pt-32 pb-16 px-6 lg:px-10 max-w-[1440px] mx-auto text-center overflow-hidden min-h-[400px] flex flex-col justify-center items-center no-global-reveal"
      style={bgImage ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      {/* Dark overlay if there's a background image */}
      {bgImage && <div className="absolute inset-0 bg-[#05070d]/80 pointer-events-none" />}

      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gradient-radial from-cyan/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-magenta/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <span className="text-[12px] font-bold text-cyan-light tracking-[4px] uppercase mb-4 split">
          {data?.eyebrow || "Contact"}
        </span>
        <h1 
          className="text-[40px] md:text-[60px] lg:text-[80px] leading-none uppercase tracking-wide split gradient-text"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          {data?.titleone || "Get In Touch With Us"}
        </h1>
        {data?.titletwo && <span className="text-white block mt-2 split">{data.titletwo}</span>}
        
        {data?.description && (
          <p className="max-w-2xl mx-auto text-text-muted text-sm sm:text-base leading-relaxed mt-6 split">
            {data.description}
          </p>
        )}
      </div>
    </section>
  );
}
