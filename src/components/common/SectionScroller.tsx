"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function SectionScroller({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Get all sections
    const panels = gsap.utils.toArray(".gsap-scroll-section", container.current) as HTMLElement[];
    if (panels.length === 0) return;

    // Pop the last one so it just scrolls in normally without pinning/fading
    panels.pop();

    panels.forEach((panel) => {
      // Get the element holding the content inside the panel
      const innerpanel = panel.querySelector(".gsap-scroll-inner") as HTMLElement;
      if (!innerpanel) return;

      // Calculate heights and scroll ratios for long panels
      const panelHeight = innerpanel.offsetHeight;
      const windowHeight = window.innerHeight;
      const difference = panelHeight - windowHeight;

      const fakeScrollRatio = difference > 0 ? (difference / (difference + windowHeight)) : 0;

      if (fakeScrollRatio > 0) {
        panel.style.marginBottom = `${panelHeight * fakeScrollRatio}px`;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: () => fakeScrollRatio > 0 ? `+=${innerpanel.offsetHeight}` : "bottom top",
          pinSpacing: false,
          pin: true,
          scrub: true,
        }
      });

      // Fake scroll if panel is taller than window
      if (fakeScrollRatio > 0) {
        tl.to(innerpanel, {
          yPercent: -100,
          y: windowHeight,
          duration: (1 / (1 - fakeScrollRatio)) - 1,
          ease: "none"
        });
      }

      // Set GPU acceleration hints
      gsap.set(panel, { willChange: "transform, opacity, filter" });

      // Scale down gently over the transition
      tl.fromTo(
        panel,
        { scale: 1 },
        { scale: 0.85, duration: 1, ease: "none" },
        ">"
      );

      // Smoothly blur and fade out by 75% of the scroll distance
      tl.fromTo(
        panel,
        { opacity: 1, filter: "blur(0px)" },
        { opacity: 0, filter: "blur(32px)", duration: 0.75, ease: "power2.inOut" },
        "<"
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="slides-wrapper relative w-full">
      {React.Children.map(children, (child, i) => {
        const isIgnore = React.isValidElement(child) && (child as React.ReactElement<any>).props?.["data-ignore-scroller"] === "true";
        return (
          <section
            className={`relative w-full ${isIgnore ? "gsap-ignore" : "gsap-scroll-section"} ${i > 0 ? "bg-[#05070d]" : ""}`}
            style={{ zIndex: i + 1 }}
          >
            <div className={`relative w-full ${isIgnore ? "" : "gsap-scroll-inner"}`}>
              {child}
            </div>
          </section>
        );
      })}
    </div>
  );
}
