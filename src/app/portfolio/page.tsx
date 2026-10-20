import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, StrapiPortfolioPage } from "@/types/strapi";
import PortfolioHero from "./components/PortfolioHero";
import PortfolioCategoryList from "./components/PortfolioCategoryList";
import SectionScroller from "@/components/common/SectionScroller";

export const metadata = {
  title: "Portfolio | Crearthor",
  description:
    "Explore our portfolio of crafted solutions across games, software, and digital experiences.",
};

export default async function PortfolioPage() {
  let data: StrapiPortfolioPage | null = null;

  try {
    const query = "?populate[0]=Heroo&populate[1]=category.coverImage";
    const response = await fetchStrapi<StrapiResponse<StrapiPortfolioPage>>(`/portfolio-page${query}`);
    data = response.data;
  } catch (error) {
    console.error("Failed to fetch Portfolio Page data:", error);
  }

  return (
    <SectionScroller>
      <PortfolioHero data={data?.Heroo} />
      <PortfolioCategoryList categories={data?.category || []} />
    </SectionScroller>
  );
}
