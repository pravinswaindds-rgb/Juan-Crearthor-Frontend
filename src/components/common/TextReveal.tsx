"use client";

import React, { useRef, ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export const TextReveal = ({ children, as: Tag = "div", className = "", style }: TextRevealProps) => {
  const textRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    let split: SplitType | null = null;
    let st: ScrollTrigger | null = null;
    
    document.fonts.ready.then(() => {
      // Small timeout to ensure Next.js has fully rendered the DOM node and styles
      setTimeout(() => {
        if (!textRef.current) return;
        
        split = new SplitType(textRef.current, { types: 'lines,words', lineClass: 'split-line' });
        
        if (split.lines) {
          split.lines.forEach((line) => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.display = 'block';
            wrapper.className = 'split-line-wrapper';
            
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });

          // GSAP animation from yPercent 120 (hidden below mask)
          gsap.from(split.lines, {
            yPercent: 120,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: textRef.current,
              scrub: true,
              start: "clamp(top 90%)",
              end: "clamp(bottom 60%)",
            }
          });
        }
      }, 50);
    });

    return () => {
      if (split) {
        split.revert();
      }
    };
  }, { scope: textRef });

  return (
    <Tag ref={textRef} className={`will-change-transform ${className}`} style={style}>
      {children}
    </Tag>
  );
};
