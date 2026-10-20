import type { StrapiPortfolioCategoryItem } from "@/types/strapi";
import PortfolioCategoryItem from "./PortfolioCategoryItem";

interface PortfolioCategoryListProps {
  categories?: StrapiPortfolioCategoryItem[];
}

export default function PortfolioCategoryList({ categories = [] }: PortfolioCategoryListProps) {
  if (!categories || categories.length === 0) {
    return (
      <section className="py-16 pb-72 px-6 lg:px-10 max-w-[1440px] mx-auto text-center text-text-muted">
        No portfolio categories found.
      </section>
    );
  }

  // Sort categories by order if provided
  const sortedCategories = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="py-16 pb-72 px-6 lg:px-10 max-w-[1440px] mx-auto overflow-hidden">
      <div className="flex flex-col border-t border-white/5">
        {sortedCategories.map((item) => (
          <PortfolioCategoryItem key={item.id || item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
