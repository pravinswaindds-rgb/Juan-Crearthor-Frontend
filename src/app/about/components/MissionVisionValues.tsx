"use client";

import type { StrapiAboutPhilosophy } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/common/TextReveal";

gsap.registerPlugin(ScrollTrigger);

export type CardItem = {
  title: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
  bulletColor?: string;
};

export type CardRow = {
  row: number;
  items: CardItem[];
};

const defaultCards: CardRow[] = [
  {
    row: 1,
    items: [
      {
        title: "Mission",
        description:
          "To architect transformative software solutions, empower visionary talent, and lead the digital world with creativity and strength.",
        bullets: [
          "Deliver advanced software, sales, and strategy services tailored to real-world challenges.",
          "Foster a global community of creators who redefine technology.",
          "Be relentless in our pursuit of quality, impact, and excellence.",
        ],
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        ),
      },
      {
        title: "Vision",
        description:
          "To build the most dynamic, innovative, and unstoppable team that shapes the future of technology with courage and creativity.",
        bullets: [
          "Create a global legacy of brilliance and breakthrough.",
          "Lead industries through original thinking and resilient execution.",
          "Inspire a new era of human-tech collaboration.",
        ],
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
      {
        title: "Values",
        description:
          "At the heart of Creathor reside integrity, passion, and innovation. Our values guide every idea we create and every solution we deploy.",
        bullets: [
          "Originality: We honor bold ideas and unique paths.",
          "Responsibility: We respect the earth, our people, and our impact.",
          "Strength: We move forward with courage, unity, and purpose.",
        ],
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        ),
      },
    ],
  },
  {
    row: 2,
    items: [
      {
        title: "Principles",
        description:
          "Our principles define how we work, lead, and grow. They're the standards we hold ourselves to in every project and partnership.",
        bullets: [
          "Be visionary, not just functional.",
          "Stay grounded, even when we reach high.",
          "Choose collaboration over competition.",
        ],
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
      {
        title: "Legacy",
        description:
          '"The Legacy" is not just our slogan\u2014it\u2019s our promise. We\u2019re here to build something that outlives us.',
        bullets: [
          "Shape digital foundations that stand the test of time.",
          "Empower creators to become leaders and legends.",
          "Leave behind a world better than we found it.",
        ],
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        title: "Team",
        description:
          "We are authors, architects, engineers, and strategists\u2014united by purpose, powered by passion, and guided by the strength of Thor.",
        bullets: [
          "Diverse talents, one shared vision: greatness.",
          "Support, hunt, and nurture the best minds in tech.",
          "Thrive on collaboration, innovation, and loyalty.",
        ],
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
    ],
  },
];

export default function MissionVisionValues({ data }: { data?: StrapiAboutPhilosophy }) {
  let allCards: CardItem[] = defaultCards.flatMap((row) => row.items);

  if (data?.cards?.length) {
    allCards = data.cards.map((c) => ({
      title: c.title,
      description: c.description,
      bullets: c.bullets?.map((b) => b.text || b.bullets || "") || [],
      bulletColor: c.bulletColor,
      icon: c.icon ? (
        <Image
          src={getStrapiMedia(c.icon.url) || ""}
          alt={c.icon.alternativeText || ""}
          width={24}
          height={24}
          className="brightness-0 invert"
        />
      ) : null,
    }));
  }

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
      gsap.to(pinWrap, {
        scrollTrigger: {
          scrub: true,
          trigger: sec,
          pin: sec,
          start: "top top",
          end: () => `+=${pinWrapWidth}`,
          invalidateOnRefresh: true
        },
        x: () => -horizontalScrollLength,
        ease: "none"
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

  return (
    <section
      ref={sectionRef}
      className="pt-24 pb-72 w-full mx-auto relative"
      style={{
        background: "radial-gradient(ellipse at 100% 0%, rgba(34,211,238,0.14) 0%, rgba(34,211,238,0) 70%)",
      }}
    >
      <div className="mb-14 px-[20px] md:px-[50px] lg:px-[100px]">
        <TextReveal as="p" className="text-cyan text-xs font-semibold tracking-[0.3em] uppercase mb-4">
          {data?.Eyebrow || "Our Foundation"}
        </TextReveal>
        <TextReveal as="h2" className="font-[family-name:var(--font-anton)] text-4xl sm:text-5xl md:text-6xl uppercase gradient-text mb-4 leading-[0.95]">
          {data?.Title || "Mission, Vision & Values"}
        </TextReveal>
        <TextReveal as="p" className="max-w-xl text-text-muted text-sm leading-relaxed whitespace-pre-line">
          {data?.Description || "Explore some of our latest projects, where creative ideas, thoughtful design, and modern technology come together to create meaningful digital experiences."}
        </TextReveal>
      </div>

      <div ref={wrapperRef} className="w-full">
        <div ref={stripRef} className="flex flex-nowrap gap-6 will-change-transform w-max pl-[20px] md:pl-[50px] lg:pl-[100px]">
          {allCards.map((card, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-[box-shadow] duration-300 w-[85vw] md:w-[45vw] lg:w-[350px] shrink-0 whitespace-normal"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-5">
                {card.icon}
              </div>

              <TextReveal as="h3" className="font-(family-name:--font-anton) text-lg uppercase text-white mb-3 ">
                {card.title}
              </TextReveal>

              <TextReveal as="p" className="text-text-muted text-sm leading-relaxed mb-5">
                {card.description}
              </TextReveal>

              <ul className="flex flex-col gap-2">
                {card.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={card.bulletColor || "#22d3ee"} stroke="none" className="shrink-0 mt-0.5">
                      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                      <path d="m9 12 2 2 4-4" stroke="#121212" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Spacer to simulate right padding safely across all browsers */}
          <div className="w-[20px] md:w-[50px] lg:w-[100px] shrink-0"></div>
        </div>
      </div>
    </section>
  );
}
