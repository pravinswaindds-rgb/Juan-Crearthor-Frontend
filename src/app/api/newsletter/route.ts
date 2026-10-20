import { NextRequest, NextResponse } from "next/server";

// Email regex validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.email !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        { success: false, error: "Email address is too long." },
        { status: 400 }
      );
    }

    const strapiBaseUrl = (
      process.env.STRAPI_URL ||
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      "https://dev.crearthor.com"
    ).replace(/\/$/, "");
    const strapiApiToken = process.env.STRAPI_API_TOKEN;

    const authHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (strapiApiToken) {
      authHeaders["Authorization"] = `Bearer ${strapiApiToken}`;
    }

    // Helper that tries with API Token first, and if 403 Forbidden, falls back to Public role permissions
    const smartStrapiFetch = async (endpoint: string, options: RequestInit) => {
      let res = await fetch(`${strapiBaseUrl}${endpoint}`, {
        ...options,
        headers: { ...authHeaders, ...(options.headers as any) },
      });

      // If token caused 403 Forbidden, retry with public permissions
      if (res.status === 403) {
        res = await fetch(`${strapiBaseUrl}${endpoint}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(options.headers as any),
          },
        });
      }

      return res;
    };

    // 1. Check if email already exists in Strapi Subscribers collection
    try {
      const checkRes = await smartStrapiFetch(
        `/api/subscribers?filters[email][$eq]=${encodeURIComponent(email)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (
          checkData?.data &&
          Array.isArray(checkData.data) &&
          checkData.data.length > 0
        ) {
          return NextResponse.json(
            {
              success: true,
              alreadySubscribed: true,
              message: "You're already subscribed to our newsletter!",
            },
            { status: 200 }
          );
        }
      }
    } catch (checkErr) {
      console.warn("Could not check existing subscriber in Strapi:", checkErr);
    }

    // 2. Post new subscriber to Strapi
    const createRes = await smartStrapiFetch(`/api/subscribers`, {
      method: "POST",
      body: JSON.stringify({
        data: {
          email,
        },
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error(`Strapi subscriber creation error (${createRes.status}):`, errText);

      // Handle duplicate unique constraint error from Strapi
      if (errText.includes("already exists") || errText.includes("unique")) {
        return NextResponse.json(
          {
            success: true,
            alreadySubscribed: true,
            message: "You're already subscribed to our newsletter!",
          },
          { status: 200 }
        );
      }

      // If the collection doesn't exist yet in Strapi
      if (createRes.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Subscriber collection is not yet configured in Strapi. Please create the 'Subscriber' collection type in Strapi first.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Unable to process subscription right now. Please try again later.",
        },
        { status: 500 }
      );
    }

    const resData = await createRes.json();

    return NextResponse.json(
      {
        success: true,
        alreadySubscribed: false,
        message: "Thank you for subscribing to our newsletter!",
        id: resData?.data?.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
