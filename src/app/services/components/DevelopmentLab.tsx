import Image from "next/image";
import { SectionLabel, Heading, Badge } from "@/components/ui";
import type { StrapiFeaturedProject } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";

const defaultTags = [
  "System Architecture",
  "Custom AI/ML Runs",
  "Casual Gaming",
  "Secure Licensing Solutions",
  "Embedded Hardware",
];

export default function DevelopmentLab({ data }: { data?: StrapiFeaturedProject | null }) {

  // Extract tags safely depending on how the repeatable component is structured in Strapi
  const tags = data?.CTAButtons?.length
    ? data.CTAButtons.map((btn: any) => btn.Title || btn.title || btn.label || btn.text || (typeof btn === 'string' ? btn : "Tag"))
    : defaultTags;

  return (
    <section className="pt-24 pb-60 lg:pb-75 px-6 lg:px-25 relative" style={{
      background:
        "radial-gradient(ellipse 75% 75% at 0% 0%, rgba(217, 70, 239, 0.14) 0%, rgba(217, 70, 239, 0) 70%)",
    }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-30 items-center max-w-310 mx-auto">
        {/* Left Column - Content */}
        <div className="max-w-152">
          <SectionLabel className="mb-4 text-cyan-light uppercase">
            {data?.eyebrow || "Development Laboratory"}
          </SectionLabel>
          <Heading level={2} gradient className="mb-6 md:text-[60px] leading-none">
            {data?.Title || "Original Product Thinking & Discipline"}
          </Heading>
          <p className="text-text-muted text-sm leading-6 tracking-[-0.02em] mb-10 whitespace-pre-line">
            {data?.Description ||
              `Our Pennsylvanian lab is a playground for technical excellence. We operate across advanced machine learning research, custom embedded software protocols, real-time casual gaming frameworks, and license key validation infrastructure. We exist to solve hard problems with neat solutions.`}
          </p>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag: string, index: number) => (
              <Badge key={tag + index} variant="cyan" className="bg-transparent border border-white/10 text-[#8e9aa8] hover:border-cyan hover:text-cyan transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right Column - Image Container */}
        <div
          className="relative w-132.5 h-93.5 aspect-square sm:aspect-video lg:aspect-4/3 rounded-3xl overflow-hidden p-4 lg:p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)"
          }}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            {data?.image?.url ? (
              <Image
                src={getStrapiMedia(data.image.url) || ""}
                alt={data.image.alternativeText || data.Title || "Featured Project"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <span className="text-text-muted text-sm font-medium">Image placeholder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section >
  );
}
