import { notFound, redirect } from "next/navigation";
import ProjectOverview from "./ProjectOverview";
import ImageCarousel from "./ImageCarousel";
import HowToPlay from "./HowToPlay";
import KeyFeatures from "./KeyFeatures";
import StoreButtons from "./StoreButtons";
import PortfolioTextReveal from "./PortfolioTextReveal";
import { fetchStrapi } from "@/lib/strapi";
import { StrapiResponse } from "@/types/strapi";

const DEEP_POPULATE =
  "&populate[Hero][populate]=*&populate[ProjectOverview][populate]=*&populate[Gallery][populate]=*&populate[HowToPlay][populate]=*&populate[KeyFeatures][populate]=*&populate[QRCode]=*&populate[DownloadLinks][populate]=*&populate[ProjectTag][populate]=*&populate[Cta][populate]=*&populate=*";

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  try {
    const [detailRes, projectsRes] = await Promise.all([
      fetchStrapi<StrapiResponse<any[]>>("/portfolio-details-pages").catch(() => null),
      fetchStrapi<StrapiResponse<any[]>>("/projects").catch(() => null),
    ]);

    if (detailRes?.data && Array.isArray(detailRes.data)) {
      detailRes.data.forEach((p) => {
        if (p?.slug) slugs.push({ slug: String(p.slug) });
      });
    }

    if (projectsRes?.data && Array.isArray(projectsRes.data)) {
      projectsRes.data.forEach((p) => {
        if (p?.slug) {
          slugs.push({ slug: String(p.slug) });
        } else if (p?.title) {
          slugs.push({
            slug: p.title
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          });
        }
      });
    }
  } catch (e) {
    // fallback
  }
  return slugs;
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // If slug is a category, redirect to the category listing page
  const lowerSlug = slug.toLowerCase();
  if (["games", "applications", "game", "application"].includes(lowerSlug)) {
    redirect(`/portfolio/category/${lowerSlug}`);
  }

  let project: any | null = null;
  let rawProject: any | null = null;

  try {
    // 1. Try to fetch from portfolio-details-pages by slug with deep population
    const query = `?filters[slug][$eq]=${encodeURIComponent(slug)}${DEEP_POPULATE}`;
    const response = await fetchStrapi<StrapiResponse<any[]>>(
      `/portfolio-details-pages${query}`
    );
    if (response.data && response.data.length > 0) {
      project = response.data[0];
    }

    // 2. If not found and slug is numeric, try portfolio-details-pages by id
    if (!project && /^\d+$/.test(slug)) {
      const idQuery = `?filters[id][$eq]=${slug}${DEEP_POPULATE}`;
      const idRes = await fetchStrapi<StrapiResponse<any[]>>(
        `/portfolio-details-pages${idQuery}`
      ).catch(() => null);
      if (idRes?.data && idRes.data.length > 0) {
        project = idRes.data[0];
      }
    }

    // 3. Fallback: Search in projects collection if no portfolio-details-page entry exists yet
    if (!project) {
      // Try by slug
      let projRes = await fetchStrapi<StrapiResponse<any[]>>(
        `/projects?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
      ).catch(() => null);

      // Try by numeric id
      if ((!projRes?.data || projRes.data.length === 0) && /^\d+$/.test(slug)) {
        projRes = await fetchStrapi<StrapiResponse<any[]>>(
          `/projects?filters[id][$eq]=${slug}&populate=*`
        ).catch(() => null);
      }

      // Try by title match (slugified words)
      if (!projRes?.data || projRes.data.length === 0) {
        const cleanTitle = slug.replace(/-/g, " ");
        projRes = await fetchStrapi<StrapiResponse<any[]>>(
          `/projects?filters[title][$containsi]=${encodeURIComponent(cleanTitle)}&populate=*`
        ).catch(() => null);
      }

      if (projRes?.data && projRes.data.length > 0) {
        rawProject = projRes.data[0];

        // Also check if there is an existing portfolio-details-page matching this project title
        const matchTitleRes = await fetchStrapi<StrapiResponse<any[]>>(
          `/portfolio-details-pages?filters[Hero][titleone][$containsi]=${encodeURIComponent(rawProject.title)}${DEEP_POPULATE}`
        ).catch(() => null);

        if (matchTitleRes?.data && matchTitleRes.data.length > 0) {
          project = matchTitleRes.data[0];
        } else {
          const galleryImages = [
            rawProject.featuredImage,
            rawProject.thumbnail,
          ].filter(Boolean);

          project = {
            id: rawProject.id,
            slug: rawProject.slug || slug,
            Hero: {
              eyebrow: rawProject.category === "game" ? "GAME DEVELOPMENT" : "SOFTWARE & PLATFORM",
              titleone: rawProject.title,
              titletwo: null,
              description: rawProject.shortDescription || rawProject.description,
              backgroundImage: rawProject.featuredImage || rawProject.thumbnail,
            },
            ProjectOverview: rawProject.description || rawProject.shortDescription,
            Gallery: {
              Gallery: galleryImages,
            },
            ProjectTag: [
              { Label: rawProject.category === "game" ? "Game Development" : "Applications" },
              { Label: "Creative Engineering" },
              { Label: "High Performance" },
            ],
            KeyFeatures: rawProject.shortDescription,
            QRCode: rawProject.QRCode || rawProject.qrcode || rawProject.qrCode,
          };
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch Project data:", error);
  }

  if (!project) {
    notFound();
  }

  // Extract rich text / data directly from Strapi fields without destroying user formatting
  const fallbackOverview =
    "Explore the vision, architecture, and technology behind this project. Designed with high-performance standards, creative excellence, and seamless user interaction.";

  const overviewData =
    project.ProjectOverview?.Description ??
    project.ProjectOverview?.description ??
    project.ProjectOverview?.Content ??
    project.ProjectOverview?.text ??
    project.ProjectOverview ??
    project.shortDescription ??
    project.description ??
    fallbackOverview;

  const howToPlayData =
    project.HowToPlay?.Content ??
    project.HowToPlay?.content ??
    project.HowToPlay?.Description ??
    project.HowToPlay?.text ??
    project.HowToPlay;

  const qrCodeData =
    project.QRCode ??
    project.qrcode ??
    project.qrCode ??
    project.QrCode ??
    project.HowToPlay?.QRCode ??
    project.HowToPlay?.qrcode ??
    project.HowToPlay?.qrCode ??
    project.HowToPlay?.QrCode ??
    rawProject?.QRCode ??
    rawProject?.qrcode ??
    rawProject?.qrCode;

  const keyFeaturesData =
    project.KeyFeatures?.Content ??
    project.KeyFeatures?.content ??
    project.KeyFeatures?.Description ??
    project.KeyFeatures?.text ??
    project.KeyFeatures;

  const chipsList =
    Array.isArray(project.ProjectTag) && project.ProjectTag.length > 0
      ? project.ProjectTag
      : [
          { Label: "Privacy Policy", Slug: "privacy-policy" },
          { Label: "Terms & Conditions", Slug: "terms-and-condition" },
        ];

  const galleryList =
    project.Gallery?.Gallery ||
    project.Gallery?.images ||
    project.Gallery ||
    [];

  const projectTitle =
    project.Hero?.titleone ||
    project.Hero?.Title ||
    project.Title ||
    project.title ||
    slug.replace(/-/g, " ");

  const projectCategory =
    project.category ||
    rawProject?.category ||
    (project.Hero?.eyebrow?.toLowerCase().includes("game")
      ? "games"
      : project.Hero?.eyebrow?.toLowerCase().includes("application") ||
        project.Hero?.eyebrow?.toLowerCase().includes("software")
      ? "applications"
      : null);

  return (
    <>
      <PortfolioTextReveal />
      {/* Hero */}
      <section className="relative w-full h-[428px] overflow-hidden no-global-reveal">
        <div className="absolute inset-0 bg-[#05070d]" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 80%, rgba(217,70,239,0.14) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto h-full flex flex-col items-center justify-center px-6">
          <p
            className="text-center mb-6"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "12px",
              letterSpacing: "4px",
              color: "#a2f4fd",
            }}
          >
            {project.Hero?.eyebrow || project.eyebrow || "PROJECT DETAILS"}
          </p>
          <h1
            className="text-center uppercase"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "90px",
              lineHeight: "90px",
              color: "#ffffff",
            }}
          >
            {projectTitle}
          </h1>
          {project.Hero?.titletwo && (
            <h2
              className="text-center uppercase mt-3"
              style={{
                fontFamily: "var(--font-anton)",
                fontSize: "60px",
                lineHeight: "60px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {project.Hero.titletwo}
            </h2>
          )}
        </div>
      </section>

      {/* Separator */}
      <div
        className="w-full h-px"
        style={{ background: "rgba(83,234,253,0.3)" }}
      />

      {/* Project Overview */}
      {overviewData && (
        <ProjectOverview
          overview={overviewData}
          title={project.ProjectOverview?.Title}
          sectionLabel={project.ProjectOverview?.SectionLabel}
          projectTitle={projectTitle}
          category={projectCategory}
        />
      )}

      {/* Gallery Image Carousel */}
      <ImageCarousel images={galleryList} />

      {/* How To Play / How It Works / QR Code */}
      {(howToPlayData || qrCodeData) && (
        <HowToPlay
          title={
            project.HowToPlay?.SectionLabel ||
            project.HowToPlay?.title ||
            (project.category === "application" ? "How It Works" : "How to Play")
          }
          sectionLabel={project.HowToPlay?.SectionLabel}
          content={howToPlayData}
          qrCode={qrCodeData}
        >
          <StoreButtons />
        </HowToPlay>
      )}

      {/* Key Features */}
      {(keyFeaturesData || chipsList.length > 0) && (
        <KeyFeatures
          features={keyFeaturesData}
          chips={chipsList}
          projectSlug={project.slug || slug}
          projectTitle={project.Hero?.titleone || project.Hero?.Title || project.title || project.Title}
          appUrl={
            (Array.isArray(project.DownloadLinks) &&
              (project.DownloadLinks.find((d: any) =>
                d?.label?.toLowerCase().includes("play") || d?.url?.includes("google") || d?.url?.includes("http")
              )?.url ||
                project.DownloadLinks[0]?.url)) ||
            ""
          }
        />
      )}

      {/* Separator */}
      <div
        className="w-full h-px"
        style={{ background: "rgba(83,234,253,0.3)" }}
      />

      {/* Prev/Next Navigation */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-8 pb-72 flex items-center justify-between">
        <a
          href="/portfolio"
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
          All Projects
        </a>
        <a
          href="#top"
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
          Back to Top
        </a>
      </div>
    </>
  );
}
