"use client";

import { useRef } from "react";
import { useTextReveal } from "@/hooks/useTextReveal";
import { SectionLabel, Heading } from "@/components/ui";
import type { StrapiJobsHero } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";

interface JobsHeroProps {
  data?: StrapiJobsHero | null;
}

export default function JobsHero({ data }: JobsHeroProps) {
  const container = useRef<HTMLElement>(null);
  useTextReveal(container);

  const bgImage = data?.backgroundImage ? getStrapiMedia(data.backgroundImage.url) : null;

  // Helper to parse Strapi Blocks rich text into HTML
  const getParsedDescription = (desc: any) => {
    if (!desc) return "<p>Join our team of creators, innovators, and strategists. We're always looking for talented individuals who share our passion for building impactful digital solutions.</p>";
    if (typeof desc === "string") return desc;
    if (Array.isArray(desc)) {
      return desc.map((block: any) => {
        if (block.children) {
          const content = block.children.map((child: any) => child.text || "").join("");
          if (block.type === "paragraph") return `<p>${content}</p>`;
          if (block.type === "heading" && block.level === 1) return `<h1>${content}</h1>`;
          if (block.type === "heading" && block.level === 2) return `<h2>${content}</h2>`;
          if (block.type === "heading" && block.level === 3) return `<h3>${content}</h3>`;
          return `<p>${content}</p>`;
        }
        return "";
      }).join("");
    }
    return "";
  };

  return (
    <section ref={container} className="relative pt-32 pb-[100px] px-6 lg:px-10 w-full mx-auto text-center overflow-hidden min-h-screen flex flex-col items-center justify-center no-global-reveal" style={{ backgroundColor: "#05070d" }}>
      {/* Background image if exists */}
      {bgImage && (
        <Image
          src={bgImage}
          alt={data?.backgroundImage?.alternativeText || "Jobs Background"}
          fill
          className="object-cover opacity-20 mix-blend-luminosity"
        />
      )}

      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gradient-radial from-cyan/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-magenta/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <SectionLabel responsive className="mb-6 relative z-10 split">
        {data?.eyebrow || "Jobs"}
      </SectionLabel>
      <Heading level={1} gradient className="mb-8 relative z-10 mx-auto uppercase split gradient-text">
        {data?.TitleLine || "Shape The Future With Us"}
      </Heading>
      <div
        className="max-w-3xl mx-auto px-4 text-text-muted text-sm sm:text-base leading-relaxed relative z-10 split"
        dangerouslySetInnerHTML={{ __html: getParsedDescription(data?.description) }}
      />
    </section>
  );
}
