"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { SectionLabel, Heading } from "@/components/ui";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StrapiServicesSection, StrapiServiceItem } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";

gsap.registerPlugin(ScrollTrigger);

const colorMap = {
  cyan: {
    border: "rgba(83,234,253,0.2)",
    iconBg: "rgba(83,234,253,0.1)",
    iconStroke: "#a2f4fd",
  },
  pink: {
    border: "rgba(244,168,255,0.2)",
    iconBg: "rgba(244,168,255,0.1)",
    iconStroke: "#f6cfff",
  },
  blue: {
    border: "rgba(142,197,255,0.2)",
    iconBg: "rgba(142,197,255,0.1)",
    iconStroke: "#bedbff",
  },
};

function ServiceIcon({ icon, strokeColor }: { icon: string; strokeColor: string }) {
  const icons: Record<string, React.ReactNode> = {
    monitor: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
    globe: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    smartphone: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>,
    box: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    glasses: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><path d="M2 12h20M6 12a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4" /></svg>,
    brain: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-4 4v1a4 4 0 0 0 4 4h1v3a4 4 0 0 0 8 0v-3h1a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4V6a4 4 0 0 0-4-4z" /></svg>,
    cpu: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" /></svg>,
    "credit-card": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /></svg>,
    database: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
    award: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><circle cx="12" cy="8" r="7" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /></svg>,
    "trending-up": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
    target: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    server: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><path d="M6 6h.01M6 18h.01" /></svg>,
    "message-circle": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>,
    layers: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    zap: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  };
  return icons[icon] || icons.box;
}

export default function ServicesGrid({ data }: { data?: StrapiServicesSection | null }) {
  const items = data?.Services || [];
  const colorKeys = ["cyan", "pink", "blue"] as const;

  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sec = sectionRef.current;
    const wrapper = wrapperRef.current;
    const pinWrap = stripRef.current;

    if (!sec || !wrapper || !pinWrap) return;

    let pinWrapWidth: number = 0;
    let horizontalScrollLength: number = 0;

    function refresh() {
      if (!wrapper || !pinWrap) return;
      pinWrapWidth = pinWrap.scrollWidth;
      horizontalScrollLength = pinWrapWidth - wrapper.clientWidth;
    }

    refresh();

    if (horizontalScrollLength > 0) {
      const scrollTween = gsap.to(pinWrap, {
        scrollTrigger: {
          scrub: true,
          trigger: sec,
          pin: true,
          start: "top top",
          end: () => `+=${pinWrapWidth}`,
          invalidateOnRefresh: true
        },
        x: () => -horizontalScrollLength,
        ease: "none"
      });

      const cards = gsap.utils.toArray(".service-card", pinWrap);
      cards.forEach((card: any) => {
        gsap.from(card, {
          yPercent: "random(-200, 200)",
          rotation: "random(-30, 30)",
          opacity: 0,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: "left 105%",
            end: "left 60%", // Finishes earlier, which means it animates faster
            scrub: 0.2 // Reduced smoothing for a faster, snappier response
          }
        });
      });
    }

    ScrollTrigger.addEventListener("refreshInit", refresh);

    // Ensure ScrollTrigger refreshes if fonts/images change the layout size
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(pinWrap);

    // Also try refreshing once fonts are ready
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", refresh);
      resizeObserver.disconnect();
    };
  }, { scope: sectionRef });

  if (!items.length) return null;

  return (
    <section ref={sectionRef} className="py-[120px] w-full relative">
      {/* Ambient background glows */}
      <div className="absolute -left-48 top-10 w-[600px] h-[600px] bg-cyan/[0.08] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -right-48 top-[40%] w-[600px] h-[600px] bg-magenta/[0.08] rounded-full blur-[150px] pointer-events-none" />

      <div className="text-center mb-[60px] relative z-10 px-6 lg:px-10 max-w-[1440px] mx-auto">
        <SectionLabel className="mb-4 text-cyan-light">What We Do</SectionLabel>
        <Heading level={2} gradient className="mb-4 md:text-[60px] leading-[1]">
          {data?.Title || "End to End Solutions"}
        </Heading>
        <p className="max-w-xl mx-auto text-text-muted text-sm leading-relaxed">
          {data?.Description ||
            "Explore our full range of services crafted to solve complex challenges, drive growth, and create long-term value."}
        </p>
      </div>

      <div ref={wrapperRef} className="w-full relative z-10">
        <div ref={stripRef} className="flex flex-nowrap gap-6 will-change-transform w-max pl-[24px] lg:pl-[40px] xl:pl-[max(40px,calc((100vw-1440px)/2+40px))]">
          {items.map((item, index) => {
            const colorKey = colorKeys[index % colorKeys.length];
            const colors = colorMap[colorKey as keyof typeof colorMap];

            const title = item.Title;
            const description = item.Description;
            const strapiIcon = item.Icon;

            return (
              <div
                key={title + index}
                className="service-card rounded-[20px] p-6 transition-all group relative w-[85vw] sm:w-[45vw] lg:w-[350px] shrink-0 whitespace-normal"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${colors.border}`,
                  backdropFilter: "blur(100px)",
                }}
              >
                <div className="flex items-center justify-between mb-7.5">
                  <div
                    className="w-[50px] h-[50px] rounded-[10px] flex items-center justify-center relative overflow-hidden"
                    style={{ background: colors.iconBg }}
                  >
                    {strapiIcon && strapiIcon.url ? (
                      <Image
                        src={getStrapiMedia(strapiIcon.url) || ""}
                        alt={strapiIcon.alternativeText || title}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      <ServiceIcon icon="box" strokeColor={colors.iconStroke} />
                    )}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8e9aa8" strokeWidth="1.5" className="group-hover:text-cyan transition-colors">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
                <Heading level={3} className="mb-2 text-[22px] leading-[1]">
                  <span className="gradient-text">{title}</span>
                </Heading>
                <p className="text-text-muted text-sm leading-[20px] tracking-[-0.02em]">
                  {description}
                </p>
              </div>
            );
          })}
          {/* Spacer to simulate right padding securely */}
          <div className="w-[20px] md:w-[50px] lg:w-[100px] shrink-0"></div>
        </div>
      </div>
    </section>
  );
}
