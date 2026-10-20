import BlogHero from "./components/BlogHero";
import BlogList from "./components/BlogList";
import BlogSectionScroller from "./components/BlogSectionScroller";
import { fetchStrapi } from "@/lib/strapi";
import { StrapiResponse, StrapiBlogPage, StrapiBlogPost } from "@/types/strapi";

export const metadata = {
  title: "Blog | Crearthor",
  description:
    "Stay updated with the latest insights, trends, and stories from Crearthor.",
};

export default async function BlogPage() {
  let blogPage: StrapiBlogPage | null = null;
  let blogPosts: StrapiBlogPost[] = [];

  try {
    const pageResponse = await fetchStrapi<StrapiResponse<StrapiBlogPage>>("/blog-page?populate=*");
    if (pageResponse.data) {
      blogPage = pageResponse.data;
    }
  } catch (error) {
    console.error("Failed to fetch Blog Page data:", error);
  }

  try {
    const postsResponse = await fetchStrapi<StrapiResponse<StrapiBlogPost[]>>("/blog-posts?populate=*&sort=publishedAt:desc");
    if (postsResponse.data && Array.isArray(postsResponse.data)) {
      blogPosts = postsResponse.data;
    }
  } catch (error) {
    console.error("Failed to fetch Blog Posts data:", error);
  }

  return (
    <>
      <BlogSectionScroller>
        <BlogHero heroData={blogPage?.Hero} />
        <BlogList posts={blogPosts} />
      </BlogSectionScroller>
      {/* Spacer to give clean gap before the footer so the footer CTA does not overlap the cards */}
      <div className="w-full h-[280px] lg:h-[380px] pointer-events-none" />
    </>
  );
}

