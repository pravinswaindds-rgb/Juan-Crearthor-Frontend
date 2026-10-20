"use client";

import Link from "next/link";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type ButtonVariant = "primary" | "secondary" | "outline" | "gradient" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan text-[#05070d] hover:bg-cyan-light shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]",
  secondary:
    "bg-cyan-light text-[#05070d] border border-cyan/40 shadow-[0_0_50px_rgba(34,211,238,0.2)] hover:shadow-[0_0_50px_rgba(34,211,238,0.4)]",
  outline:
    "text-white border border-white/20 hover:border-cyan/50 hover:text-cyan",
  gradient:
    "gradient-btn text-[#05070d] shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]",
  ghost:
    "text-white/70 hover:text-cyan",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-7 py-3 text-sm",
  lg: "px-7 py-3.5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-semibold transition-[background-color,border-color,box-shadow,color] duration-300 cursor-pointer will-change-transform";
  const classes = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buttonRef = useRef<any>(null);

  useGSAP(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    gsap.set(btn, { transformPerspective: 400, transformStyle: "preserve-3d" });

    const tiltRX = gsap.quickTo(btn, "rotationX", { ease: "power3" });
    const tiltRY = gsap.quickTo(btn, "rotationY", { ease: "power3" });
    
    const inner = btn.querySelector('.btn-inner');
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
  }, { scope: buttonRef });

  const innerContent = (
    <span className="btn-inner inline-flex items-center justify-center pointer-events-none will-change-transform">
      {children}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={classes} ref={buttonRef}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button className={classes} {...props} ref={buttonRef}>
      {innerContent}
    </button>
  );
}
