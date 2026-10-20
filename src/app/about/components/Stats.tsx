"use client";

import type { StrapiAboutStatistic } from "@/types/strapi";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const defaultStats = [
  { value: "200+", label: "Happy Clients" },
  { value: "150+", label: "Projects Delivered" },
  { value: "10+", label: "Years of Experience" },
  { value: "12+", label: "Countries Served" },
];

export default function Stats({ data }: { data?: StrapiAboutStatistic[] }) {
  const statsToRender = data && data.length > 0 ? data : defaultStats;
  const sectionRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(() => {
    numRefs.current.forEach((el, index) => {
      if (!el) return;
      const targetValue = parseFloat(el.getAttribute("data-target") || "0");
      const obj = { val: 0 };
      
      gsap.to(obj, {
        val: targetValue,
        duration: 2,
        ease: "power2.out",
        delay: index * 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        onUpdate: () => {
          el.innerText = Math.round(obj.val).toString();
        }
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 w-full relative no-global-reveal">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#53EAFD]/0 via-[#53EAFD]/40 to-[#53EAFD]/0"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#53EAFD]/0 via-[#53EAFD]/40 to-[#53EAFD]/0"></div>
      {/* Optional faint glow or background if needed, keeping it transparent for now */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsToRender.map((stat, index) => {
            const stringValue = String(stat.value);
            const numericMatch = stringValue.match(/[\d.]+/);
            const numericPart = numericMatch ? numericMatch[0] : "0";
            let suffixPart = stringValue.replace(/[\d.]+/g, '');
            
            // If the original string had no suffix, append a + to preserve the previous visual behavior.
            if (!suffixPart) {
              suffixPart = "+";
            } else if (suffixPart === "++") {
              suffixPart = "+";
            }

            return (
              <div key={stat.label} className="text-center">
                <p className="font-(family-name:--font-anton) text-[40px] gradient-text mb-2">
                  <span 
                    ref={(el) => {
                      if (el) numRefs.current[index] = el;
                    }} 
                    data-target={numericPart}
                  >
                    0
                  </span>
                  <span>{suffixPart}</span>
                </p>
                <p className="text-[#22D3EE] text-[14px] sm:text-[16px] leading-6 tracking-[0%]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
