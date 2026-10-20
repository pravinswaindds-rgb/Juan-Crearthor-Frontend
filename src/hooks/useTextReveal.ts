import { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useTextReveal(containerRef: RefObject<HTMLElement | null>, selector: string = ".split") {
  useGSAP(() => {
    let text: SplitType | null = null;

    const init = () => {
      if (!containerRef.current) return;
      const elements = containerRef.current.querySelectorAll(selector);
      if (!elements || elements.length === 0) return;

      gsap.set(elements, { opacity: 1 });

      text = new SplitType(elements as any, { types: "words,lines", lineClass: "line" });

      text.lines?.forEach((line) => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        wrapper.style.display = "block";
        
        // Fix for descenders being clipped by overflow:hidden
        line.style.paddingBottom = "0.2em";
        wrapper.style.marginBottom = "-0.2em";

        line.parentNode?.insertBefore(wrapper, line);
        wrapper.appendChild(line);

        if (line.closest('.gradient-text')) {
          line.style.backgroundImage = "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)";
          line.style.webkitBackgroundClip = "text";
          line.style.webkitTextFillColor = "transparent";
          line.style.backgroundClip = "text";
        }
      });

      const gradientTexts = containerRef.current.querySelectorAll('.gradient-text');
      gradientTexts.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.background = 'none';
        htmlEl.style.webkitTextFillColor = 'initial';
      });

      if (text.lines && text.lines.length > 0) {
        gsap.fromTo(
          text.lines,
          {
            yPercent: 100,
            opacity: 0,
          },
          {
            duration: 1.5,
            yPercent: 0,
            opacity: 1,
            stagger: 0.08,
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
      document.fonts.ready.then(init);
    } else {
      init();
    }

    return () => {
      text?.revert();
    };
  }, { scope: containerRef });
}
