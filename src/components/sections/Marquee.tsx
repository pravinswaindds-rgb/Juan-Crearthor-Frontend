import type { StrapiMarqueeItem } from "@/types/strapi";
import GSAPMarquee from "@/components/common/Marquee";

const fallbackData: StrapiMarqueeItem[] = [
  { id: 1, order: 1, text: "CREATIVE SOFTWARE SOLUTIONS", isActive: true },
  { id: 2, order: 2, text: "GAMING & ENTERTAINMENT", isActive: true },
  { id: 3, order: 3, text: "AI-POWERED INNOVATION", isActive: true },
  { id: 4, order: 4, text: "STRATEGY & CONSULTING", isActive: true },
  { id: 5, order: 5, text: "DIGITAL ECOSYSTEMS", isActive: true },
];


interface MarqueeProps {
  data?: StrapiMarqueeItem[];
}

export default function Marquee({ data }: MarqueeProps) {
  const items = (data?.length ? data : fallbackData)
    .sort((a, b) => a.order - b.order)
    .map((item) => item.text);
  const repeatedItems = [...items, ...items, ...items, ...items];
  const dotColors = ["bg-cyan", "bg-[#F4A8FF]", "bg-[#8EC5FF]"];

  return (
    <div className="relative py-6 border-y border-white/5 bg-[#05070d]">
      <GSAPMarquee speed={1}>
        {repeatedItems.map((item, i) => (
          <span key={i} className="flex items-center mx-8 text-sm text-white/60 uppercase tracking-wider shrink-0 whitespace-nowrap">
            <span className={`w-2 h-2 rounded-full ${dotColors[i % 3]} mr-4 shrink-0`} />
            {item}
          </span>
        ))}
      </GSAPMarquee>
    </div>
  );
}
