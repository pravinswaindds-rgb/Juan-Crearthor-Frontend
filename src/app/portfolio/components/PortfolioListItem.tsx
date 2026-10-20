"use client";

import Image from "next/image";
import Link from "next/link";
import { StrapiPortfolioProjectItem, StrapiProject } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";

export interface PortfolioListItemProps {
  item?: StrapiPortfolioProjectItem;
  project?: StrapiProject;
  viewDetailsLabel?: string;
  eyebrow?: string;
  index?: number;
}

export default function PortfolioListItem({
  item,
  project,
  viewDetailsLabel,
  eyebrow,
  index = 0,
}: PortfolioListItemProps) {
  const projectData = project || item?.project;

  if (!projectData) return null;

  const isReversed = index % 2 === 1;

  const getProjectSlug = () => {
    if (projectData.slug) return projectData.slug;
    if (projectData.title) {
      return projectData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    return String(projectData.id);
  };

  const imageUrl = projectData.thumbnail
    ? getStrapiMedia(projectData.thumbnail.url)
    : null;

  return (
    <Link
      href={`/portfolio/${getProjectSlug()}`}
      className="group block relative w-full no-global-reveal"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Banner / Card Column */}
        <div
          className={`w-full lg:col-span-7 ${
            isReversed ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="relative w-full aspect-[16/9] max-h-[380px] rounded-2xl md:rounded-3xl overflow-hidden bg-[#0c1220] border border-white/10 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] transition-all duration-500 flex items-center justify-center p-3 sm:p-5">
            {/* Deep space cosmic background & subtle sparkles matching reference design */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0e1628] via-[#090d16] to-[#04060a] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-radial from-cyan-500/12 via-purple-500/8 to-transparent blur-2xl pointer-events-none" />

            {/* Subtle corner light accents */}
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/25 transition-colors duration-500" />
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-fuchsia-500/25 transition-colors duration-500" />

            {/* Ambient decorative micro-sparks */}
            <div className="absolute top-5 left-7 w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-60 blur-[0.5px] pointer-events-none" />
            <div className="absolute bottom-6 right-8 w-2 h-2 rounded-full bg-pink-400 opacity-50 blur-[0.5px] pointer-events-none" />
            <div className="absolute top-8 right-12 w-1.5 h-1.5 rounded-full bg-yellow-300 opacity-50 blur-[0.5px] pointer-events-none" />
            <div className="absolute bottom-9 left-12 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-60 blur-[0.5px] pointer-events-none" />

            {/* Inner Project Media Asset */}
            {imageUrl ? (
              <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt={projectData.thumbnail?.alternativeText || projectData.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 750px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  unoptimized
                />
                {/* Soft vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="relative w-full h-full rounded-xl md:rounded-2xl flex flex-col items-center justify-center bg-white/5 border border-white/5 text-white/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 text-cyan-400/50"
                >
                  <rect width="20" height="12" x="2" y="6" rx="2" />
                  <path d="M12 12h.01" />
                  <path d="M17 12h.01" />
                  <path d="M7 12h.01" />
                </svg>
                <span className="text-sm font-medium">{projectData.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Text Details Column */}
        <div
          className={`w-full lg:col-span-5 flex flex-col justify-center no-global-reveal ${
            isReversed ? "lg:order-1" : "lg:order-2"
          }`}
        >
          {/* Eyebrow / Category */}
          <div className="mb-2.5">
            <span className="inline-block text-xs uppercase tracking-widest text-[#a2f4fd]/80 font-semibold no-global-reveal">
              {eyebrow || projectData.category || item?.eyebrow || "Project"}
            </span>
          </div>

          {/* Project Title */}
          <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white group-hover:text-cyan-100 transition-colors duration-300 leading-tight tracking-tight no-global-reveal">
            {projectData.title}
          </h3>

          {/* Short Description */}
          <p className="mt-4 text-[#8E96A0] group-hover:text-[#b4bcc6] transition-colors duration-300 text-sm sm:text-base leading-relaxed line-clamp-4 no-global-reveal">
            {projectData.shortDescription ||
              projectData.ProjectOverview ||
              "Explore this interactive digital project crafted with advanced performance and exceptional design."}
          </p>

          {/* View Details Pill Button */}
          <div className="mt-6 sm:mt-8 flex items-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#00DF81]/70 bg-[#00DF81]/5 text-[#00DF81] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 group-hover:bg-[#00DF81]/20 group-hover:border-[#00DF81] group-hover:shadow-[0_0_20px_rgba(0,223,129,0.35)] group-hover:text-white">
              <span>{viewDetailsLabel || item?.ViewDetailsLabel || "View Details"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
