"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function NavigationLoader({ isPending }: { isPending: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressObj = useRef({ value: 0 });

  useEffect(() => {
    if (isPending && !isVisible) {
      setIsVisible(true);
    }
  }, [isPending, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Lock scrolling
    document.documentElement.classList.add("loader-locked");
    document.body.classList.add("loader-locked");

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    const unlock = () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.documentElement.classList.remove("loader-locked");
      document.body.classList.remove("loader-locked");
    };

    const ctx = gsap.context(() => {
      if (isPending) {
        // Start loading animation up to 90%
        progressObj.current.value = 0;
        gsap.set(".loader-content", { opacity: 0, y: 20, scale: 0.96 });
        gsap.set(".loader-col", { yPercent: 0 });
        gsap.set(progressBarRef.current, { width: "0%" });

        const tl = gsap.timeline();
        timelineRef.current = tl;

        tl.to(".loader-content", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });

        tl.to(
          progressObj.current,
          {
            value: 90,
            duration: 6,
            ease: "power4.out",
            onUpdate: () => {
              const val = Math.floor(progressObj.current.value);
              if (counterRef.current) counterRef.current.textContent = `${val < 10 ? "0" + val : val}%`;
              if (progressBarRef.current) progressBarRef.current.style.width = `${val}%`;
            },
          },
          "-=0.2"
        );
      } else {
        // Complete the animation to 100% and exit
        if (timelineRef.current) {
          timelineRef.current.kill(); // stop the 90% animation
        }

        const tl = gsap.timeline({
          onComplete: () => {
            unlock();
            setIsVisible(false);
          },
        });

        // Fast forward to 100%
        tl.to(progressObj.current, {
          value: 100,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: () => {
            const val = Math.floor(progressObj.current.value);
            if (counterRef.current) counterRef.current.textContent = `${val < 10 ? "0" + val : val}%`;
            if (progressBarRef.current) progressBarRef.current.style.width = `${val}%`;
          },
        });

        tl.to({}, { duration: 0.15 });

        tl.to([".loader-content", progressBarRef.current], {
          opacity: 0,
          y: -35,
          scale: 0.95,
          duration: 0.45,
          ease: "power3.in",
        });

        tl.to(
          ".loader-col",
          {
            yPercent: -100,
            duration: 0.85,
            stagger: 0.06,
            ease: "power4.inOut",
          },
          "-=0.15"
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
      if (!isPending) unlock();
    };
  }, [isPending, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      aria-label="Loading page"
      className="fixed inset-0 z-[9999] w-screen h-screen pointer-events-auto select-none overflow-hidden bg-transparent"
    >
      <div className="absolute inset-0 flex pointer-events-none w-full h-full">
        <div className="loader-col flex-1 bg-[#05070d] border-r border-white/[0.03] h-full will-change-transform scale-x-[1.01]" />
        <div className="loader-col flex-1 bg-[#05070d] border-r border-white/[0.03] h-full will-change-transform scale-x-[1.01]" />
        <div className="loader-col flex-1 bg-[#05070d] border-r border-white/[0.03] h-full will-change-transform scale-x-[1.01]" />
        <div className="loader-col flex-1 bg-[#05070d] border-r border-white/[0.03] h-full will-change-transform scale-x-[1.01]" />
        <div className="loader-col flex-1 bg-[#05070d] h-full will-change-transform scale-x-[1.01]" />
      </div>

      <div className="loader-content relative z-20 w-full h-full flex flex-col items-center justify-center px-6 pointer-events-none">
        <div className="absolute w-[440px] h-[440px] bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
        <div className="flex items-center justify-center">
          <span
            ref={counterRef}
            className="block text-[72px] sm:text-[104px] font-[family-name:var(--font-anton)] tracking-tight leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            00%
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 h-1 sm:h-4 z-30 pointer-events-none overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}
