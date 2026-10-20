import Image from "next/image";
import { getStrapiMedia } from "@/lib/strapi";
import StrapiRichText from "@/components/common/StrapiRichText";

function extractMediaUrl(media: any): string | null {
  if (!media) return null;
  if (typeof media === "string") return media;
  if (media.url) return media.url;
  if (media.data?.attributes?.url) return media.data.attributes.url;
  if (media.data?.url) return media.data.url;
  if (Array.isArray(media) && media[0]) return extractMediaUrl(media[0]);
  if (Array.isArray(media.data) && media.data[0]) return extractMediaUrl(media.data[0]);
  return null;
}

export default function HowToPlay({
  title = "How to Play",
  sectionLabel,
  content,
  qrCode,
  children,
}: {
  title?: string;
  sectionLabel?: string | null;
  content?: any;
  qrCode?: any;
  children?: React.ReactNode;
}) {
  const rawQrUrl = extractMediaUrl(qrCode);
  const qrCodeUrl = getStrapiMedia(rawQrUrl);

  if (!content && !qrCodeUrl) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-16 flex flex-col lg:flex-row gap-[60px] no-global-reveal">
      <div className="flex-1">
        <div className="container mb-6">
          {sectionLabel && (
            <p
              className="mb-2 text-[#a2f4fd] text-[12px] font-semibold tracking-[3px] uppercase"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {sectionLabel}
            </p>
          )}
          <h2
            className="uppercase tracking-wide"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "34px",
              lineHeight: "40px",
              color: "#ffffff",
            }}
          >
            {title}
          </h2>
        </div>
        <div className="container">
          {content ? (
            <StrapiRichText content={content} />
          ) : (
            <p
              className="text-[#cefafe]/90 leading-[28px] text-[16px] md:text-[18px]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Scan the QR code with your mobile camera to download and play immediately.
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0 flex flex-col gap-4 w-full sm:w-[316px] mx-auto lg:mx-0">
        <div className="w-[316px] h-[316px] rounded-[20px] overflow-hidden relative bg-white mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt={qrCode?.alternativeText || "QR Code"}
              fill
              className="object-contain p-4"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent flex items-center justify-center text-black/40 text-sm">
              No QR Code available
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
