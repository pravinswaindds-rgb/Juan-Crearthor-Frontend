import Image from "next/image";
import { SectionLabel, Heading, GlassCard, IconContainer } from "@/components/ui";
import type { StrapiWhyChooseUsItem } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";

const fallbackData: StrapiWhyChooseUsItem = {
  id: 1,
  eyebroww: "Why Choose Us",
  title: "DRIVING IMPACT THROUGH INTELLIGENT SOLUTIONS",
  description:
    "Explore some of our latest projects, where creative ideas, thoughtful design, and modern technology come together to create meaningful digital experiences.",
  cards: [
    { id: 1, order: 1, title: "CREATIVITY", description: "Original vision mixed with production-grade discipline.", icons: null },
    { id: 2, order: 2, title: "UNIFIED", description: "Design, engineering, sales, and solution teams aligned in one command flow.", icons: null },
    { id: 3, order: 3, title: "EXPERTISE", description: "Software infrastructure, consulting, and advisory delivery experience.", icons: null },
    { id: 4, order: 4, title: "PARTNERSHIP", description: "Long-term client relations focused on clarity, trust, and sustainable growth.", icons: null },
  ],
};

interface WhyChooseUsProps {
  data?: StrapiWhyChooseUsItem;
}

export default function WhyChooseUs({ data }: WhyChooseUsProps) {
  const d = data ?? fallbackData;

  return (
    <section id="services" className="relative py-24 px-6 lg:px-25 w-full mx-auto overflow-hidden min-h-screen flex flex-col justify-center" style={{
      backgroundColor: "#05070d",
      backgroundImage:
        "radial-gradient(ellipse at 100% 0%, rgba(34,211,238,0.14) 0%, rgba(34,211,238,0) 70%)",
    }}>
      {/* Radial gradient background - Figma Rectangle 171 */}
      <div
        className="absolute inset-0 pointer-events-none"

      />

      {/* Section header */}
      <div className="mb-14">
        <SectionLabel className="mb-4">{d.eyebroww}</SectionLabel>
        <Heading level={2} gradient className="mb-4 max-w-3xl">
          {d.title}
        </Heading>
        <p className="max-w-xl text-text-muted text-sm leading-relaxed">
          {d.description}
        </p>
      </div>

      {/* Feature cards */}
      {d.cards?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {d.cards.map((card) => (
            <GlassCard key={card.id}>
              <IconContainer size="md" className="mb-5">
                {card.icons && (
                  <Image
                    src={getStrapiMedia(card.icons.url) || ""}
                    alt={card.icons.alternativeText ?? card.title}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                )}
              </IconContainer>
              <Heading level={3} gradient className="mb-2">
                {card.title}
              </Heading>
              <p className="text-text-muted text-sm leading-relaxed">
                {card.description}
              </p>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}
