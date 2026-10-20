import { StrapiPortfolioProjectItem } from "@/types/strapi";
import PortfolioListItem from "./PortfolioListItem";

interface PortfolioListProps {
  projects?: StrapiPortfolioProjectItem[];
}

export default function PortfolioList({ projects = [] }: PortfolioListProps) {
  if (!projects || projects.length === 0) return null;

  // Filter for active projects and sort by Orderr if needed
  const activeProjects = projects
    .filter((item) => item.IsActivee !== false)
    .sort((a, b) => (a.Orderr || 0) - (b.Orderr || 0));

  return (
    <section className="py-16 pb-72 px-6 lg:px-12 max-w-[1380px] mx-auto overflow-hidden no-global-reveal">
      <div className="flex flex-col gap-16 md:gap-24">
        {activeProjects.map((item, index) => (
          <PortfolioListItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
