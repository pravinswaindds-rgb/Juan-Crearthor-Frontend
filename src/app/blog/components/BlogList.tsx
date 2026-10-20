"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { StrapiBlogPost } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogListProps {
  posts?: StrapiBlogPost[];
}

export default function BlogList({ posts = [] }: BlogListProps) {
  const [revealIndex, setRevealIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const totalCount = posts.length || 7;

  const post1 = posts[0] || null;
  const post2 = posts[1] || post1;
  const post3 = posts[2] || post2 || post1;
  const post4 = posts[3] || post3 || post1;
  const post5 = posts[4] || post4 || post1;
  const post6 = posts[5] || post5 || post1;
  const post7 = posts[6] || post6 || post1;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPostDescription = (post: StrapiBlogPost | null, length = 150) => {
    if (!post) return "";
    if (post.Excerpt) return post.Excerpt;
    if (!post.Content) return "";
    let text = "";
    if (typeof post.Content === "string") {
      text = post.Content.replace(/[#*`_]/g, "");
    } else if (Array.isArray(post.Content)) {
      const firstParagraph = post.Content.find(
        (block: any) => block.type === "paragraph"
      );
      if (firstParagraph && Array.isArray(firstParagraph.children)) {
        text = firstParagraph.children
          .map((child: any) => child.text || "")
          .join("");
      }
    }
    return text.length > length
      ? text.substring(0, length).trim() + "..."
      : text;
  };

  const getPostSlug = (post: StrapiBlogPost | null) => {
    if (!post) return "#";
    return `/blog/${post.Slug || (post as any).slug || post.id}`;
  };



  useGSAP(() => {
    if (!containerRef.current) return;

    let tl: gsap.core.Timeline | null = null;
    const splitInstances: SplitType[] = [];

    document.fonts.ready.then(() => {
      if (!containerRef.current) return;

      // 1️⃣ Split text lines once DOM is ready
      const textElements = containerRef.current.querySelectorAll(
        ".col-3 h1, .col-3 p, .col-5 h1, .col-5 p, .col-7 h1, .col-7 p"
      );
      textElements.forEach((element) => {
        const split = new SplitType(element as HTMLElement, {
          types: "lines",
          lineClass: "line",
        });
        splitInstances.push(split);

        split.lines?.forEach((line) => {
          line.innerHTML = `<span>${line.textContent}</span>`;
        });
      });

      // Refresh ScrollTrigger after split
      ScrollTrigger.refresh();

      // 2️⃣ Initial state
      gsap.set(".col-1", { opacity: 1, scale: 1, x: "0%", y: "0%" });
      gsap.set(".col-2", { opacity: 1, scale: 1, x: "100%", y: "0%" });
      gsap.set(".col-3, .col-4, .col-5, .col-6, .col-7, .col-8", {
        autoAlpha: 0,
        scale: 1,
        x: "100%",
        y: "100%",
      });
      gsap.set(".col-3 .col-content-wrapper, .col-5 .col-content-wrapper, .col-7 .col-content-wrapper", { autoAlpha: 1 });
      gsap.set(".col-3 .col-content-wrapper-2, .col-5 .col-content-wrapper-2, .col-7 .col-content-wrapper-2", { autoAlpha: 0 });
      gsap.set(".col-3 .col-content-wrapper .line span, .col-5 .col-content-wrapper .line span, .col-7 .col-content-wrapper .line span", { yPercent: 0 });
      gsap.set(".col-3 .col-content-wrapper-2 .line span, .col-5 .col-content-wrapper-2 .line span, .col-7 .col-content-wrapper-2 .line span", {
        yPercent: -125,
      });
      gsap.set(".col-img-1 img", { scale: 1 });
      gsap.set(".col-img-2", { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
      gsap.set(".col-img-2 img", { scale: 1 });

      // 3️⃣ Timeline for all 7 posts
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=700%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // PHASE 1: Post 1 -> Post 2
      tl.to(".col-1", { opacity: 0, scale: 0.8, duration: 0.8 })
        .to(".col-2", { x: "0%", duration: 0.8 }, "<")
        .to(".col-3", { autoAlpha: 1, y: "0%", duration: 0.8 }, "<")
        .to(".col-2 .col-img-1 img", { scale: 1, duration: 0.8 }, "<")
        .to(
          ".col-2 .col-img-2",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.8,
          },
          "<"
        )
        .to(".col-2 .col-img-2 img", { scale: 1.6, duration: 0.8 }, "<");

      // PHASE 2: Post 2 -> Post 3
      tl.to(".col-2", { opacity: 0, scale: 0.8, duration: 0.8 })
        .to(".col-3 .col-content-wrapper .line span", { yPercent: -125, duration: 0.8 }, "<")
        .to(".col-3 .col-content-wrapper", { autoAlpha: 0, duration: 0.3 }, "<0.4")
        .to(".col-3", { x: "0%", duration: 0.8 }, "-=0.8")
        .to(".col-4", { autoAlpha: 1, y: "0%", duration: 0.8 }, "<")
        .to(".col-3 .col-content-wrapper-2", { autoAlpha: 1, duration: 0.3 }, "<0.3")
        .to(".col-3 .col-content-wrapper-2 .line span", { yPercent: 0, delay: 0.2, duration: 0.8 }, "<");

      // PHASE 3: Post 3 -> Post 4
      tl.to(".col-3", { opacity: 0, scale: 0.8, duration: 0.8 })
        .to(".col-4", { x: "0%", duration: 0.8 }, "<")
        .to(".col-5", { autoAlpha: 1, y: "0%", duration: 0.8 }, "<")
        .to(".col-4 .col-img-1 img", { scale: 1, duration: 0.8 }, "<")
        .to(
          ".col-4 .col-img-2",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.8,
          },
          "<"
        )
        .to(".col-4 .col-img-2 img", { scale: 1.6, duration: 0.8 }, "<");

      // PHASE 4: Post 4 -> Post 5
      tl.to(".col-4", { opacity: 0, scale: 0.8, duration: 0.8 })
        .to(".col-5 .col-content-wrapper .line span", { yPercent: -125, duration: 0.8 }, "<")
        .to(".col-5 .col-content-wrapper", { autoAlpha: 0, duration: 0.3 }, "<0.4")
        .to(".col-5", { x: "0%", duration: 0.8 }, "-=0.8")
        .to(".col-6", { autoAlpha: 1, y: "0%", duration: 0.8 }, "<")
        .to(".col-5 .col-content-wrapper-2", { autoAlpha: 1, duration: 0.3 }, "<0.3")
        .to(".col-5 .col-content-wrapper-2 .line span", { yPercent: 0, delay: 0.2, duration: 0.8 }, "<");

      // PHASE 5: Post 5 -> Post 6
      tl.to(".col-5", { opacity: 0, scale: 0.8, duration: 0.8 })
        .to(".col-6", { x: "0%", duration: 0.8 }, "<")
        .to(".col-7", { autoAlpha: 1, y: "0%", duration: 0.8 }, "<")
        .to(".col-6 .col-img-1 img", { scale: 1, duration: 0.8 }, "<")
        .to(
          ".col-6 .col-img-2",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.8,
          },
          "<"
        )
        .to(".col-6 .col-img-2 img", { scale: 1.6, duration: 0.8 }, "<");

      // PHASE 6: Post 6 -> Post 7
      tl.to(".col-6", { opacity: 0, scale: 0.8, duration: 0.8 })
        .to(".col-7 .col-content-wrapper .line span", { yPercent: -125, duration: 0.8 }, "<")
        .to(".col-7 .col-content-wrapper", { autoAlpha: 0, duration: 0.3 }, "<0.4")
        .to(".col-7", { x: "0%", duration: 0.8 }, "-=0.8")
        .to(".col-8", { autoAlpha: 1, y: "0%", duration: 0.8 }, "<")
        .to(".col-7 .col-content-wrapper-2", { autoAlpha: 1, duration: 0.3 }, "<0.3")
        .to(".col-7 .col-content-wrapper-2 .line span", { yPercent: 0, delay: 0.2, duration: 0.8 }, "<");

      // PHASE 7: Hold Post 7 visible for comfortable viewing before unpinning
      tl.to({}, { duration: 0.8 });
    });

    return () => {
      splitInstances.forEach((split) => split.revert());
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, { scope: containerRef, dependencies: [posts] });

  const renderReadArticleButton = (post: StrapiBlogPost | null) => {
    return (
      <div className="mt-4">
        <Link
          href={getPostSlug(post)}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap text-[#cefafe] bg-[rgba(83,234,253,0.1)] border border-[rgba(83,234,253,0.4)] shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:bg-cyan hover:text-[#05070d] hover:border-cyan hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 group cursor-pointer w-auto"
        >
          <span className="whitespace-nowrap">Read Article</span>
          <svg
            className="w-4 h-4 shrink-0 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    );
  };

  const img1 = post1?.FeaturedImage ? getStrapiMedia(post1.FeaturedImage.url) : null;
  const img2 = post2?.FeaturedImage ? getStrapiMedia(post2.FeaturedImage.url) : null;
  const img3 = post3?.FeaturedImage ? getStrapiMedia(post3.FeaturedImage.url) : null;
  const img4 = post4?.FeaturedImage ? getStrapiMedia(post4.FeaturedImage.url) : null;
  const img5 = post5?.FeaturedImage ? getStrapiMedia(post5.FeaturedImage.url) : null;
  const img6 = post6?.FeaturedImage ? getStrapiMedia(post6.FeaturedImage.url) : null;
  const img7 = post7?.FeaturedImage ? getStrapiMedia(post7.FeaturedImage.url) : null;

  return (
    <section
      ref={containerRef}
      className="sticky-cols no-global-reveal w-full h-screen flex flex-col justify-center items-center overflow-hidden pt-[90px] pb-8 px-4 sm:px-8 lg:px-12"
    >
      <div className="sticky-cols-wrapper relative w-full max-w-[1440px] h-[calc(100vh-130px)] max-h-[740px] mx-auto overflow-hidden">
        {/* COL 1 — Text (Post 1) */}
        <div className="col col-1">
          <div className="col-content">
            <div className="col-content-wrapper">
              <div>
                <Link href={getPostSlug(post1)} className="hover:opacity-80 transition-opacity">
                  <h1 className="text-2xl lg:text-3xl text-white font-bold leading-tight">
                    {post1?.Title}
                  </h1>
                </Link>
                {renderReadArticleButton(post1)}
              </div>
              <div className="col-content-para flex items-center gap-4 justify-between">
                <div className="flex items-center gap-1 justify-center shrink-0">
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white text-xs">
                    1
                  </h3>
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white/70 text-xs">
                    {totalCount}
                  </h3>
                </div>
                <p className="text-[12px] text-white font-medium mr-6">
                  {getPostDescription(post1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COL 2 — Images (Post 1 & Post 2) */}
        <div className="col col-2">
          <div className="col-img col-img-1">
            <div className="col-img-wrapper">
              {img1 ? (
                <Image
                  src={img1}
                  alt={post1?.Title || "img"}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan/20 to-magenta/20" />
              )}
            </div>
          </div>
          <div className="col col-img-2 p-2">
            <div className="col-img-wrapper">
              {img2 ? (
                <Image
                  src={img2}
                  alt={post2?.Title || "img"}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-magenta/20 to-green/20" />
              )}
            </div>
          </div>
        </div>

        {/* COL 3 — Text (Post 2 & Post 3) */}
        <div className="col col-3">
          <div className="col-content h-full">
            <div className="col-content-wrapper">
              <div>
                <Link href={getPostSlug(post2)} className="hover:opacity-80 transition-opacity">
                  <h1 className="text-2xl lg:text-3xl font-bold leading-tight text-white">
                    {post2?.Title}
                  </h1>
                </Link>
                {renderReadArticleButton(post2)}
              </div>
              <div className="col-content-para flex items-center gap-4 justify-between ml-6">
                <div className="flex items-center gap-1 justify-center shrink-0">
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white text-xs">
                    2
                  </h3>
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white/70 text-xs">
                    {totalCount}
                  </h3>
                </div>
                <p className="text-[12px] text-white font-medium">
                  {getPostDescription(post2)}
                </p>
              </div>
            </div>

            <div className="col-content-wrapper-2">
              <div>
                <Link href={getPostSlug(post3)} className="hover:opacity-80 transition-opacity">
                  <h1 className="text-2xl lg:text-3xl font-bold leading-tight text-white">
                    {post3?.Title}
                  </h1>
                </Link>
                {renderReadArticleButton(post3)}
              </div>
              <div className="col-content-para flex items-center gap-4 justify-between">
                <div className="flex items-center gap-1 justify-center shrink-0">
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white text-xs">
                    3
                  </h3>
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white/70 text-xs">
                    {totalCount}
                  </h3>
                </div>
                <p className="text-[12px] text-white font-medium mr-6">
                  {getPostDescription(post3)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COL 4 — Images (Post 3 & Post 4) */}
        <div className="col col-4">
          <div className="col-img col-img-1">
            <div className="col-img-wrapper">
              {img3 ? (
                <Image
                  src={img3}
                  alt={post3?.Title || "img"}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan/20 to-magenta/20" />
              )}
            </div>
          </div>
          <div className="col col-img-2 p-2">
            <div className="col-img-wrapper">
              {img4 ? (
                <Image
                  src={img4}
                  alt={post4?.Title || "img"}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-magenta/20 to-green/20" />
              )}
            </div>
          </div>
        </div>

        {/* COL 5 — Text (Post 4 & Post 5) */}
        <div className="col col-5">
          <div className="col-content h-full">
            <div className="col-content-wrapper">
              <div>
                <Link href={getPostSlug(post4)} className="hover:opacity-80 transition-opacity">
                  <h1 className="text-2xl lg:text-3xl font-bold leading-tight text-white">
                    {post4?.Title}
                  </h1>
                </Link>
                {renderReadArticleButton(post4)}
              </div>
              <div className="col-content-para flex items-center gap-4 justify-between ml-6">
                <div className="flex items-center gap-1 justify-center shrink-0">
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white text-xs">
                    4
                  </h3>
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white/70 text-xs">
                    {totalCount}
                  </h3>
                </div>
                <p className="text-[12px] text-white font-medium">
                  {getPostDescription(post4)}
                </p>
              </div>
            </div>

            <div className="col-content-wrapper-2">
              <div>
                <Link href={getPostSlug(post5)} className="hover:opacity-80 transition-opacity">
                  <h1 className="text-2xl lg:text-3xl font-bold leading-tight text-white">
                    {post5?.Title}
                  </h1>
                </Link>
                {renderReadArticleButton(post5)}
              </div>
              <div className="col-content-para flex items-center gap-4 justify-between">
                <div className="flex items-center gap-1 justify-center shrink-0">
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white text-xs">
                    5
                  </h3>
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white/70 text-xs">
                    {totalCount}
                  </h3>
                </div>
                <p className="text-[12px] text-white font-medium mr-6">
                  {getPostDescription(post5)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COL 6 — Images (Post 5 & Post 6) */}
        <div className="col col-6">
          <div className="col-img col-img-1">
            <div className="col-img-wrapper">
              {img5 ? (
                <Image
                  src={img5}
                  alt={post5?.Title || "img"}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan/20 to-magenta/20" />
              )}
            </div>
          </div>
          <div className="col col-img-2 p-2">
            <div className="col-img-wrapper">
              {img6 ? (
                <Image
                  src={img6}
                  alt={post6?.Title || "img"}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-magenta/20 to-green/20" />
              )}
            </div>
          </div>
        </div>

        {/* COL 7 — Text (Post 6 & Post 7) */}
        <div className="col col-7">
          <div className="col-content h-full">
            <div className="col-content-wrapper">
              <div>
                <Link href={getPostSlug(post6)} className="hover:opacity-80 transition-opacity">
                  <h1 className="text-2xl lg:text-3xl font-bold leading-tight text-white">
                    {post6?.Title}
                  </h1>
                </Link>
                {renderReadArticleButton(post6)}
              </div>
              <div className="col-content-para flex items-center gap-4 justify-between ml-6">
                <div className="flex items-center gap-1 justify-center shrink-0">
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white text-xs">
                    6
                  </h3>
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white/70 text-xs">
                    {totalCount}
                  </h3>
                </div>
                <p className="text-[12px] text-white font-medium">
                  {getPostDescription(post6)}
                </p>
              </div>
            </div>

            <div className="col-content-wrapper-2">
              <div>
                <Link href={getPostSlug(post7)} className="hover:opacity-80 transition-opacity">
                  <h1 className="text-2xl lg:text-3xl font-bold leading-tight text-white">
                    {post7?.Title}
                  </h1>
                </Link>
                {renderReadArticleButton(post7)}
              </div>
              <div className="col-content-para flex items-center gap-4 justify-between">
                <div className="flex items-center gap-1 justify-center shrink-0">
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white text-xs">
                    7
                  </h3>
                  <h3 className="border border-white/20 px-3 py-1 rounded-full text-white/70 text-xs">
                    {totalCount}
                  </h3>
                </div>
                <p className="text-[12px] text-white font-medium mr-6">
                  {getPostDescription(post7)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COL 8 — Image (Post 7) */}
        <div className="col col-8">
          <div className="col-img col-img-1">
            <div className="col-img-wrapper">
              {img7 ? (
                <Image
                  src={img7}
                  alt={post7?.Title || "img"}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan/20 to-magenta/20" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
