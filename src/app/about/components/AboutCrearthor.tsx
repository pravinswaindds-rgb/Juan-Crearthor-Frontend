import Image from "next/image";
import type { StrapiAboutCompanyIntro } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";

const defaultFeatures = [
  {
    title: "Innovative Technology Solutions",
    description: "Cutting-edge approaches to complex challenges",
    icon: null,
  },
  {
    title: "Innovative Technology Solutions",
    description: "Cutting-edge approaches to complex challenges",
    icon: null,
  },
  {
    title: "Innovative Technology Solutions",
    description: "Cutting-edge approaches to complex challenges",
    icon: null,
  },
];

export default function AboutCrearthor({ data }: { data?: StrapiAboutCompanyIntro }) {
  const featuresToRender = data?.highlights?.length ? data.highlights : defaultFeatures;

  return (
    <section className="py-24 px-6 lg:px-10 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left - Image */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/20 via-transparent to-magenta/20 rounded-2xl" />
            <div className="relative m-[2px] rounded-2xl overflow-hidden bg-[#0a0c14]">
              {data?.image ? (
                <div className="aspect-[4/3] relative">
                  <Image
                    src={getStrapiMedia(data.image.url) || ""}
                    alt={data.image.alternativeText || "Team Photo"}
                    fill
                    sizes="586"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-cyan/5 to-magenta/5 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan/10 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="text-text-muted text-sm">Team Photo</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Content */}
        <div>
          <p className="text-cyan text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            {data?.eyebrow || "Who We Are"}
          </p>
          <h2 className="font-[family-name:var(--font-anton)] text-4xl sm:text-5xl uppercase gradient-text mb-6 leading-[0.95]">
            {data?.title || "About Crearthor"}
          </h2>
          <p className="text-text-muted text-sm leading-relaxed mb-8 whitespace-pre-line">
            {data?.description || "Crearthor is a software development laboratory, solution architect, and strategy creator. Founded on July 12, 2024, in Pennsylvania, USA. Crearthor was born out of a bold vision to build a powerful collective of creators, innovators, and strategists who reshape the future of technology. We are driven by vision, powered by purpose, and united in our pursuit to build the greatest team in the world. Our mission is to architect transformative digital experiences, design impactful systems, and develop scalable, smart solutions rooted in originality."}
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-5">
            {featuresToRender.map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                      {feature.icon ? (
                        <Image
                          src={getStrapiMedia(feature.icon.url) || ""}
                          alt={feature.title}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white text-sm font-semibold mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-text-muted text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
