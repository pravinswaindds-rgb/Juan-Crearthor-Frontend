import Stats from "../about/components/Stats";
import ServicesHero from "./components/ServicesHero";
import ServicesGrid from "./components/ServicesGrid";
import DevelopmentLab from "./components/DevelopmentLab";
import ServicesCTA from "./components/ServicesCTA";
import SectionScroller from "@/components/common/SectionScroller";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, StrapiServicesPage } from "@/types/strapi";

export const metadata = {
  title: "Services | Crearthor",
  description:
    "Explore our full range of services crafted to solve complex challenges, drive growth, and create long-term value.",
};

export default async function ServicesPage() {
  let data: StrapiServicesPage | null = null;

  try {
    const query = "?populate[0]=Heroo&populate[1]=Statistics&populate[2]=CTAA&populate[3]=Servicessection.Services.Icon&populate[4]=FeaturedProject.image&populate[5]=FeaturedProject.CTAButtons";
    const response = await fetchStrapi<StrapiResponse<StrapiServicesPage>>(`/services-page${query}`);
    data = response.data;
  } catch (error) {
    console.error("Failed to fetch Services Page data:", error);
  }

  return (
    <SectionScroller>
      {/* Ambient background effect - bottom right pink radial */}
      {/* <div className="absolute right-0 top-[60%] w-[1440px] h-[895px] bg-[radial-gradient(ellipse_at_right,rgba(217,70,239,0.14)_0%,transparent_70%)] pointer-events-none -rotate-180" /> */}

      <ServicesHero data={data?.Heroo} />
      <Stats data={data?.Statistics} />
      <div data-ignore-scroller="true">
        <ServicesGrid data={data?.Servicessection} />
      </div>
      <DevelopmentLab data={data?.FeaturedProject} />
      {/* <ServicesCTA data={data?.CTAA} /> */}
    </SectionScroller>
  );
}
