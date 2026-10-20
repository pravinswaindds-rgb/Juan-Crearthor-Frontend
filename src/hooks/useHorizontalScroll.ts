"use client";
import { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface UseHorizontalScrollProps {
  /** The outermost container that will be pinned during scroll */
  sectionRef: RefObject<HTMLElement | null>;
  /** The wrapper that determines the visible width/window of the scrolling track */
  wrapperRef: RefObject<HTMLElement | null>;
  /** The inner container with w-max that holds all the horizontal items and actually slides */
  stripRef: RefObject<HTMLElement | null>;
}

/**
 * A custom hook that creates a GSAP horizontal scroll effect.
 * The section is pinned while the user scrolls, pushing the `strip` to the left
 * until its full width has been revealed.
 */
export function useHorizontalScroll({ sectionRef, wrapperRef, stripRef }: UseHorizontalScrollProps) {
  useGSAP(() => {
    const sec = sectionRef.current;
    const wrapper = wrapperRef.current;
    const pinWrap = stripRef.current;
    
    if (!sec || !wrapper || !pinWrap) return;

    let pinWrapWidth: number = 0;
    let horizontalScrollLength: number = 0;

    function refresh() {
      if (!wrapper || !pinWrap) return;
      pinWrapWidth = pinWrap.scrollWidth;
      horizontalScrollLength = pinWrapWidth - wrapper.clientWidth;
    }

    refresh();

    if (horizontalScrollLength > 0) {
      gsap.to(pinWrap, {
        scrollTrigger: {
          scrub: true,
          trigger: sec,
          pin: sec,
          start: "top top",
          end: () => `+=${pinWrapWidth}`,
          invalidateOnRefresh: true
        },
        x: () => -horizontalScrollLength,
        ease: "none"
      });
    }

    ScrollTrigger.addEventListener("refreshInit", refresh);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", refresh);
    };
  }, { scope: sectionRef });
}
