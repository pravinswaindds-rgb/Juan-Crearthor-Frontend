import Link from "next/link";
import Image from "next/image";
import BlogTags from "./BlogTags";

export interface BlogSocialItem {
  platform: string;
  url: string;
  icon?: string | null;
}

const defaultBlogSocials: BlogSocialItem[] = [
  { platform: "Instagram", url: "https://www.instagram.com/crearthorthelegacy/" },
  { platform: "Facebook", url: "https://www.facebook.com/crearthorthelegacy/" },
  { platform: "X", url: "https://x.com/crearthor" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/company/crearthorthelegacy/" },
];

function renderSocialSvg(platform: string) {
  const p = (platform || "").toLowerCase();
  if (p.includes("youtube")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (p.includes("facebook")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (p.includes("instagram")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (p.includes("tiktok")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    );
  }
  if (p.includes("linkedin")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }
  if (p === "x" || p.includes("twitter")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (p.includes("snapchat")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 2.002c-4.14 0-6.75 3.036-6.75 5.753 0 1.25.5 2.5 1 3.25.125.188.063.438-.125.563-.563.375-1.688 1.125-2.063 2.125-.313.875.188 1.625.875 1.875.5.188 1.125.188 1.688.063.25-.063.438.063.5.313.25 1 .875 1.625 2.188 1.875.688.125 1.375.063 2.063.313.563.188 1 .688 1.688.688.688 0 1.125-.5 1.688-.688.688-.25 1.375-.188 2.063-.313 1.313-.25 1.938-.875 2.188-1.875.063-.25.25-.375.5-.313.563.125 1.188.125 1.688-.063.688-.25 1.188-1 .875-1.875-.375-1-1.5-1.75-2.063-2.125-.188-.125-.25-.375-.125-.563.5-.75 1-2 1-3.25 0-2.717-2.61-5.753-6.75-5.753z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
    </svg>
  );
}

interface BlogArticleProps {
  post: {
    title?: string;
    image?: string | null;
    tags: string[];
    content: {
      intro: string;
      articleImage?: string | null;
      sections: { heading: string; body: string; list?: string[] }[];
      conclusion: string;
    };
  };
  prevPost?: { slug: string; title?: string } | null;
  nextPost?: { slug: string; title?: string } | null;
  socials?: BlogSocialItem[];
}

export default function BlogArticle({
  post,
  prevPost,
  nextPost,
  socials,
}: BlogArticleProps) {
  const socialItems = socials && socials.length > 0 ? socials : defaultBlogSocials;

  return (
    <article className="py-10">
      {/* Intro */}
      {post.content.intro && (
        <p
          className="mb-8"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "16px",
            lineHeight: "26px",
            color: "#5e6670",
          }}
        >
          {post.content.intro}
        </p>
      )}

      {/* Fallback if no sections exist: render featured image immediately */}
      {post.content.sections.length === 0 && (post.content.articleImage || post.image) && (
        <div className="relative w-full aspect-video rounded-[32px] overflow-hidden mb-8">
          <Image
            src={(post.content.articleImage || post.image)!}
            alt={post.title || "Article feature"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 820px"
            priority
          />
        </div>
      )}

      {/* Sections */}
      {post.content.sections.map((section, i) => (
        <div key={i} className="mb-8">
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "24px",
              lineHeight: "24px",
              background:
                "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {section.heading}
          </h2>
          <div
            className="flex flex-col gap-4"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "16px",
              lineHeight: "26px",
              color: "#5e6670",
            }}
          >
            {section.body.split("\n\n").map((para, pIdx) => (
              <p key={pIdx}>{para}</p>
            ))}
          </div>
          {i === 0 && (post.content.articleImage || post.image) && (
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden mt-8 mb-8">
              <Image
                src={(post.content.articleImage || post.image)!}
                alt={post.title || "Article feature"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 820px"
                priority
              />
            </div>
          )}
          {section.list && (
            <ul className="mt-6 flex flex-col gap-4">
              {section.list.map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="mt-[6px] shrink-0 text-[#a2f4fd]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 12L20.56 9.22L20.9 5.54L17.29 4.72L15.4 1.54L12 3L8.6 1.54L6.71 4.72L3.1 5.53L3.44 9.21L1 12L3.44 14.78L3.1 18.47L6.71 19.29L8.6 22.47L12 21L15.4 22.46L17.29 19.28L20.9 18.46L20.56 14.78L23 12M9.8 17.2L5.6 13L7 11.6L9.8 14.4L17 7.2L18.4 8.6L9.8 17.2Z" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "16px",
                      lineHeight: "26px",
                      color: "#cefafe",
                    }}
                  >
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Conclusion */}
      <div className="mb-8">
        <h2
          className="mb-4"
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "24px",
            lineHeight: "24px",
            background:
              "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Conclusion
        </h2>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "16px",
            lineHeight: "26px",
            color: "#5e6670",
          }}
        >
          {post.content.conclusion}
        </p>
      </div>

      <BlogTags tags={post.tags} />

      {/* Social Icons */}
      <div className="flex flex-wrap items-center gap-3 mt-8">
        {socialItems.map((social, index) => (
          <a
            key={`${social.platform}-${index}`}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            title={social.platform}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/25 transition-all text-white group"
          >
            {social.icon ? (
              <Image
                src={social.icon}
                alt={social.platform}
                width={18}
                height={18}
                className="brightness-0 invert object-contain max-h-[18px] max-w-[18px] group-hover:scale-110 transition-transform"
                unoptimized
              />
            ) : (
              <div className="group-hover:scale-110 transition-transform flex items-center justify-center">
                {renderSocialSvg(social.platform)}
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Prev/Next */}
      <div className="flex items-center gap-4 mt-12 pt-8 border-t border-white/10">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            title={prevPost.title ? `Previous: ${prevPost.title}` : "Previous Article"}
            className="inline-flex items-center justify-center rounded-full transition-all hover:bg-white/5"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "18px",
              color: "#fae8ff",
              border: "1px solid rgba(244,168,255,0.4)",
              padding: "14px 20px",
            }}
          >
            Previous Article
          </Link>
        ) : (
          <span
            className="inline-flex items-center justify-center rounded-full opacity-40 cursor-not-allowed select-none"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "18px",
              color: "#fae8ff",
              border: "1px solid rgba(244,168,255,0.2)",
              padding: "14px 20px",
            }}
          >
            Previous Article
          </span>
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            title={nextPost.title ? `Next: ${nextPost.title}` : "Next Article"}
            className="inline-flex items-center justify-center rounded-full transition-all hover:scale-105"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "18px",
              color: "#05070d",
              background: "#a2f4fd",
              border: "1px solid rgba(83,234,253,0.4)",
              padding: "14px 20px",
              boxShadow: "0 0 50px rgba(34,211,238,0.2)",
            }}
          >
            Next Article
          </Link>
        ) : (
          <span
            className="inline-flex items-center justify-center rounded-full opacity-40 cursor-not-allowed select-none"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "18px",
              color: "#05070d",
              background: "#a2f4fd",
              border: "1px solid rgba(83,234,253,0.2)",
              padding: "14px 20px",
            }}
          >
            Next Article
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="mt-8 border-t border-white/10" />

      {/* Comments heading */}
      <h3
        className="mt-10 mb-6"
        style={{
          fontFamily: "var(--font-anton)",
          fontSize: "24px",
          lineHeight: "24px",
          color: "#ffffff",
        }}
      >
        0 Comments
      </h3>
    </article>
  );
}
