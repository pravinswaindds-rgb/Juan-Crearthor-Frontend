import Link from "next/link";
import StrapiRichText from "@/components/common/StrapiRichText";

interface ProjectOverviewProps {
  overview: any;
  title?: string | null;
  sectionLabel?: string | null;
  projectTitle?: string | null;
  category?: string | { title?: string; slug?: string } | null;
}

export default function ProjectOverview({
  overview,
  title = "Projects Overview",
  sectionLabel,
  projectTitle,
  category,
}: ProjectOverviewProps) {
  if (!overview) return null;

  const displayProjectTitle = projectTitle || title || "Overview";

  let categoryInfo: { title: string; slug: string } | null = null;
  if (category) {
    if (typeof category === "object" && category?.title) {
      categoryInfo = {
        title: category.title,
        slug: category.slug || category.title.toLowerCase(),
      };
    } else if (typeof category === "string") {
      const rawCat = category.trim().toLowerCase();
      if (rawCat === "game" || rawCat === "games") {
        categoryInfo = { title: "Games", slug: "games" };
      } else if (rawCat === "application" || rawCat === "applications") {
        categoryInfo = { title: "Applications", slug: "applications" };
      } else if (category.trim()) {
        categoryInfo = {
          title: category.charAt(0).toUpperCase() + category.slice(1),
          slug: rawCat,
        };
      }
    }
  }

  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-16 no-global-reveal">
      <div className="container mb-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-[#5e6670] mb-8"
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
          {categoryInfo && (
            <>
              <span style={{ color: "#5e6670" }}>/</span>
              <Link
                href={`/portfolio/category/${categoryInfo.slug}`}
                className="hover:text-[#a2f4fd] transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {categoryInfo.title}
              </Link>
            </>
          )}
          <span style={{ color: "#5e6670" }}>/</span>
          <span
            className="text-[#a2f4fd] font-medium"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {displayProjectTitle}
          </span>
        </nav>

        {sectionLabel && (
          <p
            className="mb-2 text-[#a2f4fd] text-[12px] font-semibold tracking-[3px] uppercase"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {sectionLabel}
          </p>
        )}
        <h2
          className="uppercase tracking-wide"
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "34px",
            lineHeight: "40px",
            color: "#ffffff",
          }}
        >
          {title || "Projects Overview"}
        </h2>
      </div>
      <div className="container">
        <StrapiRichText content={overview} />
      </div>
    </section>
  );
}
