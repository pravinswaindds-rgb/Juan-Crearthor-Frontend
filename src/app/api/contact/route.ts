import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Simple in-memory rate limiting map (IP -> timestamps[])
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up old rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, valid);
    }
  }
}, 15 * 60 * 1000);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function sanitizeText(str: string): string {
  return str
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .trim();
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const PHONE_REGEX = /^[+]?[\d\s().-]{7,25}$/;

export async function POST(request: NextRequest) {
  try {
    // 1. IP determination & Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submissions. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse request JSON body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const {
      fullName,
      email,
      phone,
      subject,
      message,
      recaptchaToken,
      botField, // Honeypot trap
    } = body;

    // 3. Honeypot check (anti-spam)
    if (botField) {
      // Silently return success to mislead bots
      return NextResponse.json({
        success: true,
        message: "Message received successfully.",
      });
    }

    // 4. Input Validation & Sanitization
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name (at least 2 characters)." },
        { status: 400 }
      );
    }
    if (fullName.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: "Full name is too long (maximum 100 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (email.trim().length > 255) {
      return NextResponse.json(
        { success: false, error: "Email address is too long." },
        { status: 400 }
      );
    }

    if (!phone || (typeof phone !== "string" && typeof phone !== "number")) {
      return NextResponse.json(
        { success: false, error: "Please provide a contact phone number." },
        { status: 400 }
      );
    }
    const phoneStr = String(phone).trim();
    if (!PHONE_REGEX.test(phoneStr)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please select or provide a subject." },
        { status: 400 }
      );
    }
    if (subject.trim().length > 150) {
      return NextResponse.json(
        { success: false, error: "Subject is too long (maximum 150 characters)." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Please write a message with at least 5 characters." },
        { status: 400 }
      );
    }
    if (message.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: "Message is too long (maximum 5,000 characters)." },
        { status: 400 }
      );
    }

    // 5. Google reCAPTCHA Verification
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const isDevBypass = process.env.NODE_ENV !== "production" && recaptchaToken === "test-dev-token";

    if (!isDevBypass && recaptchaSecret && recaptchaSecret.trim() !== "") {
      if (!recaptchaToken) {
        return NextResponse.json(
          { success: false, error: "Please complete the CAPTCHA verification." },
          { status: 400 }
        );
      }

      try {
        const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`,
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          console.error("reCAPTCHA verification failed:", verifyData);
          return NextResponse.json(
            { success: false, error: "CAPTCHA verification failed. Please try again." },
            { status: 400 }
          );
        }
      } catch (recaptchaErr) {
        console.error("reCAPTCHA network error:", recaptchaErr);
      }
    }

    const strapiBaseUrl = (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "https://dev.crearthor.com").replace(/\/$/, "");
    const strapiApiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiApiToken) {
      console.error("Missing STRAPI_API_TOKEN in server environment variables.");
      return NextResponse.json(
        { success: false, error: "Server configuration issue. Please try again later." },
        { status: 500 }
      );
    }

    const payload = {
      data: {
        fullName: sanitizeText(fullName),
        email: sanitizeText(email).toLowerCase(),
        phone: sanitizeText(phoneStr),
        subject: sanitizeText(subject),
        message: sanitizeText(message),
        statuss: "new",
      },
    };

    // 7. Post to Strapi REST API
    // Using ?status=draft to ensure enquiry is stored cleanly for admin review without premature public publish
    const strapiRes = await fetch(`${strapiBaseUrl}/api/contact-submissions?status=draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiApiToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!strapiRes.ok) {
      const errorText = await strapiRes.text();
      console.error(`Strapi submission error (${strapiRes.status}):`, errorText);
      return NextResponse.json(
        { success: false, error: "Unable to save your message. Please try again later." },
        { status: 500 }
      );
    }

    const strapiData = await strapiRes.json();

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been sent successfully. We will be in touch soon.",
        id: strapiData?.data?.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
