import type { Metadata } from "next";
import { DM_Sans, Anton } from "next/font/google";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import StaticBackground from "@/components/common/StaticBackground";
import SmoothScrolling from "@/components/common/SmoothScrolling";
import GlobalTextReveal from "@/components/common/GlobalTextReveal";
import "./globals.css";

import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
import type { StrapiResponse } from "@/types/strapi";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = "/favicon.ico";
  let siteName = "Crearthor | Software Development Laboratory";
  let tagline =
    "Crearthor is a software development laboratory, solution architect and strategy creator.";

  try {
    const siteRes = await fetchStrapi<StrapiResponse<any>>(
      "/sitesetting?populate[0]=Favicon&populate[1]=Logo"
    ).catch(() => null);

    const siteData = siteRes?.data;
    if (siteData?.Favicon) {
      faviconUrl = getStrapiMedia(siteData.Favicon) || faviconUrl;
    }
    if (siteData?.SiteName) {
      siteName = `${siteData.SiteName} | Software Development Laboratory`;
    }
    if (siteData?.Tagline) {
      tagline = siteData.Tagline;
    }
  } catch (error) {
    console.error("Failed to fetch site metadata:", error);
  }

  return {
    title: siteName,
    description: tagline,
    icons: {
      icon: [
        { url: faviconUrl },
        { url: faviconUrl, sizes: "any" },
      ],
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

const fallbackNavLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Jobs", href: "/jobs" },
  { label: "Contact", href: "/contact" },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let navLinks = fallbackNavLinks;
  let logoUrl = "/images/logo.png";
  let faviconUrl = "/favicon.ico";
  let ctaData = null;

  let drawerData: any = null;

  try {
    // Fetch Site Settings and Contact Page from Strapi
    const [siteRes, contactRes] = await Promise.all([
      fetchStrapi<StrapiResponse<any>>(
        "/sitesetting?populate[0]=navigationItems&populate[1]=Logo&populate[2]=headerCTA&populate[3]=Footer.social&populate[4]=ContactInformation&populate[5]=Favicon"
      ).catch(() => null),
      fetchStrapi<StrapiResponse<any>>(
        "/contact-page?populate[0]=ContactForm.Items"
      ).catch(() => null),
    ]);

    const siteData = siteRes?.data;
    const contactData = contactRes?.data;

    if (siteData) {
      if (siteData.Favicon) {
        faviconUrl = getStrapiMedia(siteData.Favicon) || faviconUrl;
      }
      if (siteData.navigationItems) {
        // Filter out inactive items and sort by Order
        const activeItems = siteData.navigationItems
          .filter((item: any) => item.IsActive !== false)
          .sort((a: any, b: any) => (a.Order || 0) - (b.Order || 0));

        const fetchedLinks = activeItems.map((item: any) => ({
          label: item.Label || "",
          href: item.URL || "/",
        }));

        if (fetchedLinks.length > 0) {
          navLinks = fetchedLinks;
        }
      }

      if (siteData.Logo?.url) {
        logoUrl = getStrapiMedia(siteData.Logo.url) || logoUrl;
      }

      if (siteData.headerCTA && siteData.headerCTA.length > 0) {
        ctaData = {
          label: siteData.headerCTA[0].label,
          url: siteData.headerCTA[0].url,
        };
      }
    }

    // Extract dynamic contact items for the side drawer
    const formSection = contactData?.ContactForm;
    const contactItems: any[] = formSection?.Items || [];
    const phoneItem = contactItems.find((i: any) => i.Type === "PHONE" && i.IsActive !== false);
    const emailItem = contactItems.find((i: any) => i.Type === "EMAIL" && i.IsActive !== false);
    const addressItem = contactItems.find((i: any) => i.Type === "ADDRESS" && i.IsActive !== false);

    const resolvedPhone = phoneItem?.Link || formSection?.Phone || "(717) 441-5788";
    const resolvedEmail = emailItem?.Link || formSection?.Email || "info@crearthor.com";
    const resolvedAddress = addressItem?.Link || formSection?.Address || "1525 Cedar Cliff Dr, Suite 101, Camp Hill, PA 17011";

    drawerData = {
      eyebrow: siteData?.ContactInformation?.eyebrow || formSection?.SectionLabel || "Drop Us a Line",
      title: siteData?.ContactInformation?.title || "Connect with Crearthor",
      description:
        siteData?.ContactInformation?.description ||
        "Ready to take the first step towards unlocking opportunities, realizing goals, and embracing innovation?",
      phone: {
        label: phoneItem?.Label || "To More Inquiry",
        value: resolvedPhone,
      },
      email: {
        label: emailItem?.Label || "To Send Mail",
        value: resolvedEmail,
      },
      address: {
        label: addressItem?.Label || "Office Address 01",
        value: resolvedAddress,
      },
      socialTitle: "Social Just You Connected Us!",
      socials: siteData?.Footer?.social || [],
    };
  } catch (err) {
    console.error("Failed to fetch site settings for navbar or drawer, using fallback.");
  }

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${anton.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href={faviconUrl} sizes="any" />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
      </head>
      <body className="min-h-full flex flex-col bg-transparent text-white font-[family-name:var(--font-dm-sans)] overflow-x-hidden" suppressHydrationWarning>
        <SmoothScrolling>
          <GlobalTextReveal />
          <StaticBackground />
          <Header
            navLinks={navLinks}
            logoUrl={logoUrl}
            ctaData={ctaData}
            drawerData={drawerData}
          />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
