import Image from "next/image";
import Link from "next/link";
import { SectionLabel, Heading, GlassCard, Button } from "@/components/ui";
import type { StrapiLatestProjects } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";

const fallbackData: StrapiLatestProjects = {
  id: 1,
  Eyebrow: "OUR PROJECTS",
  Title: "OUR LATEST PROJECTS",
  Description:
    "Explore some of our latest projects, where creative ideas, thoughtful design, and modern technology come together to create meaningful digital experiences.",
  ViewAllButton: { id: 1, label: "View All Projects", url: "/portfolio", variant: "outline", openNewTab: false },
  projects: [
    { id: 1, documentId: "mini-games", title: "MINI GAMES", slug: "mini-games", shortDescription: "A fun and engaging mini-games platform designed to deliver quick, casual gaming experiences with an exciting and seamless user experience.", thumbnail: null },
    { id: 2, documentId: "urspot", title: "URSPOT", slug: "urspot", shortDescription: "A modern booking platform that makes finding, scheduling, and managing appointments simple and seamless.", thumbnail: null },
    { id: 3, documentId: "ask", title: "ACCOUNTABILITY SECURE KEY", slug: "ask", shortDescription: "A secure IT license management solution designed to simplify tracking, monitoring, and managing software licenses.", thumbnail: null },
  ],
};

interface ProjectsProps {
  data?: StrapiLatestProjects;
}

export default function Projects({ data }: ProjectsProps) {
  const d = data ?? fallbackData;

  return (
    <section id="portfolio" className="relative py-24 px-6 lg:px-10 max-w-[1440px] mx-auto overflow-hidden">
      {/* Purple radial gradient - top center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(217,70,239,0.1) 0%, rgba(217,70,239,0) 60%)",
        }}
      />

      {/* Section header */}
      <div className="text-center mb-14">
        <SectionLabel className="mb-4">{d.Eyebrow}</SectionLabel>
        <Heading level={2} gradient className="mb-4">
          {d.Title}
        </Heading>
        <p className="max-w-xl mx-auto text-text-muted text-sm leading-relaxed">
          {d.Description}
        </p>
      </div>

      {/* Project cards */}
      {d.projects?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {d.projects.map((project) => (
            <GlassCard key={project.id} hover padding="none" className="overflow-hidden group flex flex-col">
              {/* Image */}
              <div className="relative h-52 bg-gradient-to-br from-cyan/10 to-magenta/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] to-transparent z-10" />
                {project.thumbnail && (
                  <Image
                    src={getStrapiMedia(project.thumbnail.url) || ""}
                    alt={project.thumbnail.alternativeText ?? project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <Heading level={3} gradient className="mb-2">
                  {project.title}
                </Heading>
                <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
                  {project.shortDescription}
                </p>
                <Link
                  href={`/portfolio/${project.slug ?? project.documentId}`}
                  className="inline-block text-[#A2F4FD] text-xs font-semibold uppercase tracking-wider mt-auto"
                >
                  View Details
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* View all button */}
      {d.ViewAllButton && (
        <div className="text-center">
          <Button href={d.ViewAllButton.url ?? "/portfolio"} variant="outline" className="border-cyan/30 text-cyan">
            {d.ViewAllButton.label}
          </Button>
        </div>
      )}
    </section>
  );
}
