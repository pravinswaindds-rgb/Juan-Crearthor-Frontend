"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { StrapiPortfolioCategoryItem } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";

interface PortfolioCategoryItemProps {
  item: StrapiPortfolioCategoryItem;
}

export default function PortfolioCategoryItem({ item }: PortfolioCategoryItemProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const xTo = useRef<((value: number) => void) | null>(null);
  const yTo = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    if (!imageRef.current) return;
    gsap.set(imageRef.current, { xPercent: -50, yPercent: -50 });
    xTo.current = gsap.quickTo(imageRef.current, "x", {
      duration: 0.65,
      ease: "power2.out",
    });
    yTo.current = gsap.quickTo(imageRef.current, "y", {
      duration: 0.65,
      ease: "power2.out",
    });

    return () => {
      xTo.current = null;
      yTo.current = null;
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Send coordinates to GSAP quickTo with trailing delay
    if (xTo.current) xTo.current(rawX);
    if (yTo.current) yTo.current(rawY);

    // Calculate edge opacity (fades to 0 as it hits the border)
    const fadeZoneY = Math.min(45, rect.height * 0.22);
    const fadeZoneX = Math.min(70, rect.width * 0.1);

    const distTop = rawY;
    const distBottom = rect.height - rawY;
    const distLeft = rawX;
    const distRight = rect.width - rawX;

    let opacity = 1;
    if (distTop <= 0 || distBottom <= 0 || distLeft <= 0 || distRight <= 0) {
      opacity = 0;
    } else {
      const opacityY = Math.min(1, Math.min(distTop, distBottom) / fadeZoneY);
      const opacityX = Math.min(1, Math.min(distLeft, distRight) / fadeZoneX);
      opacity = Math.min(opacityY, opacityX);
    }

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: opacity,
        duration: 0.2,
        overwrite: "auto",
      });
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!containerRef.current || !imageRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Place immediately at cursor on entry, then animate in
    gsap.set(imageRef.current, { x: rawX, y: rawY, scale: 0.9, rotate: -8 });
    gsap.to(imageRef.current, {
      opacity: 1,
      scale: 1.05,
      rotate: -4,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });

    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const coverImageUrl = item.coverImage ? getStrapiMedia(item.coverImage.url) : null;

  return (
    <Link
      href={`/portfolio/category/${item.slug}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col lg:flex-row items-center py-14 lg:py-16 min-h-[240px] lg:min-h-[260px] border-b border-white/5 gap-8 lg:gap-16 transition-colors group cursor-pointer block"
    >
      {/* Eyebrow and Category Title */}
      <div className="flex flex-col gap-2 w-full lg:w-[35%] lg:pl-6 z-10">
        <span className="text-white text-sm font-medium tracking-wide">
          {item.eyebrow || "Category"}
        </span>
        <h3 className="text-[36px] lg:text-[44px] font-black uppercase leading-tight bg-gradient-to-r from-cyan-200 via-pink-200 to-white bg-clip-text text-transparent">
          {item.title}
        </h3>
      </div>

      {/* Description */}
      <div className="flex-1 lg:border-l border-white/10 lg:pl-10 z-10">
        <p className="text-[#8E96A0] group-hover:text-white transition-colors duration-300 text-sm leading-relaxed max-w-xl group-hover:[text-shadow:0_2px_12px_rgba(0,0,0,1),0_0_8px_rgba(0,0,0,1)]">
          {item.description}
        </p>
      </div>

      {/* Explore Button */}
      <div className="shrink-0 lg:pr-6 self-start lg:self-center z-20">
        <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full border border-white/20 text-white transition-all duration-300 group-hover:bg-[#F4A8FF]/10 group-hover:border-[#F4A8FF]/40 group-hover:shadow-[0_0_32px_rgba(244,168,255,0.15)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          >
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
          <span className="text-xs font-medium text-center px-2">
            {item.buttonText || "Explore"}
          </span>
        </div>
      </div>

      {/* Floating 3D Illustration on Cursor Hover */}
      {coverImageUrl && (
        <div
          ref={imageRef}
          className="absolute left-0 top-0 z-0 pointer-events-none w-44 h-44 lg:w-52 lg:h-52 flex items-center justify-center opacity-0"
        >
          {/* 3D Asset without colored background glow */}
          <div
            className="relative w-full h-full"
            style={{
              filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.65))",
            }}
          >
            <Image
              src={coverImageUrl}
              alt={item.title}
              fill
              className="object-contain pointer-events-none select-none"
              unoptimized
            />
          </div>
        </div>
      )}
    </Link>
  );
}
