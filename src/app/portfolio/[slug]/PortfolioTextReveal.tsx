"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioTextReveal() {
  useEffect(() => {
    let splits: SplitType[] = [];
    let triggers: ScrollTrigger[] = [];

    const init = () => {
      gsap.set(".split", { opacity: 1 });

      const containers = gsap.utils.toArray<HTMLElement>(".container");

      containers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const absoluteTop = rect.top + scrollY;
        // If the element is in the upper section visible on page load (above the fold)
        const isAboveTheFold = absoluteTop < (window.innerHeight || 800);

        // Animate bullet points if present inside container
        const bullet = container.querySelector<HTMLElement>(".feature-bullet");
        if (bullet && !bullet.classList.contains("bullet-applied")) {
          bullet.classList.add("bullet-applied");
          if (isAboveTheFold) {
            gsap.fromTo(
              bullet,
              { opacity: 0, scale: 0, yPercent: 120 },
              {
                opacity: 1,
                scale: 1,
                yPercent: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.1,
              }
            );
          } else {
            const bulletAnim = gsap.from(bullet, {
              opacity: 0,
              scale: 0,
              yPercent: 120,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                scrub: true,
                start: "clamp(top center)",
                end: "clamp(bottom center)",
              },
            });
            if (bulletAnim.scrollTrigger) {
              triggers.push(bulletAnim.scrollTrigger);
            }
          }
        }

        const textElements = container.querySelectorAll<HTMLElement>(".split");

        textElements.forEach((text) => {
          if (!text.textContent?.trim()) return;
          if (text.classList.contains("split-applied")) return;
          text.classList.add("split-applied");

          const split = new SplitType(text, {
            types: "words,lines",
            lineClass: "line",
          });
          splits.push(split);

          if (split.lines && split.lines.length > 0) {
            // Emulate mask: "lines" with overflow: hidden wrappers
            split.lines.forEach((line) => {
              const wrapper = document.createElement("div");
              wrapper.style.overflow = "hidden";
              wrapper.style.display = "block";
              line.parentNode?.insertBefore(wrapper, line);
              wrapper.appendChild(line);

              // Support text gradients if applicable
              if (text.classList.contains("gradient-text") || text.closest(".gradient-text")) {
                line.style.backgroundImage =
                  "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)";
                line.style.webkitBackgroundClip = "text";
                line.style.webkitTextFillColor = "transparent";
                line.style.backgroundClip = "text";
              }
            });

            if (isAboveTheFold) {
              // Reveal smoothly on page load so the section is never empty
              gsap.fromTo(
                split.lines,
                { yPercent: 120 },
                {
                  yPercent: 0,
                  duration: 0.9,
                  stagger: 0.08,
                  ease: "power3.out",
                  delay: 0.1,
                }
              );
            } else {
              // Below-the-fold sections scrub as user scrolls into center
              const anim = gsap.from(split.lines, {
                yPercent: 120,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: {
                  trigger: container,
                  scrub: true,
                  start: "clamp(top center)",
                  end: "clamp(bottom center)",
                },
              });

              if (anim.scrollTrigger) {
                triggers.push(anim.scrollTrigger);
              }
            }
          }
        });
      });

      ScrollTrigger.refresh();
    };

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(init, 100);
      });
    } else {
      setTimeout(init, 100);
    }

    return () => {
      triggers.forEach((t) => t.kill());
      splits.forEach((s) => s.revert());
    };
  }, []);

  return null;
}
