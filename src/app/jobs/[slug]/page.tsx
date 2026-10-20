import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, StrapiJobPosition } from "@/types/strapi";
import { Heading, SectionLabel } from "@/components/ui";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  ExternalLink,
  Clock,
} from "lucide-react";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let job: StrapiJobPosition | null = null;

  try {
    const res = await fetchStrapi<StrapiResponse<StrapiJobPosition[]>>(
      `/job-positions?filters[Slug][$eq]=${slug}&populate=*`
    );
    if (res.data && res.data.length > 0) {
      job = res.data[0];
    }
  } catch (error) {
    console.error("Failed to fetch job position:", error);
  }

  if (!job) {
    notFound();
  }

  // Parse Strapi Blocks rich text → HTML
  const parseDescription = (desc: any): string => {
    if (!desc) return "";
    if (typeof desc === "string") return `<p>${desc}</p>`;
    if (Array.isArray(desc)) {
      return desc
        .map((block: any) => {
          if (!block.children) return "";
          const content = block.children
            .map((child: any) => {
              let text = child.text || "";
              if (child.bold) text = `<strong>${text}</strong>`;
              if (child.italic) text = `<em>${text}</em>`;
              if (child.underline) text = `<u>${text}</u>`;
              return text;
            })
            .join("");
          if (block.type === "paragraph") return `<p>${content}</p>`;
          if (block.type === "heading")
            return `<h${block.level || 2}>${content}</h${block.level || 2}>`;
          if (block.type === "list") {
            const tag = block.format === "ordered" ? "ol" : "ul";
            const items = block.children
              .map(
                (li: any) =>
                  `<li>${li.children?.map((c: any) => c.text || "").join("") || ""}</li>`
              )
              .join("");
            return `<${tag}>${items}</${tag}>`;
          }
          return `<p>${content}</p>`;
        })
        .join("");
    }
    return "";
  };

  // Format employment type for display
  const formatEmploymentType = (type: string | null): string => {
    if (!type) return "Not specified";
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const descriptionHtml = parseDescription(job.Description);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative w-full min-h-[480px] overflow-hidden flex items-center justify-center no-global-reveal">
        {/* Background layer */}
        <div className="absolute inset-0 bg-[#05070d]" />

        {/* Decorative gradients */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-gradient-radial from-cyan/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-magenta/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top & bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, #05070d 0%, transparent 40%, transparent 60%, #05070d 100%)",
          }}
        />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-32 text-center flex flex-col items-center">
          {/* Employment badge */}
          {job.EmploymentType && (
            <span
              className="inline-flex items-center gap-2 rounded-full mb-6"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "1px",
                color: "#a2f4fd",
                background: "rgba(162,244,253,0.082)",
                border: "1px solid rgba(162,244,253,0.2)",
                padding: "6px 16px",
              }}
            >
              <Briefcase className="w-3 h-3" />
              {formatEmploymentType(job.EmploymentType)}
            </span>
          )}

          {/* Title */}
          <Heading
            level={1}
            gradient
            className="mb-6 max-w-4xl mx-auto uppercase"
          >
            {job.Title}
          </Heading>

          {/* Meta tags */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-text-muted text-sm">
            {job.Department && (
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-light" />
                {job.Department}
              </span>
            )}
            {job.Location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-light" />
                {job.Location}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-light" />
              Posted {formatDate(job.publishedAt)}
            </span>
          </div>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-4">
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
            href="/jobs"
            className="hover:text-[#a2f4fd] transition-colors"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "-0.02em",
              color: "#5e6670",
            }}
          >
            Jobs
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
            {job.Title}
          </span>
        </nav>
      </div>

      {/* ── Content + Sidebar ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 flex flex-col lg:flex-row gap-12">
        {/* Main content */}
        <div className="flex-1 max-w-[860px]">
          {/* Description */}
          <div className="mb-12">
            <h2
              className="text-[22px] font-bold text-white uppercase tracking-wide mb-6"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Job Description
            </h2>
            <div
              className="prose prose-invert max-w-none text-text-muted leading-relaxed [&_p]:mb-4 [&_h2]:text-white [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-white [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:text-white"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>

          {/* Back button */}
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-cyan-light transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to all positions
          </Link>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[340px] shrink-0">
          {/* Details card */}
          <div
            className="rounded-2xl p-8 mb-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h3
              className="text-[16px] font-bold text-white uppercase tracking-wider mb-6"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Job Details
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-cyan-light mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
                    Department
                  </p>
                  <p className="text-sm text-white font-medium">
                    {job.Department || "General"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-light mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-sm text-white font-medium">
                    {job.Location || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-cyan-light mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
                    Employment Type
                  </p>
                  <p className="text-sm text-white font-medium">
                    {formatEmploymentType(job.EmploymentType)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-cyan-light mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
                    Posted On
                  </p>
                  <p className="text-sm text-white font-medium">
                    {formatDate(job.publishedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Apply button */}
          {job.ApplyUrl && (
            <a
              href={job.ApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(162,244,253,0.15)]"
              style={{
                fontFamily: "var(--font-dm-sans)",
                background:
                  "linear-gradient(135deg, #22d3ee 0%, #a2f4fd 50%, #a4f4cf 100%)",
                color: "#05070d",
              }}
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {!job.ApplyUrl && (
            <Link
              href="/contact"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(162,244,253,0.15)]"
              style={{
                fontFamily: "var(--font-dm-sans)",
                background:
                  "linear-gradient(135deg, #22d3ee 0%, #a2f4fd 50%, #a4f4cf 100%)",
                color: "#05070d",
              }}
            >
              Contact Us to Apply
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </aside>
      </div>

      {/* Bottom spacer */}
      <div className="pb-72" />
    </>
  );
}
