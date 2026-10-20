import type { NextConfig } from "next";

const getRemotePatterns = () => {
  const patterns: Array<{
    protocol?: "http" | "https";
    hostname: string;
    port?: string;
    pathname?: string;
  }> = [
    { protocol: "http", hostname: "localhost" },
    { protocol: "https", hostname: "localhost" },
    { protocol: "http", hostname: "127.0.0.1" },
    { protocol: "https", hostname: "127.0.0.1" },
    { protocol: "https", hostname: "dev.crearthor.com" },
    { protocol: "http", hostname: "dev.crearthor.com" },
  ];

  const envUrls = [
    process.env.NEXT_PUBLIC_STRAPI_URL,
    process.env.STRAPI_URL,
  ].filter(Boolean);

  for (const envUrl of envUrls) {
    try {
      const parsed = new URL(envUrl!);
      const protocol = parsed.protocol.replace(":", "") as "http" | "https";
      const hostname = parsed.hostname;
      if (!patterns.some((p) => p.hostname === hostname && p.protocol === protocol)) {
        patterns.push({
          protocol,
          hostname,
          port: parsed.port || undefined,
        });
      }
    } catch {
      // Ignore invalid URLs
    }
  }

  return patterns;
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getRemotePatterns(),
    dangerouslyAllowLocalIP: true,
  },
  // Allow WebSocket connections from Cloudflare and Ngrok tunnels
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.ngrok-free.dev"
  ],
};

export default nextConfig;
