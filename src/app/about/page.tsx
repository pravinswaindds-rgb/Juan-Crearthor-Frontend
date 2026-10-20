import AboutHero from "./components/AboutHero";
import Stats from "./components/Stats";
import AboutCrearthor from "./components/AboutCrearthor";
import MissionVisionValues from "./components/MissionVisionValues";
import SectionScroller from "@/components/common/SectionScroller";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, StrapiAboutPage } from "@/types/strapi";

export const metadata = {
  title: "About | Crearthor",
  description:
    "Learn about Crearthor - a software development laboratory, solution architect, and strategy creator.",
};

export default async function AboutPage() {
  let data: StrapiAboutPage | null = null;

  try {
    const query = "?populate=*";
    const response = await fetchStrapi<StrapiResponse<StrapiAboutPage>>(`/about-page${query}`);
    data = response.data;
  } catch (error) {
    console.error("Failed to fetch About Page data:", error);
  }

  return (
    <SectionScroller>
      <AboutHero data={data?.Heroo} />
      <Stats data={data?.Statistics} />
      <AboutCrearthor data={data?.CompanyIntro} />
      <MissionVisionValues data={data?.Philosophy} />
    </SectionScroller>
  );
}
