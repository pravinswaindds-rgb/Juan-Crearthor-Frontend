import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, StrapiContactPage, StrapiProject } from "@/types/strapi";
import ContactHero from "./components/ContactHero";
import ContactForm from "./components/ContactForm";
import SectionScroller from "@/components/common/SectionScroller";

export const metadata = {
  title: "Contact | Crearthor",
  description:
    "Get in touch with Crearthor. We're here to help bring your ideas to life.",
};

export default async function ContactPage() {
  let data: StrapiContactPage | null = null;
  let projects: StrapiProject[] = [];

  try {
    const [pageRes, projectsRes] = await Promise.all([
      fetchStrapi<StrapiResponse<StrapiContactPage>>("/contact-page?populate=*"),
      fetchStrapi<StrapiResponse<StrapiProject[]>>("/projects?sort=order:asc").catch(() => null),
    ]);
    data = pageRes.data;
    if (projectsRes?.data) {
      projects = projectsRes.data;
    }
  } catch (error) {
    console.error("Failed to fetch Contact Page data:", error);
  }

  return (
    <SectionScroller>
      <ContactHero data={data?.Hero} />
      <ContactForm data={data?.ContactForm} mapData={data?.Map} projects={projects} />

      {/* Full width Map Section */}
      <section className="w-full h-[400px]">
        <iframe
          src={`https://www.google.com/maps?q=${data?.Map?.Latitude || "40.2398"},${data?.Map?.Longitude || "-76.9211"}&hl=es;z=${data?.Map?.Zoom || "14"}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      {/* Spacer for bottom CTA */}
      <div className="pb-72" />
    </SectionScroller>
  );
}
