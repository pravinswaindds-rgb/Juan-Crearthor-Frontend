import CTA from "@/components/common/CTA";
import BouncyFooter from "@/components/common/BouncyFooter";
import FooterContent, { SocialLinkItem } from "@/components/common/FooterContent";
import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
import type { StrapiResponse, StrapiCTAA, StrapiSiteSetting } from "@/types/strapi";

const fallbackIconsByPlatform: Record<string, string> = {
  youtube: "/icons/youtube.svg",
  facebook: "/icons/facebook.svg",
  instagram: "/icons/instagram.svg",
  tiktok: "/icons/music.svg",
  linkedin: "/icons/linkdin.svg",
  x: "/icons/twitter.svg",
  twitter: "/icons/twitter.svg",
  snapchat: "/icons/snapchat.svg",
};

export default async function Footer() {
  let ctaData: StrapiCTAA | null | undefined = undefined;
  let socialLinks: SocialLinkItem[] | undefined = undefined;
  let description: string | undefined = undefined;
  let copyrightText: string | undefined = undefined;

  try {
    const ctaPromise = fetchStrapi<StrapiResponse<{ CTAA?: StrapiCTAA }>>(
      "/home-page?populate[0]=CTAA.primaryButton,CTAA.secondaryButton"
    );
    const siteSettingPromise = fetchStrapi<StrapiResponse<StrapiSiteSetting>>(
      "/sitesetting?populate[Footer][populate][social][populate]=*"
    );

    const [ctaResponse, siteSettingResponse] = await Promise.allSettled([
      ctaPromise,
      siteSettingPromise,
    ]);

    if (ctaResponse.status === "fulfilled") {
      ctaData = ctaResponse.value.data?.CTAA;
    }

    if (siteSettingResponse.status === "fulfilled" && siteSettingResponse.value.data?.Footer) {
      const footer = siteSettingResponse.value.data.Footer;
      if (footer.Description) description = footer.Description;
      if (footer.CopyrightText) copyrightText = footer.CopyrightText;

      if (footer.social && Array.isArray(footer.social)) {
        const activeSocials = footer.social
          .filter((item) => item.isActive !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        if (activeSocials.length > 0) {
          socialLinks = activeSocials.map((item) => {
            const platformKey = (item.platform || "").toLowerCase().trim();
            const fallbackIcon = fallbackIconsByPlatform[platformKey] || "/icons/linkdin.svg";

            let iconUrl = fallbackIcon;
            if (item.icon?.url) {
              const mediaUrl = getStrapiMedia(item.icon.url);
              if (mediaUrl) iconUrl = mediaUrl;
            }

            return {
              label: item.platform || "Social Link",
              href: item.url || "#",
              icon: iconUrl,
            };
          });
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch Footer data from Strapi:", error);
  }

  return (
    <footer className="relative">
      {/* CTA - absolutely positioned to overlap above Footer */}
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2 z-20 px-6 lg:px-10 pb-[60px] ">
        <div className="max-w-[1240px] mx-auto">
          <CTA data={ctaData} />
        </div>
      </div>

      {/* Footer container with dark background & ambient glows */}
      <BouncyFooter />
      <div
        className="relative pt-[240px] pb-8 px-6 lg:px-10 overflow-hidden"
        style={{
          background: "#05070d",
        }}
      >
        {/* Radial gradient backgrounds - positioned at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 0%, rgba(217,70,239,0.14) 0%, transparent 70%)",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
            backgroundSize: "49px 49px",
          }}
        />

        {/* Main Footer content with scroll text animations */}
        <FooterContent
          socialLinks={socialLinks}
          description={description}
          copyrightText={copyrightText}
        />
      </div>
    </footer>
  );
}
