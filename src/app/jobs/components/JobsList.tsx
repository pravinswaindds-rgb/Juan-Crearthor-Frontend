"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionLabel, Heading } from "@/components/ui";
import type { StrapiJobRoleItem } from "@/types/strapi";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface MagneticApplyButtonProps {
  href: string;
  strength?: number;
}

function MagneticApplyButton({ href, strength = 0.6 }: MagneticApplyButtonProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const zone = zoneRef.current;
    const btn = btnRef.current;
    if (!zone || !btn) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = zone.getBoundingClientRect();
      const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
      const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

      gsap.to(btn, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
        overwrite: true,
      });
    };

    zone.addEventListener("mousemove", onMouseMove);
    zone.addEventListener("mouseleave", onMouseLeave);

    return () => {
      zone.removeEventListener("mousemove", onMouseMove);
      zone.removeEventListener("mouseleave", onMouseLeave);
      gsap.killTweensOf(btn);
    };
  }, [strength]);

  return (
    <div
      ref={zoneRef}
      className="shrink-0 flex items-center justify-center p-6 -m-6"
    >
      <Link
        ref={btnRef}
        href={href}
        className="flex flex-col items-center justify-center w-[120px] h-[120px] rounded-full border border-white/10 bg-transparent hover:bg-white/5 hover:border-white/20 transition-colors duration-300 group-hover:border-cyan-light/30 will-change-transform"
      >
        <ArrowUpRight className="w-5 h-5 text-white mb-2 group-hover:text-cyan-light group-hover:scale-110 transition-transform" />
        <span className="text-[13px] font-medium text-white tracking-wide">Apply Now</span>
      </Link>
    </div>
  );
}

interface JobsListProps {
  data?: StrapiJobRoleItem[];
  slugMap?: Record<string, string>; // title → slug from job-positions
}

export default function JobsList({ data, slugMap = {} }: JobsListProps) {
  const containerRef = useRef<HTMLElement>(null);

  /** Scattered-to-stacked animation on scroll matching reference */
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".job-card-item", containerRef.current);
      if (cards.length === 0) return;

      cards.forEach((card, index) => {
        // Alternating organic tilt and offset angles matching Jamie McKaye reference
        const angles = [-5, 4.5, -4.5, 4, -4, 4.5];
        const initialRotation = angles[index % angles.length];
        const initialX = index % 2 === 0 ? -60 : 60;

        gsap.fromTo(
          card,
          {
            rotationZ: initialRotation,
            x: initialX,
            y: 80,
            opacity: 0.5,
            scale: 0.95,
          },
          {
            rotationZ: 0,
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 98%",
              end: "top 55%",
              scrub: 1.2,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  if (!data || data.length === 0) return null;

  /** Slugify a title for fallback when no matching job-position exists */
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  let globalIndex = 0;

  return (
    <section
      ref={containerRef}
      className="pt-10 pb-64 px-6 lg:px-[100px] w-full mx-auto overflow-x-clip"
      style={{
        backgroundColor: "#05070d",
        backgroundImage:
          "radial-gradient(ellipse at 100% 0%, rgba(34,211,238,0.14) 0%, rgba(34,211,238,0) 70%)",
      }}
    >
      {data.map((roleSection) => (
        <div key={roleSection.id} className="mb-20">
          <SectionLabel className="mb-4 text-cyan-light tracking-[4px] text-[12px] uppercase">
            {roleSection.eyebroww || roleSection.eyebrow || "ROLES"}
          </SectionLabel>
          <Heading level={2} gradient className="mb-6 uppercase text-[40px] md:text-[60px] leading-[1]">
            {roleSection.title || "CURRENT OPEN POSITIONS"}
          </Heading>
          <div
            className="max-w-xl text-text-muted text-sm leading-[24px] mb-16"
            dangerouslySetInnerHTML={{ __html: roleSection.description }}
          />

          <div className="flex flex-col gap-6">
            {roleSection.cards?.map((job) => {
              globalIndex++;
              const indexFormatted = String(globalIndex).padStart(2, "0");

              // Parse job tags safely depending on the Strapi format
              let tags: string[] = [];
              if (Array.isArray(job.jobstags)) {
                tags = job.jobstags.map((t: any) =>
                  typeof t === "string"
                    ? t
                    : t.Label || Object.values(t).find((v) => typeof v === "string") || "Tag"
                );
              } else if (typeof job.jobstags === "string") {
                try {
                  const parsed = JSON.parse(job.jobstags);
                  if (Array.isArray(parsed)) tags = parsed;
                  else tags = [job.jobstags];
                } catch {
                  tags = [job.jobstags];
                }
              }

              // Resolve slug from job-position collection, fallback to slugified title
              const jobSlug = slugMap[job.title] || slugify(job.title);

              return (
                <div
                  key={job.id}
                  className="job-card-item relative p-8 lg:p-10 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-light/30 transition-[border-color,background-color] duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group backdrop-blur-sm"
                  style={{ transformOrigin: "center center", willChange: "transform, opacity" }}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="font-mono text-xs text-cyan-light/60 tracking-wider font-semibold">
                        {indexFormatted}
                      </span>
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-[#0b0e14] border border-cyan-light/20 px-4 py-1.5 rounded-full text-[11px] font-bold text-cyan-light uppercase tracking-[1px]"
                        >
                          {tag}
                        </span>
                      ))}
                      {job.location && (
                        <span className="text-[13px] text-text-muted">{job.location}</span>
                      )}
                    </div>

                    <h3
                      className="mb-3 text-[28px] md:text-[34px] text-[#e5faff] uppercase tracking-wide group-hover:text-cyan-light transition-colors"
                      style={{ fontFamily: "var(--font-anton)" }}
                    >
                      {job.title}
                    </h3>
                    <p className="text-[14px] text-text-muted max-w-3xl leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <MagneticApplyButton href={`/jobs/${jobSlug}`} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
