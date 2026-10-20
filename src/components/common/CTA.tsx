"use client";

import type { StrapiCTAA } from "@/types/strapi";
import { DecorativeDots } from "@/components/ui";
import MagneticLink from "@/components/common/MagneticLink";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CTAProps {
  data?: StrapiCTAA | null;
}

export default function CTA({ data }: CTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const title = data?.title || "LET'S CONNECT AND COLLABORATE";
  const eyebrow = data?.eyebrow || "LET'S WORK TOGETHER";
  const description =
    data?.description ||
    "Have an idea, project, or opportunity in mind? Let's connect and create something meaningful together.";

  const resolveUrl = (url?: string | null) => {
    if (!url || url.trim() === "" || url === "/contact") {
      return "/contact#contact-form";
    }
    return url;
  };

  const primaryButtonLabel = data?.primaryButton?.label || "Contact Now";
  const primaryButtonUrl = resolveUrl(data?.primaryButton?.url);

  const secondaryButtonLabel = data?.secondaryButton?.label || "Get in Touch";
  const secondaryButtonUrl = resolveUrl(data?.secondaryButton?.url);

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>, targetUrl: string) => {
    if (typeof window !== "undefined") {
      const isContactPage = window.location.pathname === "/contact";
      const isTargetingContactForm =
        targetUrl === "/contact" ||
        targetUrl.includes("#contact-form") ||
        targetUrl.includes("#contact");

      if (isContactPage && isTargetingContactForm) {
        e.preventDefault();
        const formEl =
          document.getElementById("contact-form") ||
          document.querySelector("form");

        const lenis = (window as any).__lenis;
        if (lenis && formEl) {
          lenis.scrollTo(formEl, { offset: -80, duration: 1.2 });
        } else if (formEl) {
          formEl.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (lenis) {
          lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (formEl) {
          const firstInput = formEl.querySelector(
            "input:not([type='hidden'])"
          ) as HTMLInputElement | null;
          if (firstInput) {
            setTimeout(() => firstInput.focus(), 600);
          }
        }
      }
    }
  };

  useGSAP(
    () => {
      let isMounted = true;
      let textElements: SplitType[] = [];

      const init = () => {
        if (!isMounted || !containerRef.current) return;

        const elements = containerRef.current.querySelectorAll(".split");
        if (!elements || elements.length === 0) return;

        gsap.set(elements, { opacity: 1 });

        const allLines: HTMLElement[] = [];

        elements.forEach((el) => {
          const text = new SplitType(el as HTMLElement, { types: "words,lines", lineClass: "line" });
          textElements.push(text);

          // Add overflow hidden wrapper to each line
          text.lines?.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.style.overflow = "hidden";
            wrapper.style.display = "block";

            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);

            // If this is a gradient text, we need to apply gradient to lines
            if (line.closest(".gradient-text")) {
              line.style.backgroundImage =
                "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)";
              line.style.webkitBackgroundClip = "text";
              line.style.webkitTextFillColor = "transparent";
              line.style.backgroundClip = "text";
            }

            allLines.push(line);
          });

          // Remove original gradient style so it doesn't duplicate
          const gradientParent = el.closest(".gradient-text") as HTMLElement;
          if (gradientParent && el === gradientParent) {
            gradientParent.style.background = "none";
            gradientParent.style.webkitTextFillColor = "initial";
          }
        });

        const buttons = buttonsRef.current
          ? Array.from(buttonsRef.current.children)
          : [];

        if (allLines.length > 0) {
          gsap.fromTo(
            allLines,
            { yPercent: 120 },
            {
              yPercent: 0,
              stagger: 0.08,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                scrub: true,
                start: "clamp(top 95%)",
                end: "clamp(bottom 75%)",
              },
            }
          );
        }

        if (buttons.length > 0) {
          gsap.fromTo(
            buttons,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.8,
              ease: "expo.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 95%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        }
      };

      if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (!isMounted || !containerRef.current) return;
          init();
          try {
            ScrollTrigger?.refresh?.();
          } catch {
            // Ignore refresh error if triggered during navigation
          }
        });
      } else {
        init();
        try {
          ScrollTrigger?.refresh?.();
        } catch {
          // Ignore
        }
      }

      return () => {
        isMounted = false;
        textElements.forEach((t) => t.revert());
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="max-w-310 mx-auto rounded-[20px] border border-[#f4a8ff]/20 bg-white/2 backdrop-blur-xl text-center py-12 sm:py-14 px-6 sm:px-12 lg:px-16 overflow-hidden relative my-16"
    >
      {/* Radial cyan gradient blur effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14)_0%,transparent_70%)] pointer-events-none" />

      {/* Decorative starry dots to match the image */}
      <DecorativeDots className="opacity-40" />

      <div className="relative z-10 container">
        <p
          className="text-center mb-3 sm:mb-4 uppercase split"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: "12px",
            letterSpacing: "4px",
            color: "#a2f4fd",
          }}
        >
          {eyebrow}
        </p>

        <h2
          className="text-center mb-4 sm:mb-6 font-anton text-3xl sm:text-5xl lg:text-[60px] uppercase split gradient-text"
          style={{
            lineHeight: "1.0",
            background:
              "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h2>

        <p
          className="text-center mx-auto mb-8 sm:mb-10 split"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "14px",
            lineHeight: "24px",
            letterSpacing: "-0.02em",
            color: "#5e6670",
            maxWidth: "608px",
          }}
        >
          {description}
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <MagneticLink
            href={primaryButtonUrl}
            onClick={(e) => handleButtonClick(e, primaryButtonUrl)}
            target={data?.primaryButton?.openNewTab ? "_blank" : undefined}
            className="inline-flex items-center justify-center rounded-full transition-[background-color,border-color,box-shadow,color] duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "18px",
              color: "#05070d",
              background: "#a2f4fd",
              border: "1px solid rgba(83,234,253,0.4)",
              padding: "14px 24px",
              boxShadow: "0 0 50px rgba(34,211,238,0.2)",
            }}
          >
            {primaryButtonLabel}
          </MagneticLink>

          <MagneticLink
            href={secondaryButtonUrl}
            onClick={(e) => handleButtonClick(e, secondaryButtonUrl)}
            target={data?.secondaryButton?.openNewTab ? "_blank" : undefined}
            className="inline-flex items-center justify-center rounded-full transition-[background-color,border-color,box-shadow,color] duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "18px",
              color: "#fae8ff",
              background: "rgba(244,168,255,0.1)",
              border: "1px solid rgba(244,168,255,0.4)",
              padding: "14px 24px",
              boxShadow: "0 0 32px rgba(244,168,255,0.15)",
            }}
          >
            {secondaryButtonLabel}
          </MagneticLink>
        </div>
      </div>
    </div>
  );
}
