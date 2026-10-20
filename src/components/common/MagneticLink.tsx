"use client";

import Link from "next/link";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function MagneticLink({
  href,
  target,
  className = "",
  style,
  onClick,
  children,
}: {
  href: string;
  target?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const btn = linkRef.current;
    if (!btn) return;

    gsap.set(btn, { transformPerspective: 400, transformStyle: "preserve-3d" });

    const tiltRX = gsap.quickTo(btn, "rotationX", { ease: "power3" });
    const tiltRY = gsap.quickTo(btn, "rotationY", { ease: "power3" });

    const inner = btn.querySelector(".magnetic-inner");
    if (inner) {
      gsap.set(inner, { transformStyle: "preserve-3d" });
    }
    const innerX = inner ? gsap.quickTo(inner, "x", { ease: "power3" }) : () => {};
    const innerY = inner ? gsap.quickTo(inner, "y", { ease: "power3" }) : () => {};

    const onPointerMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      tiltRX(gsap.utils.interpolate(15, -15, y));
      tiltRY(gsap.utils.interpolate(-15, 15, x));

      if (inner) {
        innerX(gsap.utils.interpolate(-6, 6, x));
        innerY(gsap.utils.interpolate(-6, 6, y));
      }
    };

    const onPointerLeave = () => {
      tiltRX(0);
      tiltRY(0);
      if (inner) {
        innerX(0);
        innerY(0);
      }
    };

    btn.addEventListener("pointermove", onPointerMove);
    btn.addEventListener("pointerleave", onPointerLeave);

    return () => {
      btn.removeEventListener("pointermove", onPointerMove);
      btn.removeEventListener("pointerleave", onPointerLeave);
    };
  }, { scope: linkRef });

  return (
    <Link
      href={href}
      target={target}
      onClick={onClick}
      className={`${className} will-change-transform`}
      style={style}
      ref={linkRef}
    >
      <span className="magnetic-inner inline-flex items-center justify-center pointer-events-none will-change-transform">
        {children}
      </span>
    </Link>
  );
}
