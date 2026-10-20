const DEFAULT_STRAPI_URL = "https://dev.crearthor.com";

export function getCleanStrapiBaseUrl(): string {
  const envUrl = (
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL
  )?.replace(/\/$/, "");

  if (envUrl) {
    return envUrl;
  }

  return DEFAULT_STRAPI_URL;
}

export async function fetchStrapi<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const baseUrl = getCleanStrapiBaseUrl();

  const res = await fetch(`${baseUrl}/api${path}`, {
    next: { revalidate: 60 },
    ...init,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Strapi error ${res.status}:`, errorText);
    throw new Error(`Strapi error: ${res.status}`);
  }

  return res.json();
}

export function getStrapiMedia(url: any): string | null {
  if (!url) return null;

  let rawUrl: string = "";
  if (typeof url === "string") {
    rawUrl = url;
  } else if (typeof url === "object") {
    if (url.url) rawUrl = url.url;
    else if (url.data?.attributes?.url) rawUrl = url.data.attributes.url;
    else if (url.data?.url) rawUrl = url.data.url;
    else return null;
  } else {
    return null;
  }

  if (!rawUrl || typeof rawUrl !== "string") return null;

  const baseUrl = getCleanStrapiBaseUrl();

  // Strip localhost / 127.0.0.1 if returned by Strapi
  let cleanUrl = rawUrl;
  if (cleanUrl.includes("localhost") || cleanUrl.includes("127.0.0.1")) {
    try {
      const parsed = new URL(cleanUrl);
      cleanUrl = parsed.pathname + parsed.search + parsed.hash;
    } catch {
      cleanUrl = cleanUrl.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, "");
    }
  }

  // If still an external absolute non-localhost URL (e.g. S3, Cloudinary), return as-is
  if (
    (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") || cleanUrl.startsWith("//")) &&
    !cleanUrl.includes("localhost") &&
    !cleanUrl.includes("127.0.0.1")
  ) {
    return cleanUrl;
  }

  return `${baseUrl}${cleanUrl.startsWith("/") ? "" : "/"}${cleanUrl}`;
}
