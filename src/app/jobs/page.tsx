import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, StrapiJobsPage, StrapiJobPosition } from "@/types/strapi";
import JobsHero from "./components/JobsHero";
import JobsList from "./components/JobsList";
import SectionScroller from "@/components/common/SectionScroller";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import ServicesCTA from "@/app/services/components/ServicesCTA";

export const metadata = {
  title: "Jobs | Crearthor",
  description:
    "Join our team of creators, innovators, and strategists at Crearthor.",
};

export default async function JobsPage() {
  let data: StrapiJobsPage | null = null;
  let slugMap: Record<string, string> = {};

  try {
    // Use explicit nested populate to bypass controller's buggy default
    const query = "?populate[Hero][populate]=*&populate[whychooseus][populate][cards][populate]=*&populate[jobs][populate][cards][populate]=*&populate[CTA][populate]=*&populate[BenefitsSection][populate][Benefits][populate]=*";
    const response = await fetchStrapi<StrapiResponse<StrapiJobsPage>>(`/jobs-page${query}`);
    data = response.data;
  } catch (error) {
    console.error("Failed to fetch Strapi Jobs data:", error);
  }

  // Fetch job-positions to build a title → slug lookup
  try {
    const jpRes = await fetchStrapi<StrapiResponse<StrapiJobPosition[]>>("/job-positions?populate=*");
    if (jpRes.data && Array.isArray(jpRes.data)) {
      for (const jp of jpRes.data) {
        if (jp.Title && jp.Slug) {
          slugMap[jp.Title] = jp.Slug;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch job positions for slug map:", error);
  }

  return (
    <SectionScroller>
      <JobsHero data={data?.Hero} />
      <WhyChooseUs data={data?.whychooseus?.[0]} />
      <JobsList data={data?.jobs} slugMap={slugMap} />
    </SectionScroller>
  );
}
