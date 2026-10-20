import Link from "next/link";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, StrapiPortfolioPage, StrapiProject, StrapiPortfolioCategoryItem } from "@/types/strapi";
import PortfolioListItem from "@/app/portfolio/components/PortfolioListItem";
import SectionScroller from "@/components/common/SectionScroller";
import { SectionLabel, Heading } from "@/components/ui";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${capitalized} | Crearthor Portfolio`,
    description: `Explore our portfolio of ${category} solutions and digital experiences.`,
  };
}

export default async function PortfolioCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categorySlug = decodeURIComponent(category).toLowerCase().trim();

  // Singular and plural variants for flexible Strapi matching (e.g. game vs games, application vs applications)
  const singular = categorySlug.endsWith("s") ? categorySlug.slice(0, -1) : categorySlug;
  const plural = categorySlug.endsWith("s") ? categorySlug : `${categorySlug}s`;

  let categoryMeta: any = null;
  let allCategories: StrapiPortfolioCategoryItem[] = [];
  let projects: StrapiProject[] = [];

  try {
    // 1. Fetch category metadata from Portfolio Page
    const pageRes = await fetchStrapi<StrapiResponse<StrapiPortfolioPage>>(
      "/portfolio-page?populate[0]=category.coverImage"
    ).catch(() => null);

    if (pageRes?.data?.category) {
      allCategories = pageRes.data.category;
      categoryMeta = pageRes.data.category.find(
        (c) =>
          c.slug?.toLowerCase() === categorySlug ||
          c.slug?.toLowerCase() === singular ||
          c.slug?.toLowerCase() === plural ||
          c.title?.toLowerCase() === categorySlug
      );
    }

    // 2. Fetch projects matching this category from Strapi
    const query = `?filters[category][$in][0]=${encodeURIComponent(singular)}&filters[category][$in][1]=${encodeURIComponent(plural)}&populate=*&sort=order:asc`;
    const projectsRes = await fetchStrapi<StrapiResponse<StrapiProject[]>>(`/projects${query}`).catch(() => null);

    if (projectsRes?.data && Array.isArray(projectsRes.data)) {
      projects = projectsRes.data;
    }
  } catch (error) {
    console.error("Failed to fetch category projects:", error);
  }

  const categoryTitle =
    categoryMeta?.title || (categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1));
  const categoryEyebrow = categoryMeta?.eyebrow || "Portfolio Category";
  const categoryDescription =
    categoryMeta?.description ||
    `Explore all ${categoryTitle.toLowerCase()} developed and designed by Crearthor.`;

  return (
    <SectionScroller>
      {/* Category Hero Header */}
      <section className="relative pt-[164px] pb-12 md:pb-16 px-6 max-w-[1440px] mx-auto text-center overflow-hidden no-global-reveal">
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gradient-radial from-cyan/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-magenta/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <SectionLabel responsive className="mb-4">
          {categoryEyebrow}
        </SectionLabel>

        <Heading level={1}>
          <span className="gradient-text block uppercase">{categoryTitle}</span>
        </Heading>

        <p className="mt-6 text-[#8E96A0] text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          {categoryDescription}
        </p>

        {/* Category Switcher Pills */}
        {allCategories.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {allCategories.map((cat) => {
              const isActive =
                cat.slug?.toLowerCase() === categorySlug ||
                cat.slug?.toLowerCase() === singular ||
                cat.slug?.toLowerCase() === plural;
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={`/portfolio/category/${cat.slug}`}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${isActive
                    ? "bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/60 shadow-[0_0_20px_rgba(0,223,129,0.25)]"
                    : "border border-white/10 bg-white/5 text-[#8E96A0] hover:text-white hover:border-white/20"
                    }`}
                >
                  {cat.title}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Projects List for this Category in Zigzag Pattern */}
      <section className="py-8 pb-72 px-6 lg:px-12 max-w-[1380px] mx-auto overflow-hidden no-global-reveal">
        {/* Breadcrumb Navigation */}
        <div className="mb-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-[#5e6670]"
          >
            <Link
              href="/"
              className="hover:text-[#a2f4fd] transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Home
            </Link>
            <span style={{ color: "#5e6670" }}>/</span>
            <Link
              href="/portfolio"
              className="hover:text-[#a2f4fd] transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Portfolio
            </Link>
            <span style={{ color: "#5e6670" }}>/</span>
            <span
              className="text-[#a2f4fd] font-medium"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {categoryTitle}
            </span>
          </nav>
        </div>
        {projects.length > 0 ? (
          <div className="flex flex-col gap-16 md:gap-24">
            {projects.map((project, index) => (
              <PortfolioListItem
                key={project.id}
                project={project}
                index={index}
                eyebrow={categoryTitle}
                viewDetailsLabel="View Details"
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-t border-white/5">
            <p className="text-[#5E6670] text-base mb-6">
              No projects found under {categoryTitle} yet.
            </p>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-[#a2f4fd] hover:underline"
            >
              ← Return to all categories
            </Link>
          </div>
        )}
      </section>
    </SectionScroller>
  );
}
