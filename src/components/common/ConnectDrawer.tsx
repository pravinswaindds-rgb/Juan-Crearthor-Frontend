"use client";

import Image from "next/image";
import { useEffect, useState, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

export interface ConnectDrawerContactField {
  label?: string;
  value: string;
}

export interface ConnectDrawerSocialItem {
  id?: number;
  platform: string;
  url: string;
  isActive?: boolean | null;
}

export interface ConnectDrawerData {
  eyebrow?: string;
  title?: string;
  description?: string;
  phone?: ConnectDrawerContactField;
  email?: ConnectDrawerContactField;
  address?: ConnectDrawerContactField;
  socialTitle?: string;
  socials?: ConnectDrawerSocialItem[];
}

export interface ConnectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl?: string;
  data?: ConnectDrawerData;
}

interface SocialConfig {
  name: string;
  bg: string;
  svg: ReactNode;
}

const getSocialConfig = (platformName: string): SocialConfig => {
  const norm = platformName.toLowerCase().trim();

  switch (norm) {
    case "youtube":
      return {
        name: "Youtube",
        bg: "bg-[#FF0000]",
        svg: (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        ),
      };
    case "facebook":
      return {
        name: "Facebook",
        bg: "bg-[#1877F2]",
        svg: (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        ),
      };
    case "instagram":
      return {
        name: "Instagram",
        bg: "bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4]",
        svg: (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        ),
      };
    case "tiktok":
      return {
        name: "Tiktok",
        bg: "bg-black",
        svg: (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        ),
      };
    case "linkedin":
      return {
        name: "Linkedin",
        bg: "bg-[#0A66C2]",
        svg: (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        ),
      };
    case "x":
    case "twitter":
      return {
        name: "X",
        bg: "bg-black",
        svg: (
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        ),
      };
    case "snapchat":
      return {
        name: "Snapchat",
        bg: "bg-[#FFFC00]",
        svg: (
          <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
            <path d="M12.001 2.002c-4.14 0-6.75 3.036-6.75 5.753 0 1.25.5 2.5 1 3.25.125.188.063.438-.125.563-.563.375-1.688 1.125-2.063 2.125-.313.875.188 1.625.875 1.875.5.188 1.125.188 1.688.063.25-.063.438.063.5.313.25 1 .875 1.625 2.188 1.875.688.125 1.375.063 2.063.313.563.188 1 .688 1.688.688.688 0 1.125-.5 1.688-.688.688-.25 1.375-.188 2.063-.313 1.313-.25 1.938-.875 2.188-1.875.063-.25.25-.375.5-.313.563.125 1.188.125 1.688-.063.688-.25 1.188-1 .875-1.875-.375-1-1.5-1.75-2.063-2.125-.188-.125-.25-.375-.125-.563.5-.75 1-2 1-3.25 0-2.717-2.61-5.753-6.75-5.753z" />
          </svg>
        ),
      };
    default:
      return {
        name: platformName,
        bg: "bg-[#0d1627] border border-cyan-400/30",
        svg: (
          <svg className="w-5 h-5 stroke-white fill-none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" strokeWidth="2" />
          </svg>
        ),
      };
  }
};

const fallbackSocials: ConnectDrawerSocialItem[] = [
  { platform: "Youtube", url: "https://www.youtube.com/" },
  { platform: "Facebook", url: "https://www.facebook.com/crearthorthelegacy/" },
  { platform: "Instagram", url: "https://www.instagram.com/crearthorthelegacy/" },
  { platform: "Tiktok", url: "https://www.tiktok.com/@crearthorthelegacy/" },
  { platform: "Linkedin", url: "https://www.linkedin.com/company/crearthorthelegacy/" },
  { platform: "X", url: "https://x.com/crearthor" },
  { platform: "Snapchat", url: "https://www.snapchat.com/" },
];

export default function ConnectDrawer({
  isOpen,
  onClose,
  logoUrl = "/images/logo.png",
  data,
}: ConnectDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key press, prevent body/html scroll, and stop Lenis while drawer is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Prevent background scrolling while allowing smooth scrolling inside the drawer
    const handleWheel = (e: WheelEvent) => {
      if (drawerRef.current && drawerRef.current.contains(e.target as Node)) {
        return; // Allow native scrolling inside drawer
      }
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (drawerRef.current && drawerRef.current.contains(e.target as Node)) {
        return; // Allow native scrolling inside drawer
      }
      e.preventDefault();
      e.stopPropagation();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });

      // Lock document root and body
      document.documentElement.classList.add("drawer-open");
      document.body.classList.add("drawer-open");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }
    } else {
      document.documentElement.classList.remove("drawer-open");
      document.body.classList.remove("drawer-open");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";

      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);

      document.documentElement.classList.remove("drawer-open");
      document.body.classList.remove("drawer-open");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";

      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  // Resolve values from Strapi data or fallback
  const eyebrow = data?.eyebrow || "Drop Us a Line";
  const title = data?.title || "Connect with Crearthor";
  const description =
    data?.description ||
    "Ready to take the first step towards unlocking opportunities, realizing goals, and embracing innovation?";

  const phoneLabel = data?.phone?.label || "To More Inquiry";
  const phoneValue = data?.phone?.value || "(717) 441-5788";

  const emailLabel = data?.email?.label || "To Send Mail";
  const emailValue = data?.email?.value || "info@crearthor.com";

  const addressLabel = data?.address?.label || "Office Address 01";
  const addressValue = data?.address?.value || "1525 Cedar Cliff Dr, Suite 101, Camp Hill, PA 17011";

  const socialTitle = data?.socialTitle || "Social Just You Connected Us!";

  const activeSocials =
    data?.socials && data.socials.length > 0
      ? data.socials.filter((s) => s.isActive !== false)
      : fallbackSocials;

  const formatAddress = (addr: string): string[] => {
    if (!addr) return [];
    if (addr.includes("\n")) {
      return addr.split("\n").map((l) => l.trim()).filter(Boolean);
    }
    const parts = addr.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 3) {
      // Group street & suite on first line, city, state zip on second line
      const line1 = parts.slice(0, 2).join(", ");
      const line2 = parts.slice(2).join(", ");
      return [line1, line2];
    }
    return [addr];
  };

  const addressLines = formatAddress(addressValue);

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden transition-visibility duration-300 ${isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
    >
      {/* Dark backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer with Home Screen Themed Background */}
      <aside
        ref={drawerRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 bottom-0 z-[10000] w-full max-w-[420px] sm:max-w-[450px] bg-[#05070d] text-white border-l border-[rgba(83,234,253,0.18)] shadow-[-25px_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-y-auto overflow-x-hidden overscroll-contain drawer-scrollbar transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Connect with Crearthor"
      >
        {/* Subtle Background Grid overlay matching home screen */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
            backgroundSize: "49px 49px",
          }}
        />

        {/* Ambient Radial Glows matching home screen */}
        <div className="absolute -top-16 -right-16 w-[280px] h-[280px] bg-[rgba(83,234,253,0.12)] filter blur-[90px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-[240px] h-[240px] bg-[rgba(217,70,239,0.08)] filter blur-[90px] pointer-events-none rounded-full" />

        {/* Ambient twinkling particle dots */}
        <div className="absolute top-[18%] left-[12%] w-[3px] h-[3px] rounded-full bg-[rgba(162,244,253,0.7)] shadow-[0_0_4px_rgba(34,211,238,0.9)] animate-twinkle pointer-events-none" />
        <div className="absolute top-[42%] right-[15%] w-[3px] h-[3px] rounded-full bg-[rgba(162,244,253,0.7)] shadow-[0_0_4px_rgba(34,211,238,0.9)] animate-twinkle pointer-events-none [animation-delay:1.2s]" />
        <div className="absolute top-[68%] left-[20%] w-[3px] h-[3px] rounded-full bg-[rgba(162,244,253,0.7)] shadow-[0_0_4px_rgba(34,211,238,0.9)] animate-twinkle pointer-events-none [animation-delay:2.1s]" />
        <div className="absolute top-[88%] right-[22%] w-[3px] h-[3px] rounded-full bg-[rgba(162,244,253,0.7)] shadow-[0_0_4px_rgba(34,211,238,0.9)] animate-twinkle pointer-events-none [animation-delay:0.7s]" />

        {/* Sticky Header Row: Logo & Close Button */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-7 sm:px-9 pt-7 pb-5 backdrop-blur-sm border-b border-white/[0.08] shrink-0">
          <Image
            src={logoUrl}
            alt="Crearthor"
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-[rgba(83,234,253,0.4)] hover:bg-[rgba(83,234,253,0.08)] flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable Inner Content */}
        <div className="relative z-10 px-7 sm:px-9 py-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Heading Section */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#22d3ee]">
                <span>✳</span>
                <span>{eyebrow}</span>
                <span>✳</span>
              </div>
              <h3 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-tight mt-2 font-[family-name:var(--font-dm-sans)]">
                {title}
              </h3>
              <p className="text-[13px] sm:text-sm text-zinc-400 leading-relaxed mt-2.5">
                {description}
              </p>
            </div>

            {/* Contact Details List */}
            <div className="mt-8 space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.22)] flex items-center justify-center shrink-0 text-[#53eafd] group-hover:bg-[rgba(34,211,238,0.16)] group-hover:border-[rgba(34,211,238,0.5)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all shadow-sm">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    <path d="M14 3a8 8 0 0 1 7 7" />
                    <path d="M14 7a4 4 0 0 1 3 3" />
                  </svg>
                </div>
                <div className="pt-0.5 flex-1 min-w-0">
                  <span className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    {phoneLabel}
                  </span>
                  <a
                    href={`tel:${phoneValue.replace(/[^0-9+]/g, "")}`}
                    className="text-[15px] font-semibold text-white group-hover:text-[#53eafd] transition-colors mt-0.5 block truncate"
                  >
                    {phoneValue}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.22)] flex items-center justify-center shrink-0 text-[#53eafd] group-hover:bg-[rgba(34,211,238,0.16)] group-hover:border-[rgba(34,211,238,0.5)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all shadow-sm">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </div>
                <div className="pt-0.5 flex-1 min-w-0">
                  <span className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    {emailLabel}
                  </span>
                  <a
                    href={`mailto:${emailValue}`}
                    className="text-[15px] font-semibold text-white group-hover:text-[#53eafd] transition-colors mt-0.5 block truncate"
                  >
                    {emailValue}
                  </a>
                </div>
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.22)] flex items-center justify-center shrink-0 text-[#53eafd] group-hover:bg-[rgba(34,211,238,0.16)] group-hover:border-[rgba(34,211,238,0.5)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all shadow-sm">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                    <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
                    <path d="M10 6h4" />
                    <path d="M10 10h4" />
                    <path d="M10 14h4" />
                    <path d="M10 18h4" />
                  </svg>
                </div>
                <div className="pt-0.5 flex-1 min-w-0">
                  <span className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    {addressLabel}
                  </span>
                  <div className="text-[14px] font-medium text-zinc-200 leading-snug mt-1">
                    {addressLines.map((line, idx) => (
                      <p key={idx} className="break-words">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="mt-10 pt-6 border-t border-white/[0.08]">
            <h4 className="text-[13px] font-bold text-zinc-200 mb-4 font-[family-name:var(--font-dm-sans)]">
              {socialTitle}
            </h4>
            <div className="grid grid-cols-5 gap-y-5 gap-x-2">
              {activeSocials.map((social, idx) => {
                const config = getSocialConfig(social.platform);
                return (
                  <a
                    key={`${social.platform}-${idx}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 group"
                    title={config.name}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${config.bg} ${config.name === "Tiktok" || config.name === "X"
                        ? "border border-white/15"
                        : ""
                        } flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300`}
                    >
                      {config.svg}
                    </div>
                    <span className="text-[11px] font-medium text-zinc-400 group-hover:text-white transition-colors truncate max-w-[64px] text-center">
                      {config.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
}
