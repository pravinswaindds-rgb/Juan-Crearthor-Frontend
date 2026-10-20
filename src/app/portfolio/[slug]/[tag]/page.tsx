import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { fetchStrapi } from "@/lib/strapi";
import { StrapiResponse } from "@/types/strapi";
import StrapiRichText from "@/components/common/StrapiRichText";

const DEEP_POPULATE =
  "&populate[Hero][populate]=*&populate[ProjectTag][populate]=*&populate=*";

function slugifyTag(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeTagSlug(slug: string): string {
  const s = slug.toLowerCase().trim();
  if (s.includes("privacy")) return "privacy-policy";
  if (s.includes("term")) return "terms-and-condition";
  if (s.includes("share")) return "share-app";
  if (s.includes("contact")) return "contact";
  return s;
}

function getDefaultPolicyContent(projectTitle: string, tagLabel: string): string {
  const isPrivacy = tagLabel.toLowerCase().includes("privacy");

  if (isPrivacy) {
    return `Effective Date: 2024-01-01

Protecting your privacy is very important to us. This Privacy Policy explains what data Crearthor (the "Service Provider", "we", "our", or "us") collects, how we use it, and how you can control it when using our mobile games and apps ("Applications").
We may update this Privacy Policy from time to time. Please check this page regularly for the latest version.

### 1. Who This Policy Applies To
This policy applies to all players ("Users", "you") who download, install, or play our games and use any related services.

### 2. What Data We Collect
We may collect the following types of information:
**Personal Information (if you provide it)**
- Name
- Email address
- Country
- Phone number or other contact info you choose to share

**Automatically Collected Data (through our apps and third parties)**
- Device type, operating system, IP address
- Gameplay and usage data
- Crash reports and performance data
- Advertising identifiers for ads and analytics

### 3. Cookies & Third-Party Services
Some of our games and websites may use cookies or third-party tools. These services may collect data under their own privacy policies, and we are not responsible for their practices.
We may use:
- Google Play Services
- AdMob
- Firebase Analytics
- Firebase Crashlytics
- Unity

If you access social media links or third-party platforms, your data will be handled under their own privacy policies.

### 4. Why We Collect Data
We collect and use data to:
- Provide and improve our games and services
- Personalize your gameplay experience
- Show relevant ads
- Fix crashes and improve performance
- Communicate with you if you contact us
- Prevent fraud and enforce our Terms & Conditions

### 5. How We Protect Your Data
We take security seriously and use technical and administrative measures to protect your information.
Access to your personal data is restricted to authorized staff or systems only.
If we ever discover a data breach, we will notify authorities and affected users within 72 hours.

### 6. When We Share Data
We do not sell your personal information. We may only share data in:
- The given explicit consent
- Required by law
- Needed to provide services through trusted third-party partners (e.g. analytics, crash reporting, advertising networks)

### 7. Children's Privacy
Our games are not directed at children under the age of 13 (or the age defined by your local law, such as 16 in the EU). We do not knowingly collect personal data from children.
If you are under this age, please do not use our games or provide any personal information.
Parents or guardians who believe their child has provided personal data to us can contact us at info@crearthor.com, and we will take action to remove such information.

### 8. Your Choices
You are in control of your data. You can:
- Opt out of ads personalization through your device settings
- Unsubscribe from emails or notifications
- Refuse to provide personal info by not using forms or support chats
- Request access, update, or deletion of your personal data by contacting us

### 9. Changes to Terms
We may update these policies from time to time. Please check this page for updates.

### 10. Contact Us
If you have any questions about this policy, please reach out to us: info@crearthor.com`;
  }

  return `Effective Date: 2024-01-01

Welcome to ${projectTitle}. By accessing or using this application or game, you agree to be bound by these Terms and Conditions.

### 1. Acceptance of Terms
By downloading, installing, or playing ${projectTitle}, you agree to comply with and be bound by these terms. If you do not agree to these terms, please do not use our application.

### 2. Intellectual Property Rights
All content, features, functionality, trademarks, graphics, audio, and code within ${projectTitle} are owned by Crearthor and are protected by international copyright, trademark, and other intellectual property laws.

### 3. User Conduct and Responsibilities
You agree not to:
- Modify, reverse engineer, decompile, or disassemble any portion of the software.
- Exploit bugs, glitches, or unintended mechanics for commercial gain.
- Engage in abusive, harassing, or illegal conduct.

### 4. In-App Purchases and Virtual Items
Certain features or virtual items may be made available for purchase. All purchases are final and non-refundable, except as required by applicable law or the platform terms (Google Play Store / Apple App Store).

### 5. Termination
We reserve the right to suspend or terminate your access to the game at any time without notice if you violate these terms.

### 6. Disclaimer of Warranties
${projectTitle} is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.

### 7. Limitation of Liability
In no event shall Crearthor be liable for any indirect, incidental, special, or consequential damages resulting from your use of the application.

### 8. Governing Law
These Terms shall be governed by and construed in accordance with the applicable laws of the jurisdiction in which Crearthor operates.

### 9. Contact Us
For any inquiries regarding these Terms and Conditions, please contact us at info@crearthor.com.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; tag: string }>;
}) {
  const { slug, tag } = await params;
  const projectTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const tagTitle = tag
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${tagTitle} | ${projectTitle} | Crearthor`,
    description: `Read the ${tagTitle} for ${projectTitle} provided by Crearthor.`,
  };
}

export default async function ProjectTagDynamicPage({
  params,
}: {
  params: Promise<{ slug: string; tag: string }>;
}) {
  const { slug, tag } = await params;

  const normalizedRequestedSlug = normalizeTagSlug(tag);
  if (normalizedRequestedSlug === "contact") {
    redirect("/contact");
  }
  if (normalizedRequestedSlug === "share-app") {
    redirect(`/portfolio/${slug}`);
  }

  let project: any | null = null;

  try {
    const query = `?filters[slug][$eq]=${encodeURIComponent(slug)}${DEEP_POPULATE}`;
    const response = await fetchStrapi<StrapiResponse<any[]>>(
      `/portfolio-details-pages${query}`
    );
    if (response.data && response.data.length > 0) {
      project = response.data[0];
    }

    if (!project) {
      const projRes = await fetchStrapi<StrapiResponse<any[]>>(
        `/projects?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
      ).catch(() => null);
      if (projRes?.data && projRes.data.length > 0) {
        project = projRes.data[0];
      }
    }
  } catch (error) {
    console.error("Failed to fetch project for tag page:", error);
  }

  if (!project) {
    notFound();
  }

  const projectTitle =
    project.Hero?.titleone ||
    project.Hero?.Title ||
    project.title ||
    project.Title ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Find matching tag in project.ProjectTag
  let matchedTagItem: any = null;

  if (Array.isArray(project.ProjectTag)) {
    matchedTagItem = project.ProjectTag.find((t: any) => {
      const itemLabel = t.Label || t.label || t.Title || "";
      const itemSlug = t.Slug || t.slug || slugifyTag(itemLabel);
      return (
        slugifyTag(itemSlug) === tag ||
        slugifyTag(itemLabel) === tag ||
        normalizeTagSlug(itemSlug) === normalizedRequestedSlug ||
        normalizeTagSlug(itemLabel) === normalizedRequestedSlug
      );
    });
  }

  const displayTagLabel =
    matchedTagItem?.Label ||
    matchedTagItem?.label ||
    matchedTagItem?.Title ||
    tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Extract content: from Strapi if present, or fallback template
  const tagContent =
    matchedTagItem?.Content ||
    matchedTagItem?.content ||
    matchedTagItem?.Description ||
    matchedTagItem?.description ||
    getDefaultPolicyContent(projectTitle, displayTagLabel);

  const documentTitle =
    matchedTagItem?.Title ||
    matchedTagItem?.title ||
    `${projectTitle} - ${displayTagLabel}`;

  return (
    <>
      {/* Hero with Crearthor Cosmic Design */}
      <section className="relative w-full h-[380px] md:h-[428px] overflow-hidden no-global-reveal">
        <div className="absolute inset-0 bg-[#05070d]" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 80%, rgba(217,70,239,0.14) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto h-full flex flex-col items-center justify-center px-6">
          <p
            className="text-center mb-6 uppercase"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "12px",
              letterSpacing: "4px",
              color: "#a2f4fd",
            }}
          >
            {projectTitle}
          </p>
          <h1
            className="text-center uppercase"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "70px",
              lineHeight: "70px",
              color: "#ffffff",
            }}
          >
            {displayTagLabel}
          </h1>
        </div>
      </section>

      {/* Separator */}
      <div
        className="w-full h-px"
        style={{ background: "rgba(83,234,253,0.3)" }}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-4">
        <nav className="flex items-center gap-2 text-sm text-[#5e6670]">
          <Link
            href="/"
            className="hover:text-[#a2f4fd] transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/portfolio"
            className="hover:text-[#a2f4fd] transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Portfolio
          </Link>
          <span>/</span>
          <Link
            href={`/portfolio/${slug}`}
            className="hover:text-[#a2f4fd] transition-colors text-white/80"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {projectTitle}
          </Link>
          <span>/</span>
          <span
            className="text-[#a2f4fd] font-medium capitalize"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {displayTagLabel}
          </span>
        </nav>
      </div>

      {/* Main Document Content */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-12 md:py-16 no-global-reveal">
        <div className="container mb-8">
          <h2
            className="uppercase tracking-wide"
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "34px",
              lineHeight: "40px",
              color: "#ffffff",
            }}
          >
            {documentTitle}
          </h2>
        </div>
        <div className="container max-w-[960px]">
          <StrapiRichText content={tagContent} />
        </div>
      </section>

      {/* Separator */}
      <div
        className="w-full h-px"
        style={{ background: "rgba(83,234,253,0.3)" }}
      />

      {/* Bottom Navigation */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px] py-8 pb-72 flex items-center justify-between">
        <Link
          href={`/portfolio/${slug}`}
          className="inline-flex items-center justify-center rounded-full transition-all hover:bg-white/5"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "18px",
            color: "#fae8ff",
            border: "1px solid rgba(244,168,255,0.4)",
            padding: "14px 20px",
          }}
        >
          ← Back to {projectTitle}
        </Link>
        <a
          href="#top"
          className="inline-flex items-center justify-center rounded-full transition-all hover:scale-105"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "18px",
            color: "#05070d",
            background: "#a2f4fd",
            border: "1px solid rgba(83,234,253,0.4)",
            padding: "14px 20px",
            boxShadow: "0 0 50px rgba(34,211,238,0.2)",
          }}
        >
          Back to Top
        </a>
      </div>
    </>
  );
}
