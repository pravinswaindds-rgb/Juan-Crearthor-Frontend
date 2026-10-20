import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BlogArticle from "./BlogArticle";
import RelatedArticles from "./RelatedArticles";
import BlogSidebarTags from "./BlogSidebarTags";
import CommentForm from "./CommentForm";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
import { StrapiResponse, StrapiBlogPost, StrapiSiteSetting } from "@/types/strapi";


// Removed static params to support dynamic backend fetching

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let postFromStrapi: StrapiBlogPost | null = null;
  let allBlogPosts: { slug: string; title: string }[] = [];
  let allPostsRaw: any[] = [];
  let socialLinks: { platform: string; url: string; icon?: string | null }[] = [];

  const BLOG_DETAIL_POPULATE =
    "populate[FeaturedImage]=true&populate[Tags]=true&populate[NewTags]=true&populate[related_articles][populate][RelatedArticles][populate]=FeaturedImage";

  try {
    const [res, allRes, siteSettingRes] = await Promise.all([
      fetchStrapi<StrapiResponse<StrapiBlogPost[]>>(
        `/blog-posts?filters[Slug][$eq]=${encodeURIComponent(slug)}&${BLOG_DETAIL_POPULATE}`
      ).catch(() => null),
      fetchStrapi<StrapiResponse<any[]>>(
        "/blog-posts?sort=publishedAt:desc&fields[0]=Slug&fields[1]=Title&fields[2]=Category&fields[3]=PublishedDate&populate[FeaturedImage]=true&populate[Tags]=*&pagination[pageSize]=100"
      ).catch(() => null),
      fetchStrapi<StrapiResponse<StrapiSiteSetting>>(
        "/sitesetting?populate[Footer][populate][social][populate]=*"
      ).catch(() => null),
    ]);

    if (res?.data && res.data.length > 0) {
      postFromStrapi = res.data[0];
    } else {
      // Fallback in case the Strapi field was lowercase slug
      const fallbackRes = await fetchStrapi<StrapiResponse<StrapiBlogPost[]>>(
        `/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&${BLOG_DETAIL_POPULATE}`
      ).catch(() => null);
      if (fallbackRes?.data && fallbackRes.data.length > 0) {
        postFromStrapi = fallbackRes.data[0];
      }
    }

    if (allRes?.data && Array.isArray(allRes.data)) {
      allPostsRaw = allRes.data;
      allBlogPosts = allRes.data
        .map((p: any) => ({
          slug: p.Slug || p.slug || "",
          title: p.Title || p.title || "",
        }))
        .filter((p) => Boolean(p.slug));
    }

    if (siteSettingRes?.data?.Footer?.social && Array.isArray(siteSettingRes.data.Footer.social)) {
      const active = siteSettingRes.data.Footer.social
        .filter((s: any) => s.isActive !== false)
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

      socialLinks = active.map((s: any) => ({
        platform: s.platform || "Social",
        url: s.url || "#",
        icon: s.icon?.url ? getStrapiMedia(s.icon.url) : null,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch post or site settings:", error);
  }

  if (!postFromStrapi) {
    notFound();
  }

  let prevPost: { slug: string; title: string } | null = null;
  let nextPost: { slug: string; title: string } | null = null;

  if (allBlogPosts.length > 1) {
    const currentSlug = (postFromStrapi.Slug || postFromStrapi.slug || slug).toLowerCase();
    const currentIndex = allBlogPosts.findIndex(
      (p) => p.slug.toLowerCase() === currentSlug
    );

    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + allBlogPosts.length) % allBlogPosts.length;
      const nextIndex = (currentIndex + 1) % allBlogPosts.length;
      prevPost = allBlogPosts[prevIndex];
      nextPost = allBlogPosts[nextIndex];
    } else {
      prevPost = allBlogPosts[allBlogPosts.length - 1];
      nextPost = allBlogPosts[0];
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  let intro = "";
  let conclusion = "";
  const sections: { heading: string; body: string; list?: string[] }[] = [];
  let currentSection: any = null;

  const extractText = (children: any[]): string => {
    if (!children || !Array.isArray(children)) return "";
    return children.map((c: any) => {
      if (c.type === "link") return extractText(c.children);
      return c.text || "";
    }).join("");
  };

  if (postFromStrapi?.Content && Array.isArray(postFromStrapi.Content)) {
    postFromStrapi.Content.forEach((block: any) => {
      const text = extractText(block.children);

      if (block.type === "heading") {
        if (text.trim().toLowerCase() === "conclusion") {
          currentSection = { heading: "CONCLUSION_BLOCK", body: "", list: [] };
        } else {
          currentSection = { heading: text, body: "", list: [] };
          sections.push(currentSection);
        }
      } else if (block.type === "paragraph" || block.type === "quote") {
        if (text.trim().toLowerCase() === "conclusion") {
          currentSection = { heading: "CONCLUSION_BLOCK", body: "", list: [] };
          return;
        }

        if (currentSection) {
          if (currentSection.heading === "CONCLUSION_BLOCK") {
            conclusion += (conclusion ? "\n" : "") + text;
          } else {
            currentSection.body += (currentSection.body ? "\n\n" : "") + text;
          }
        } else {
          intro += (intro ? "\n\n" : "") + text;
        }
      } else if (block.type === "list") {
        const items = block.children?.map((li: any) => extractText(li.children)) || [];
        if (currentSection) {
          if (currentSection.heading === "CONCLUSION_BLOCK") {
            conclusion += (conclusion ? "\n" : "") + items.map((i: string) => "- " + i).join("\n");
          } else {
            currentSection.list = currentSection.list ? currentSection.list.concat(items) : items;
          }
        }
      }
    });
  } else if (postFromStrapi?.Content && typeof postFromStrapi.Content === "string") {
    intro = postFromStrapi.Content;
  }

  // 1. Article body tags (powered by existing `Tags` component)
  let articleTags: string[] = [];
  if (postFromStrapi && (postFromStrapi as any).Tags && Array.isArray((postFromStrapi as any).Tags)) {
    articleTags = (postFromStrapi as any).Tags
      .filter((t: any) => t.IsActive !== false && t.isActive !== false)
      .sort((a: any, b: any) => (a.Order ?? 0) - (b.Order ?? 0))
      .map((t: any) => {
        const val = t.Label || t.label || Object.values(t).find(v => typeof v === "string" && v.length > 0 && isNaN(Number(v)));
        return val ? String(val).trim() : null;
      })
      .filter((t: any): t is string => Boolean(t));
  }

  // 2. Sidebar New Tags (powered by dedicated `NewTags` component in Strapi)
  let sidebarNewTags: string[] = [];
  const rawNewTags =
    (postFromStrapi as any).NewTags ||
    (postFromStrapi as any).newTags ||
    (postFromStrapi as any).NewTag ||
    (postFromStrapi as any).new_tags ||
    (postFromStrapi as any).SidebarTags;

  if (rawNewTags && Array.isArray(rawNewTags)) {
    sidebarNewTags = rawNewTags
      .filter((t: any) => t.IsActive !== false && t.isActive !== false)
      .sort((a: any, b: any) => (a.Order ?? 0) - (b.Order ?? 0))
      .map((t: any) => {
        if (typeof t === "string") return t.trim();
        const val =
          t.Label ||
          t.label ||
          t.Title ||
          t.title ||
          t.Name ||
          t.name ||
          t.Tag ||
          t.tag ||
          Object.values(t).find((v) => typeof v === "string" && v.length > 0 && isNaN(Number(v)));
        return val ? String(val).trim() : null;
      })
      .filter((t: any): t is string => Boolean(t));
  }

  const featuredImageUrl = postFromStrapi.FeaturedImage
    ? getStrapiMedia(postFromStrapi.FeaturedImage.url)
    : null;

  const post = {
    slug: postFromStrapi.slug || postFromStrapi.Slug,
    title: postFromStrapi.Title,
    category: postFromStrapi.Category || "Blog",
    author: (postFromStrapi as any).Author || "Admin",
    date: formatDate(postFromStrapi.PublishedDate || postFromStrapi.publishedAt),
    comments: 0,
    image: featuredImageUrl,
    content: {
      intro: intro || postFromStrapi.Excerpt || "",
      articleImage: featuredImageUrl || undefined,
      sections: sections,
      conclusion: (postFromStrapi as any).Conclusion || conclusion,
    },
    tags: articleTags.length > 0 ? articleTags : (postFromStrapi.Category ? [postFromStrapi.Category] : []),
  };

  let mappedRelatedArticles: {
    slug: string;
    title: string;
    category: string;
    date: string;
    image: string;
  }[] = [];

  const currentSlugLower = (postFromStrapi.Slug || postFromStrapi.slug || slug).toLowerCase();
  const rawRelatedEntries = (postFromStrapi as any)?.related_articles;

  if (Array.isArray(rawRelatedEntries) && rawRelatedEntries.length > 0) {
    for (const ra of rawRelatedEntries) {
      if (Array.isArray(ra.RelatedArticles)) {
        for (const blogPost of ra.RelatedArticles) {
          const bpSlug = blogPost.Slug || blogPost.slug;
          if (!bpSlug || bpSlug.toLowerCase() === currentSlugLower) continue;
          mappedRelatedArticles.push({
            slug: bpSlug,
            title: blogPost.Title || blogPost.title || "",
            category: blogPost.Category || blogPost.category || "Blog",
            date: formatDate(blogPost.PublishedDate || blogPost.publishedAt),
            image: blogPost.FeaturedImage ? getStrapiMedia(blogPost.FeaturedImage.url) || "" : "",
          });
        }
      } else if (ra.Title || ra.Slug || ra.slug) {
        const bpSlug = ra.Slug || ra.slug;
        if (!bpSlug || bpSlug.toLowerCase() === currentSlugLower) continue;
        mappedRelatedArticles.push({
          slug: bpSlug,
          title: ra.Title || ra.title || "",
          category: ra.Category || ra.category || "Blog",
          date: formatDate(ra.PublishedDate || ra.publishedAt),
          image: ra.FeaturedImage ? getStrapiMedia(ra.FeaturedImage.url) || "" : "",
        });
      }
    }
  }

  // Fallback: If RelatedArticles was not directly populated, fetch by documentId/id
  if (mappedRelatedArticles.length === 0 && Array.isArray(rawRelatedEntries) && rawRelatedEntries.length > 0) {
    for (const ra of rawRelatedEntries) {
      const docId = ra.documentId || ra.id;
      if (!docId) continue;
      try {
        const raRes = await fetchStrapi<StrapiResponse<any>>(
          `/related-articles/${docId}?populate[RelatedArticles][populate]=FeaturedImage`
        );
        const raData = raRes.data;
        if (raData?.RelatedArticles && Array.isArray(raData.RelatedArticles)) {
          for (const blogPost of raData.RelatedArticles) {
            const bpSlug = blogPost.Slug || blogPost.slug;
            if (!bpSlug || bpSlug.toLowerCase() === currentSlugLower) continue;
            mappedRelatedArticles.push({
              slug: bpSlug,
              title: blogPost.Title || blogPost.title || "",
              category: blogPost.Category || blogPost.category || "Blog",
              date: formatDate(blogPost.PublishedDate || blogPost.publishedAt),
              image: blogPost.FeaturedImage ? getStrapiMedia(blogPost.FeaturedImage.url) || "" : "",
            });
          }
        }
      } catch (err) {
        console.error("Secondary related articles fetch error:", err);
      }
    }
  }

  // Fallback: If still empty, use other recent articles from allPostsRaw
  if (mappedRelatedArticles.length === 0 && allPostsRaw.length > 0) {
    mappedRelatedArticles = allPostsRaw
      .filter((p: any) => (p.Slug || p.slug || "").toLowerCase() !== currentSlugLower)
      .slice(0, 5)
      .map((p: any) => ({
        slug: p.Slug || p.slug || "",
        title: p.Title || p.title || "",
        category: p.Category || p.category || "Blog",
        date: formatDate(p.PublishedDate || p.publishedAt),
        image: p.FeaturedImage ? getStrapiMedia(p.FeaturedImage.url) || "" : "",
      }));
  }

  // Deduplicate by slug and limit to 5
  const seenSlugs = new Set<string>();
  mappedRelatedArticles = mappedRelatedArticles.filter((item) => {
    if (!item.slug || seenSlugs.has(item.slug.toLowerCase())) return false;
    seenSlugs.add(item.slug.toLowerCase());
    return true;
  }).slice(0, 5);

  // Fallback for New Tags (as shown in design reference) until the admin populates NewTags in Strapi
  const fallbackNewTags = [
    "Social Media",
    "Influencer",
    "Analytics",
    "Remarketing",
    "Marketing",
    "Optimization",
    "Link Building",
    "Industry",
    "Brand Strategy",
    "demo",
  ];

  const displayedNewTags = sidebarNewTags.length > 0 ? sidebarNewTags : fallbackNewTags;

  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[575px] overflow-hidden no-global-reveal">
        <div className="absolute inset-0 bg-[#05070d]" />

        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-20 mix-blend-luminosity"
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #05070d 0%, transparent 50%, #05070d 100%)",
          }}
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-[1440px] mx-auto h-full flex flex-col items-center justify-center px-6">
          {/* Category pill */}
          <span
            className="inline-flex items-center rounded-full mb-6"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1px",
              color: "#a2f4fd",
              background: "rgba(162,244,253,0.082)",
              border: "1px solid rgba(162,244,253,0.2)",
              padding: "6px 12px",
            }}
          >
            {post.category}
          </span>

          {/* Title */}
          <h1
            className="text-center max-w-[1135px] mb-8"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "72px",
              lineHeight: "72px",
              background:
                "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {post.title}
          </h1>

          {/* Author/Date */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              color: "#5e6670",
            }}
          >
            {post.author} - {post.date} - {post.comments} comments
          </p>
        </div>
      </section>

      {/* Divider */}
      {/* <div
        className="w-full h-[46px]"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(83,234,253,0.4) 50%, transparent 100%)",
          opacity: 0.3,
        }}
      /> */}

      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-[100px] py-4">
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="hover:text-[#a2f4fd] transition-colors"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "-0.02em",
              color: "#5e6670",
            }}
          >
            Home
          </Link>
          <span style={{ color: "#5e6670" }}>/</span>
          <Link
            href="/blog"
            className="hover:text-[#a2f4fd] transition-colors"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "-0.02em",
              color: "#5e6670",
            }}
          >
            Blogs
          </Link>
          <span style={{ color: "#5e6670" }}>/</span>
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
              letterSpacing: "-0.02em",
              color: "#a2f4fd",
            }}
          >
            {post.title}
          </span>
        </nav>
      </div>

      {/* Article + Sidebar */}
      <div className="max-w-[1440px] mx-auto px-[100px] flex gap-10">
        <div className="flex-1 max-w-[819px]">
          <BlogArticle post={post} prevPost={prevPost} nextPost={nextPost} socials={socialLinks} />
          {/* <BlogTags tags={post.tags} /> */}
        </div>
        <aside className="w-[340px] shrink-0">
          <div className="sticky top-28 mt-10 flex flex-col gap-6">
            <RelatedArticles articles={mappedRelatedArticles} />
            <BlogSidebarTags tags={displayedNewTags} title="New Tags:" />
          </div>
        </aside>
      </div>

      <div className="pb-72"><CommentForm /></div>
      {/* <div className="pb-32"><CTA /></div> */}
    </>
  );
}
