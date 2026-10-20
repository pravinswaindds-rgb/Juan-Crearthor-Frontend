"use client";

import Link from "next/link";
import MagneticLink from "@/components/common/MagneticLink";
import type { StrapiHero } from "@/types/strapi";
import { useRef } from "react";
import { useTextReveal } from "@/hooks/useTextReveal";


const fallbackData: StrapiHero = {
  id: 1,
  titleLine1: "WE CRAFT DIGITAL",
  titleLine2: "EXPERIENCES",
  description:
    "We are a team of creators, innovators, and strategists who believe in the power of technology to transform businesses and create meaningful impact.",
  eyebroww: "CREARTHOR - THE LEGACY",
  primaryButton: { id: 1, label: "Get Started", url: "/about", variant: "primary", openNewTab: false },
  secondaryButton: { id: 2, label: "View Our Work", url: "/portfolio", variant: "secondary", openNewTab: false },
  backgroundImage: null,
};


interface HeroProps {
  data?: StrapiHero;
}

export default function Hero({ data }: HeroProps) {
  const d = data ?? fallbackData;
  const container = useRef<HTMLElement>(null);

  useTextReveal(container);

  return (
    <section ref={container} className="relative w-full h-[820px] overflow-hidden no-global-reveal">
      {/* Content - centered in 1440px container */}
      <div className="relative z-10 max-w-[1440px] mx-auto h-full flex flex-col items-center justify-center px-6">
        {/* Section label */}
        <p
          className="font-semibold uppercase text-center mb-6 split"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "12px",
            lineHeight: "12px",
            letterSpacing: "4px",
            color: "#a2f4fd",
          }}
        >
          {d.eyebroww}
        </p>

        {/* Main heading - gradient text */}
        <h1
          className="text-center mb-0 leading-[1.1] split gradient-text"
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "90px",
            lineHeight: "1.1",
            background: "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {d.titleLine1}
        </h1>

        {/* Stroke text */}
        <h1
          className="text-center leading-[1.1] split"
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "90px",
            lineHeight: "90px",
            color: "rgba(255,255,255,0.05)",
            WebkitTextStroke: "1px rgba(125,249,255,0.72)",
          }}
        >
          {d.titleLine2}
        </h1>

        {/* Description */}
        <p
          className="text-center mt-8 mx-auto split"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "18px",
            lineHeight: "28px",
            letterSpacing: "-0.02em",
            color: "#5e6670",
            maxWidth: "818px",
          }}
        >
          {d.description}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-6 mt-10">
          {d.primaryButton && (
            <MagneticLink
              href={d.primaryButton.url ?? "/about"}
              className="inline-flex items-center justify-center rounded-full transition-[background-color,border-color,box-shadow,color] duration-300"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "18px",
                color: "#05070d",
                background: "#a2f4fd",
                border: "1px solid rgba(83,234,253,0.4)",
                padding: "14px 20px",
                boxShadow: "0 0 50px rgba(34,211,238,0.2)",
              }}
            >
              {d.primaryButton.label}
            </MagneticLink>
          )}

          {d.secondaryButton && (
            <MagneticLink
              href={d.secondaryButton.url ?? "/portfolio"}
              className="inline-flex items-center justify-center rounded-full transition-[background-color,border-color,box-shadow,color] duration-300"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "18px",
                color: "#fae8ff",
                background: "rgba(244,168,255,0.1)",
                border: "1px solid rgba(244,168,255,0.4)",
                padding: "14px 20px",
                boxShadow: "0 0 32px rgba(244,168,255,0.15)",
              }}
            >
              {d.secondaryButton.label}
            </MagneticLink>
          )}
        </div>
      </div>
    </section>
  );
}
