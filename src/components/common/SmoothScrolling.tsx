"use client";

import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function LenisSync() {
  useLenis((lenis) => {
    if (lenis && (window as any).__lenis !== lenis) {
      (window as any).__lenis = lenis;
    }
  });
  return null;
}

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  useEffect(() => {
    // We can't guarantee lenis is populated on mount immediately without checking
    const onScroll = () => {
      ScrollTrigger.update();
    };

    const onRefresh = () => {
      lenisRef.current?.lenis?.resize();
    };

    // Bind lenis scroll directly to scrolltrigger update
    if (lenisRef.current?.lenis) {
      (window as any).__lenis = lenisRef.current.lenis;
      lenisRef.current.lenis.on("scroll", onScroll);
    }

    // Crucially, whenever ScrollTrigger recalculates (adds/removes pin spacers), Lenis MUST resize to know the new maxScroll
    ScrollTrigger.addEventListener("refresh", onRefresh);

    return () => {
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.off("scroll", onScroll);
      }
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, []);

  useEffect(() => {
    const handleHashScroll = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash;
        const target = document.querySelector(hash);
        if (target && lenisRef.current?.lenis) {
          lenisRef.current.lenis.scrollTo(target, { offset: -80 });
          return true;
        }
      }
      return false;
    };

    if (!handleHashScroll()) {
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.scrollTo(0, { immediate: true });
      }
    }

    // Increase delay slightly to ensure Next.js has fully rendered the new page's DOM
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
      lenisRef.current?.lenis?.resize();
      handleHashScroll();
    }, 250);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (

    <ReactLenis root ref={lenisRef} autoRaf={false}>
      <LenisSync />
      {children}
    </ReactLenis>
  );
}
