"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectDrawer from "./ConnectDrawer";

interface NavLink {
  label: string;
  href: string;
}

interface CTAData {
  label?: string;
  url?: string;
}

interface HeaderProps {
  navLinks: NavLink[];
  logoUrl?: string;
  ctaData?: CTAData | null;
  drawerData?: any;
}

export default function Header({
  navLinks = [],
  logoUrl = "/images/logo.png",
  ctaData = null,
  drawerData,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const ctaLabel = ctaData?.label || "Get Started";
  const ctaHref = ctaData?.url || "/contact";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#05070d]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1440px] mx-auto h-[70px] flex items-center justify-between px-6 md:px-12 lg:px-[100px]">
        {/* Logo - left */}
        <Link href="/" className="shrink-0 z-10">
          <Image
            src={logoUrl}
            alt="Crearthor"
            width={158}
            height={40}
            className="h-[40px] w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav - center */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-[36px]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[14px] font-medium leading-[18px] tracking-[-0.02em] transition-colors whitespace-nowrap ${
                isActive(link.href)
                  ? "text-[#a2f4fd]"
                  : "text-[#5e6670] hover:text-[#a2f4fd]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Icons - right */}
        <div className="flex items-center gap-[12px] z-10">
          {/* Get Started Button */}
          <Link
            href={ctaHref}
            className="hidden sm:inline-flex items-center justify-center px-[20px] py-[14px] rounded-full text-[14px] font-semibold leading-[18px] text-[#cefafe] bg-[rgba(83,234,253,0.1)] border border-[rgba(83,234,253,0.4)] shadow-[0_0_32px_rgba(34,211,238,0.15)] hover:bg-[rgba(83,234,253,0.18)] hover:shadow-[0_0_40px_rgba(34,211,238,0.25)] hover:border-[rgba(83,234,253,0.6)] transition-all"
          >
            {ctaLabel}
          </Link>

          {/* Grid Icon - Click to open Connect with Crearthor Drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex w-[46px] h-[46px] rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.102)] items-center justify-center text-white/60 hover:text-[#a2f4fd] hover:border-[rgba(83,234,253,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Open connect menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-[46px] h-[46px] rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.102)] flex items-center justify-center text-white/60"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {mobileOpen ? (
                <path d="M4 4L16 16M16 4L4 16" />
              ) : (
                <>
                  <path d="M3 5H17" />
                  <path d="M3 10H17" />
                  <path d="M3 15H17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-[#0a0c14]/95 backdrop-blur-md border-t border-white/5 px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`block py-2 text-[14px] font-medium leading-[18px] tracking-[-0.02em] transition-colors ${
                isActive(link.href)
                  ? "text-[#a2f4fd]"
                  : "text-[#5e6670] hover:text-[#a2f4fd]"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ctaHref}
            className="mt-3 inline-flex items-center justify-center px-[20px] py-[14px] rounded-full text-[14px] font-semibold leading-[18px] text-[#cefafe] bg-[rgba(83,234,253,0.1)] border border-[rgba(83,234,253,0.4)] shadow-[0_0_32px_rgba(34,211,238,0.15)]"
            onClick={() => setMobileOpen(false)}
          >
            {ctaLabel}
          </Link>
        </nav>
      )}
      {/* Slide-out Connect Drawer */}
      <ConnectDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        logoUrl={logoUrl}
        data={drawerData}
      />
    </header>
  );
}
