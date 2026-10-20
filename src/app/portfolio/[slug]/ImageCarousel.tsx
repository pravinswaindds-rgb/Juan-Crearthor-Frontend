"use client";

import Image from "next/image";
import React, { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getStrapiMedia } from "@/lib/strapi";

gsap.registerPlugin(ScrollTrigger);

export default function ImageCarousel({ images }: { images: any[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Normalize images to extract valid image objects regardless of Strapi nesting
  const normalizedImages = useMemo(() => {
    if (!images) return [];
    if (!Array.isArray(images)) {
      if (typeof images === "object" && (images as any).url) {
        return [images];
      }
      return [];
    }

    const flat: any[] = [];
    images.forEach((item) => {
      if (!item) return;
      if (item.url) {
        flat.push(item);
      } else if (item.image?.url) {
        flat.push(item.image);
      } else if (Array.isArray(item.Gallery)) {
        item.Gallery.forEach((g: any) => g?.url && flat.push(g));
      } else if (Array.isArray(item.images)) {
        item.images.forEach((g: any) => g?.url && flat.push(g));
      }
    });

    // Only keep items that have a valid media URL
    return flat.filter((img) => Boolean(img && img.url && getStrapiMedia(img.url)));
  }, [images]);

  const isScrollable = normalizedImages.length > 2;

  useGSAP(
    () => {
      // Only enable horizontal scrolling animation when there are more than 2 images
      if (!isScrollable) return;

      const sec = sectionRef.current;
      const wrapper = wrapperRef.current;
      const pinWrap = stripRef.current;

      if (!sec || !wrapper || !pinWrap) return;

      let pinWrapWidth = 0;
      let horizontalScrollLength = 0;

      function refresh() {
        if (!wrapper || !pinWrap) return;
        pinWrapWidth = pinWrap.scrollWidth;
        horizontalScrollLength = pinWrapWidth - wrapper.clientWidth;
      }

      refresh();

      if (horizontalScrollLength > 20) {
        const tween = gsap.to(pinWrap, {
          scrollTrigger: {
            scrub: 1,
            trigger: sec,
            pin: sec,
            start: "center center",
            end: () => `+=${Math.max(horizontalScrollLength * 1.1, 400)}`,
            invalidateOnRefresh: true,
          },
          x: () => -horizontalScrollLength,
          ease: "none",
        });

        ScrollTrigger.addEventListener("refreshInit", refresh);

        const resizeObserver = new ResizeObserver(() => {
          ScrollTrigger.refresh();
        });
        resizeObserver.observe(pinWrap);

        if (typeof document !== "undefined" && document.fonts) {
          document.fonts.ready.then(() => {
            ScrollTrigger.refresh();
          });
        }

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", refresh);
          resizeObserver.disconnect();
          tween.kill();
        };
      }
    },
    { scope: sectionRef, dependencies: [normalizedImages, isScrollable] }
  );

  if (!normalizedImages || normalizedImages.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="w-full relative py-16 overflow-hidden no-global-reveal"
    >
      {isScrollable ? (
        /* More than 2 images: horizontal scroll gallery */
        <div ref={wrapperRef} className="w-full overflow-x-auto lg:overflow-hidden no-scrollbar">
          <div
            ref={stripRef}
            className="flex flex-nowrap items-center gap-6 will-change-transform w-max pl-6 lg:pl-[100px] pr-6 lg:pr-[100px]"
          >
            {normalizedImages.map((img: any, i: number) => {
              const url = getStrapiMedia(img.url);
              const isPortrait =
                img.height && img.width && img.height > img.width * 1.15;

              return (
                <div
                  key={i}
                  className={`shrink-0 rounded-[22px] overflow-hidden relative border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:border-[#a2f4fd]/50 transition-all duration-300 hover:scale-[1.01] ${
                    isPortrait
                      ? "w-[200px] sm:w-[240px] md:w-[260px] h-[360px] sm:h-[400px] md:h-[440px]"
                      : "w-[85vw] sm:w-[500px] md:w-[620px] lg:w-[680px] h-[240px] sm:h-[320px] md:h-[380px] lg:h-[400px]"
                  }`}
                >
                  {url && (
                    <Image
                      src={url}
                      alt={img.alternativeText || `Gallery image ${i + 1}`}
                      fill
                      sizes={
                        isPortrait
                          ? "(max-width: 768px) 240px, 260px"
                          : "(max-width: 768px) 85vw, 680px"
                      }
                      className="object-cover object-center select-none pointer-events-none"
                      unoptimized
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2 or fewer images: centered horizontally without scroll effect */
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px] flex justify-center items-center">
          <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-6 w-full">
            {normalizedImages.map((img: any, i: number) => {
              const url = getStrapiMedia(img.url);
              const isPortrait =
                img.height && img.width && img.height > img.width * 1.15;
              const isSingle = normalizedImages.length === 1;

              return (
                <div
                  key={i}
                  className={`shrink-0 rounded-[22px] overflow-hidden relative border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:border-[#a2f4fd]/50 transition-all duration-300 hover:scale-[1.01] ${
                    isPortrait
                      ? isSingle
                        ? "w-[260px] sm:w-[320px] md:w-[360px] h-[420px] sm:h-[500px] md:h-[560px]"
                        : "w-[220px] sm:w-[260px] md:w-[280px] h-[380px] sm:h-[420px] md:h-[460px]"
                      : isSingle
                      ? "w-full max-w-[850px] h-[260px] sm:h-[380px] md:h-[440px] lg:h-[480px]"
                      : "w-full sm:w-[500px] md:w-[540px] lg:w-[590px] h-[240px] sm:h-[320px] md:h-[360px] lg:h-[380px]"
                  }`}
                >
                  {url && (
                    <Image
                      src={url}
                      alt={img.alternativeText || `Gallery image ${i + 1}`}
                      fill
                      sizes={
                        isPortrait
                          ? "(max-width: 768px) 280px, 360px"
                          : "(max-width: 768px) 100vw, 850px"
                      }
                      className="object-cover object-center select-none"
                      unoptimized
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
