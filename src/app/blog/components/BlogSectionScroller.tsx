"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function BlogSectionScroller({
  children,
}: {
  children: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      var panels = gsap.utils.toArray<HTMLElement>(".section", container.current);
      if (panels.length <= 1) return;
      panels.pop();

      panels.forEach((panel, i) => {
        // Get the element holding the content inside the panel
        let innerpanel = panel.querySelector<HTMLElement>(".section-inner");
        if (!innerpanel) return;

        // Get the Height of the content inside the panel
        let panelHeight = innerpanel.offsetHeight;
        console.log(panelHeight);

        // Get the window height
        let windowHeight = window.innerHeight;

        let difference = panelHeight - windowHeight;

        // ratio (between 0 and 1) representing the portion of the overall animation that's for the fake-scrolling. We know that the scale & fade should happen over the course of 1 windowHeight, so we can figure out the ratio based on how far we must fake-scroll
        let fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

        // if we need to fake scroll (because the panel is taller than the window), add the appropriate amount of margin to the bottom so that the next element comes in at the proper time.
        if (fakeScrollRatio) {
          panel.style.marginBottom = panelHeight * fakeScrollRatio + "px";
        }

        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "bottom bottom",
            end: () => (fakeScrollRatio ? `+=${innerpanel.offsetHeight}` : "bottom top"),
            pinSpacing: false,
            pin: true,
            scrub: true,
          },
        });

        // fake scroll. We use 1 because that's what the rest of the timeline consists of (0.9 scale + 0.1 fade)
        if (fakeScrollRatio) {
          tl.to(innerpanel, {
            yPercent: -100,
            y: window.innerHeight,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: "none",
          });
        }
        tl.fromTo(
          panel,
          { scale: 1, opacity: 1 },
          { scale: 0.7, opacity: 0.5, duration: 0.9 }
        ).to(panel, { opacity: 0, duration: 0.1 });
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="relative w-full">
      {React.Children.map(children, (child, i) => (
        <div
          className={`section relative w-full ${i === 0 ? "min-h-screen" : ""}`}
          style={{ zIndex: i + 1 }}
        >
          <div
            className={`section-inner relative w-full ${
              i === 0 ? "min-h-screen flex flex-col justify-center" : ""
            }`}
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}
