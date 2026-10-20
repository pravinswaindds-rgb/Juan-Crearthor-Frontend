"use client";

import { useState } from "react";
import Link from "next/link";
import StrapiRichText from "@/components/common/StrapiRichText";

function slugifyTag(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface TagItem {
  Label?: string;
  label?: string;
  Title?: string;
  Slug?: string;
  slug?: string;
  Order?: number;
  IsActive?: boolean;
  isActive?: boolean;
  url?: string;
}

export default function KeyFeatures({
  features,
  chips = [],
  projectSlug = "",
  projectTitle = "",
  appUrl = "",
}: {
  features: any;
  chips?: (string | TagItem)[];
  projectSlug?: string;
  projectTitle?: string;
  appUrl?: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!features && (!chips || chips.length === 0)) return null;

  const handleShareApp = async (e: React.MouseEvent, customUrl?: string) => {
    e.preventDefault();
    const shareUrl =
      customUrl ||
      appUrl ||
      (typeof window !== "undefined" ? window.location.href : "");

    const shareData = {
      title: projectTitle || "Check out this app",
      text: `Check out ${projectTitle || "this game"} on Crearthor!`,
      url: shareUrl,
    };

    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed or error
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        window.open(shareUrl, "_blank");
      }
    } else {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-16 no-global-reveal">
      <div className="container mb-6">
        <h2
          className="uppercase tracking-wide"
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "34px",
            lineHeight: "40px",
            color: "#ffffff",
          }}
        >
          Key Features
        </h2>
      </div>

      {/* Render the features using StrapiRichText to preserve formatting */}
      {features && (
        <div className="mb-10">
          <StrapiRichText content={features} />
        </div>
      )}

      {/* Dynamic Project Tag Chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {chips.map((item, index) => {
            const isObject = typeof item === "object" && item !== null;
            const label = isObject
              ? item.Label || item.label || item.Title || "Tag"
              : String(item);

            // If explicitly set to inactive in Strapi, skip
            if (isObject && (item.IsActive === false || item.isActive === false)) {
              return null;
            }

            const rawSlug =
              isObject && (item.Slug || item.slug)
                ? (item.Slug || item.slug)!
                : slugifyTag(label);
            const tagSlug = slugifyTag(rawSlug);

            // 1. Contact tag: directly links to contact page
            if (tagSlug.includes("contact")) {
              return (
                <Link
                  key={`${label}-${index}`}
                  href="/contact"
                  className="inline-flex items-center h-8 rounded-full px-4 border transition-all duration-200 hover:bg-[#a2f4fd]/10 hover:border-[#a2f4fd] hover:scale-105 active:scale-95 cursor-pointer capitalize"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#a2f4fd",
                    background: "transparent",
                    borderColor: "rgba(162, 244, 253, 0.4)",
                  }}
                >
                  {label}
                </Link>
              );
            }

            // 2. Share App tag: triggers share dialog or copies playstore / app URL
            if (tagSlug.includes("share")) {
              const customShareUrl = isObject && item.url ? item.url : undefined;
              return (
                <button
                  key={`${label}-${index}`}
                  type="button"
                  onClick={(e) => handleShareApp(e, customShareUrl)}
                  className="inline-flex items-center h-8 rounded-full px-4 border transition-all duration-200 hover:bg-[#a2f4fd]/10 hover:border-[#a2f4fd] hover:scale-105 active:scale-95 cursor-pointer capitalize"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: copied ? "#ffffff" : "#a2f4fd",
                    background: copied ? "rgba(34, 211, 238, 0.2)" : "transparent",
                    borderColor: copied ? "#a2f4fd" : "rgba(162, 244, 253, 0.4)",
                  }}
                >
                  {copied ? "Link Copied!" : label}
                </button>
              );
            }

            // 3. Policy tags (Privacy Policy, Terms & Conditions): route to policy page
            let href = projectSlug ? `/portfolio/${projectSlug}/${tagSlug}` : `#${tagSlug}`;
            if (isObject && item.url) {
              href = item.url;
            }

            return (
              <Link
                key={`${label}-${index}`}
                href={href}
                className="inline-flex items-center h-8 rounded-full px-4 border transition-all duration-200 hover:bg-[#a2f4fd]/10 hover:border-[#a2f4fd] hover:scale-105 active:scale-95 cursor-pointer capitalize"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#a2f4fd",
                  background: "transparent",
                  borderColor: "rgba(162, 244, 253, 0.4)",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
