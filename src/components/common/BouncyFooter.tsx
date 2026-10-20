"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Normalized to have matching exact structure for GSAP string interpolation
const down = "M0,-0.3 C0,-0.3,464,156,1139,156 S2278,-0.3,2278,-0.3 V683 H0 V-0.3 z";
const center = "M0,-0.3 C0,-0.3,464,0,1139,0 S2278,-0.3,2278,-0.3 V683 H0 V-0.3 z";

export default function BouncyFooter() {
  const container = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: container.current,
      start: "top bottom",
      onEnter: (self) => {
        const velocity = self.getVelocity();
        // Limit variation so it doesn't break if you scroll incredibly fast
        const variation = Math.min(Math.max(velocity / 10000, 0), 0.5);

        gsap.fromTo(pathRef.current, {
          attr: { d: down }
        }, {
          duration: 2, 
          attr: { d: center },
          ease: `elastic.out(${1 + variation}, ${1 - variation})`, 
          overwrite: true
        });
      }
    });
  }, { scope: container });

  return (
    <div ref={container} className="absolute left-0 right-0 w-full top-0 -translate-y-full z-0 overflow-hidden pointer-events-none" style={{ height: "15vw" }}>
      <svg 
        preserveAspectRatio="none" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 2278 156"
        className="w-full h-full"
      >
        <path 
          ref={pathRef}
          className="footer-svg" 
          fill="#05070d" 
          d={center}
        />
      </svg>
    </div>
  );
}
