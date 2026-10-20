import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Projects from "@/components/sections/Projects";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Contact from "@/components/sections/Contact";
import SectionScroller from "@/components/common/SectionScroller";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, StrapiProject } from "@/types/strapi";

export default async function Home() {
  let data = null;
  let projects: StrapiProject[] = [];

  try {
    const query =
      "?populate[0]=Hero.primaryButton&populate[1]=Hero.secondaryButton&populate[2]=Hero.backgroundImage&populate[3]=Marquee&populate[4]=LatestProjects.projects.thumbnail&populate[5]=LatestProjects.ViewAllButton&populate[6]=WhyChooseUs.cards.icons&populate[7]=Contact.ContactForm.SubmitButton";
    const [homeRes, projectsRes] = await Promise.all([
      fetchStrapi<StrapiResponse>(`/home-page${query}`),
      fetchStrapi<StrapiResponse<StrapiProject[]>>("/projects?sort=order:asc").catch(() => null),
    ]);
    data = homeRes.data;
    if (projectsRes?.data) {
      projects = projectsRes.data;
    }
  } catch (error) {
    console.error("Failed to fetch Strapi data:", error);
    data = null;
  }

  return (
    <SectionScroller>
      <Hero data={data?.Hero} />
      <Marquee data={data?.Marquee} />
      <Projects data={data?.LatestProjects} />
      <WhyChooseUs data={data?.WhyChooseUs?.[0]} />
      <Contact data={data?.Contact} projects={projects} />
    </SectionScroller>
  );
}
