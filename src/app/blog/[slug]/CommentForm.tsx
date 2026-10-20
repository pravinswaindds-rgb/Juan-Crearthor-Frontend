"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function CommentForm() {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  return (
    <div className="max-w-[1440px] mx-auto px-[100px] py-10">
      <div
        className="p-10 rounded-[20px]"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(244,168,255,0.2)",
        }}
      >
        <form className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#ffffff",
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full h-13.5 rounded-2xl px-4 outline-none transition-colors focus:border-[#a2f4fd]/50"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "#ffffff",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.102)",
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#ffffff",
                }}
              >
                Email *
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-[54px] rounded-2xl px-4 outline-none transition-colors focus:border-[#a2f4fd]/50"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "#ffffff",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.102)",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#ffffff",
                }}
              >
                Phone *
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full h-[54px] rounded-2xl px-4 outline-none transition-colors focus:border-[#a2f4fd]/50"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "#ffffff",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.102)",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "#ffffff",
                }}
              >
                Subject
              </label>
              <select
                className="w-full h-[54px] rounded-2xl px-4 outline-none appearance-none transition-colors focus:border-[#a2f4fd]/50"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.102)",
                }}
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "#ffffff",
              }}
            >
              Comment *
            </label>
            <textarea
              placeholder="Tell us what you want to build"
              rows={6}
              className="w-full rounded-2xl px-4 py-3 outline-none resize-none transition-colors focus:border-[#a2f4fd]/50"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "20px",
                color: "#ffffff",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.102)",
              }}
            />
          </div>

          <div className="w-full mt-2">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token) => setRecaptchaToken(token)}
              theme="dark"
            />
          </div>

          <button
            type="submit"
            disabled={!recaptchaToken}
            className={`w-full h-[54px] rounded-full flex items-center justify-center transition-all ${recaptchaToken ? 'hover:scale-[1.01] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: 600,
              color: "#05070d",
              background: "linear-gradient(90deg, #a2f4fd 0%, #a4f4cf 50%, #f6cfff 100%)",
              boxShadow: "0 0 54px rgba(34,211,238,0.25)",
            }}
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}
