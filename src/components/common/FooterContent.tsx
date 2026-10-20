"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const specialLinks = [
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Login", href: "#" },
];

const services = [
  "Strategy Deployment",
  "Complex Sales Strategies",
  "AI Resources",
  "Software & Hardware",
  "Smart POS",
];

export interface SocialLinkItem {
  label: string;
  href: string;
  icon?: string;
}

const defaultSocialIcons: SocialLinkItem[] = [
  { label: "YouTube", href: "https://www.youtube.com/", icon: "/icons/youtube.svg" },
  { label: "Facebook", href: "https://www.facebook.com/crearthorthelegacy/", icon: "/icons/facebook.svg" },
  { label: "Instagram", href: "https://www.instagram.com/crearthorthelegacy/", icon: "/icons/instagram.svg" },
  { label: "TikTok", href: "https://www.tiktok.com/@crearthorthelegacy/", icon: "/icons/music.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/crearthorthelegacy/", icon: "/icons/linkdin.svg" },
  { label: "X", href: "https://x.com/crearthor", icon: "/icons/twitter.svg" },
  { label: "Snapchat", href: "https://www.snapchat.com/", icon: "/icons/snapchat.svg" },
];

export interface FooterContentProps {
  socialLinks?: SocialLinkItem[];
  description?: string;
  copyrightText?: string;
}

export default function FooterContent({
  socialLinks,
  description,
  copyrightText,
}: FooterContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const socialList = socialLinks && socialLinks.length > 0 ? socialLinks : defaultSocialIcons;

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Check on mount if user already subscribed in this browser
  useEffect(() => {
    try {
      const stored = localStorage.getItem("crearthor_newsletter_subscribed");
      const storedEmail = localStorage.getItem("crearthor_newsletter_email");
      if (stored === "true") {
        setIsSubscribed(true);
        if (storedEmail) setSavedEmail(storedEmail);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSubscribed) return;

    const trimmed = newsletterEmail.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFeedback({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/app-api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubscribed(true);
        setSavedEmail(trimmed);
        setNewsletterEmail("");
        try {
          localStorage.setItem("crearthor_newsletter_subscribed", "true");
          localStorage.setItem("crearthor_newsletter_email", trimmed);
        } catch {
          // ignore
        }

        setFeedback({
          type: "success",
          message: data.message || "Thank you for subscribing!",
        });
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Failed to subscribe. Please try again.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Network error. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(
    () => {
      let isMounted = true;
      let splitInstances: SplitType[] = [];

      const init = () => {
        if (!isMounted || !containerRef.current) return;

        const splitElements = containerRef.current.querySelectorAll(".split");
        if (!splitElements || splitElements.length === 0) return;

        gsap.set(splitElements, { opacity: 1 });

        const allLines: HTMLElement[] = [];

        splitElements.forEach((el) => {
          const text = new SplitType(el as HTMLElement, {
            types: "words,lines",
            lineClass: "line",
          });
          splitInstances.push(text);

          text.lines?.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.style.overflow = "hidden";
            wrapper.style.display = "block";
            
            // Fix for descenders being clipped by overflow:hidden
            line.style.paddingBottom = "0.2em";
            wrapper.style.marginBottom = "-0.2em";

            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);

            allLines.push(line);
          });
        });

        const logo = containerRef.current.querySelector(".footer-logo");
        const newsletterBox = containerRef.current.querySelector(".footer-newsletter");
        const socials = containerRef.current.querySelector(".footer-socials");

        if (allLines.length > 0) {
          gsap.fromTo(
            allLines,
            { yPercent: 120 },
            {
              yPercent: 0,
              stagger: 0.03,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                scrub: true,
                start: "clamp(top 95%)",
                end: "clamp(bottom 75%)",
              },
            }
          );
        }

        const extras = [logo, newsletterBox, socials].filter(Boolean);
        if (extras.length > 0) {
          gsap.fromTo(
            extras,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.8,
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
        document.fonts.ready.then(() => {
          if (!isMounted || !containerRef.current) return;
          init();
          try {
            ScrollTrigger?.refresh?.();
          } catch {
            // Ignore
          }
        });
      } else {
        init();
        try {
          ScrollTrigger?.refresh?.();
        } catch {
          // Ignore
        }
      }

      return () => {
        isMounted = false;
        splitInstances.forEach((t) => t.revert());
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative z-10 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-14">
        {/* Logo & Description */}
        <div className="lg:col-span-4">
          <Link href="/" className="footer-logo inline-flex items-center gap-2 mb-4">
            <Image
              src="/images/logo.png"
              alt="Crearthor"
              width={158}
              height={40}
              className="h-[40px] w-auto"
              priority
            />
          </Link>
          <p
            className="mt-4 split"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              lineHeight: "24px",
              letterSpacing: "-0.02em",
              color: "#5e6670",
              maxWidth: "316px",
            }}
          >
            {description ||
              "Crearthor builds software, AI products, infrastructure strategies, and gaming-adjacent digital ecosystems for ambitious teams."}
          </p>
        </div>

        {/* Special Links */}
        <div className="lg:col-span-2">
          <h4
            className="mb-4 split"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "18px",
              color: "#ffffff",
            }}
          >
            Special Links
          </h4>
          <ul className="space-y-3">
            {specialLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-[#a2f4fd] transition-colors inline-block split"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Services */}
        <div className="lg:col-span-2">
          <h4
            className="mb-4 split"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "18px",
              color: "#ffffff",
            }}
          >
            Our Services
          </h4>
          <ul className="space-y-3">
            {services.map((service) => (
              <li key={service}>
                <Link
                  href="/services"
                  className="hover:text-[#a2f4fd] transition-colors inline-block split"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="sm:col-span-2 lg:col-span-4">
          <h4
            className="mb-4 split"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "18px",
              color: "#ffffff",
            }}
          >
            Subscribe to our newsletter
          </h4>
          {isSubscribed ? (
            <div
              className="footer-newsletter flex items-center justify-between px-5 py-3 rounded-full transition-all duration-300 border border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400 text-black text-xs font-bold shrink-0">
                  ✓
                </span>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold text-emerald-300">
                    Subscribed to newsletter
                  </span>
                  {savedEmail && (
                    <span className="text-[11px] text-white/60 truncate max-w-[200px]">
                      {savedEmail}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-medium text-emerald-400 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 shrink-0">
                Active
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="footer-newsletter flex items-center rounded-full overflow-hidden transition-[border-color,box-shadow] duration-300 focus-within:border-[rgba(83,234,253,0.4)] focus-within:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.102)",
              }}
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Email address"
                disabled={isSubmitting}
                required
                className="flex-1 h-[54px] px-4 sm:px-6 outline-none bg-transparent min-w-0"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="shrink-0 mr-1 sm:mr-2 px-4 sm:px-6 h-[42px] rounded-full flex items-center justify-center transition-[background-color,border-color,box-shadow,color,transform] duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#05070d",
                  background: "#a2f4fd",
                  border: "1px solid rgba(83,234,253,0.4)",
                  boxShadow: "0 0 30px rgba(34,211,238,0.25)",
                }}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}

          {/* Feedback message */}
          {feedback && (
            <p
              className={`mt-2 text-xs font-medium transition-all ${
                feedback.type === "success" ? "text-emerald-300" : "text-rose-400"
              }`}
            >
              {feedback.message}
            </p>
          )}
          {/* Social icons */}
          <div className="footer-socials flex items-center gap-3 mt-5 flex-wrap">
            {socialList.map((icon, index) => (
              <a
                key={`${icon.label}-${index}`}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 hover:scale-110 transition-all inline-flex items-center justify-center w-[22px] h-[22px]"
                aria-label={icon.label}
                title={icon.label}
              >
                <Image
                  src={icon.icon || "/icons/linkdin.svg"}
                  alt={icon.label}
                  width={18}
                  height={18}
                  className="brightness-0 invert object-contain max-h-[18px] max-w-[18px]"
                  unoptimized
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="pt-6"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p
          className="text-center split"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: "12px",
            letterSpacing: "2px",
            color: "rgba(162,244,253,0.7)",
          }}
        >
          {copyrightText || "Copyright © 2026, Crearthor LLC. All Rights Reserved"}
        </p>
      </div>
    </div>
  );
}
