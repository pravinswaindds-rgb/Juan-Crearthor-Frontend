"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function GlobalTextReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let splits: SplitType[] = [];
    let timeoutId: NodeJS.Timeout;

    const initReveal = () => {
      // Find all headings and paragraphs inside sections
      const textElements = document.querySelectorAll(
        "main section h1, main section h2, main section h3, main section h4, main section p, main section .split-global"
      );

      textElements.forEach((el) => {
        // Skip elements inside Hero or explicitly marked to skip
        if (el.classList.contains('no-global-reveal') || el.closest('.no-global-reveal')) return;
        
        // Skip if already split
        if (el.classList.contains('global-split-applied')) return;
        el.classList.add('global-split-applied');

        // Ignore empty elements or small specific items if needed
        if (!el.textContent?.trim()) return;

        const split = new SplitType(el as HTMLElement, { types: 'lines', lineClass: 'split-line' });
        splits.push(split);
        
        if (split.lines && split.lines.length > 0) {
          split.lines.forEach((line) => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.display = 'block';
            
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
            
            // Fix gradient text inside overflow hidden
            if (el.classList.contains('gradient-text') || el.closest('.gradient-text')) {
              line.style.backgroundImage = "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)";
              line.style.webkitBackgroundClip = "text";
              line.style.webkitTextFillColor = "transparent";
              line.style.backgroundClip = "text";
            }
          });
          
          if (el.classList.contains('gradient-text')) {
              const htmlEl = el as HTMLElement;
              htmlEl.style.background = 'none';
              htmlEl.style.webkitTextFillColor = 'initial';
          }

          gsap.fromTo(split.lines, 
            { yPercent: 120 },
            {
              yPercent: 0,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                scrub: true,
                start: "clamp(top 95%)",
                end: "clamp(bottom 70%)",
              }
            }
          );
        }
      });
      
      // Refresh ScrollTrigger to recalculate positions
      ScrollTrigger.refresh();
    };

    document.fonts.ready.then(() => {
      timeoutId = setTimeout(initReveal, 300);
    });

    return () => {
      clearTimeout(timeoutId);
      splits.forEach(s => s.revert());
    };
  }, [pathname]);

  return null;
}
