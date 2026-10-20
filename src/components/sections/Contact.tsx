"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FormInput, FormSelect, FormTextarea } from "@/components/ui";
import MagneticButton from "@/components/common/MagneticButton";
import type { StrapiContact, StrapiProject } from "@/types/strapi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const fallbackData: StrapiContact = {
  id: 1,
  Email: "info@crearthor.com",
  Phone: "+1 717 288 6972",
  Address: "Pennsylvania, USA",
  SectionLabel: "CONTACT US",
  Title: "LET'S START A CONVERSATION",
  Description: "Have a question, idea, or project in mind? We'd love to hear from you.",
  ContactForm: {
    id: 1,
    FullNameLabel: "FULL NAME *",
    FullNamePlaceholder: "John Doe",
    EmailLabel: "EMAIL *",
    EmailPlaceholder: "you@company.com",
    PhoneLabel: "PHONE *",
    PhonePlaceholder: "+1 (555) 000-0000",
    SubjectLabel: "SUBJECT *",
    SubjectOptions: null,
    MessageLabel: "MESSAGE *",
    MessagePlaceholder: "Tell us what you want to build",
    SubmitButton: { id: 1, label: "Send Message", url: null, variant: "primary", openNewTab: false },
  },
};


interface ContactProps {
  data?: StrapiContact;
  projects?: StrapiProject[];
}

export default function Contact({ data, projects = [] }: ContactProps) {
  const d = data ?? fallbackData;
  const form = d.ContactForm;
  const sectionRef = useRef<HTMLElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // Build subject options dynamically including portfolio projects from Strapi
  const portfolioOptions = (projects || []).map((p) => ({
    value: `portfolio-${p.slug || p.title.toLowerCase().replace(/\s+/g, "-")}`,
    label: `Portfolio: ${p.title}`,
  }));

  const defaultOptions = [
    { value: "general", label: "General Inquiry" },
    { value: "project", label: "Project Discussion" },
    ...portfolioOptions,
    { value: "support", label: "Support" },
    { value: "other", label: "Other" },
  ];

  let subjectOptions = defaultOptions;
  if (typeof form?.SubjectOptions === "string" && form.SubjectOptions.trim()) {
    const parsedOptions = form.SubjectOptions.split(",").map((opt: string) => opt.trim()).filter(Boolean);
    if (parsedOptions.length > 0 && !parsedOptions.includes("General Inquiry")) {
      subjectOptions = [
        ...parsedOptions.map((opt: string) => ({
          value: opt.toLowerCase().replace(/\s+/g, "-"),
          label: opt,
        })),
        ...portfolioOptions,
      ];
    }
  }

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: subjectOptions[0]?.value || "general",
    message: "",
    botField: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!recaptchaToken) {
      setStatusMessage({
        type: "error",
        text: "Please verify the reCAPTCHA checkbox above before sending your message.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      // Call Next.js internal API route (/app-api/ avoids production Nginx proxying /api/ directly to Strapi)
      const [res] = await Promise.all([
        fetch("/app-api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            recaptchaToken,
            botField: formData.botField,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);

      let result: any = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await res.json().catch(() => null);
      } else {
        const text = await res.text().catch(() => "");
        result = { success: false, error: text || `Server error (${res.status})` };
      }

      if (!res.ok || !result?.success) {
        throw new Error(result?.error || "Failed to send message. Please try again.");
      }

      setIsSubmitted(true);
      setStatusMessage({
        type: "success",
        text: result.message || "Thank you! Your message has been sent successfully. We will be in touch soon.",
      });

      // Clear form on success
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: subjectOptions[0]?.value || "general",
        message: "",
        botField: "",
      });
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();

      // Reset the button submitted state after 4 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 4000);
    } catch (err: any) {
      // Preserve form values on error
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(
    () => {
      let splitInstances: SplitType[] = [];

      const init = () => {
        if (!sectionRef.current) return;

        const elements = sectionRef.current.querySelectorAll(".split");
        if (!elements || elements.length === 0) return;

        gsap.set(elements, { opacity: 1 });

        const allLines: HTMLElement[] = [];

        elements.forEach((el) => {
          const text = new SplitType(el as HTMLElement, {
            types: "words,lines",
            lineClass: "line",
          });
          splitInstances.push(text);

          text.lines?.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.style.overflow = "hidden";
            wrapper.style.display = "block";

            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);

            if (line.closest(".gradient-text")) {
              line.style.backgroundImage =
                "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)";
              line.style.webkitBackgroundClip = "text";
              line.style.webkitTextFillColor = "transparent";
              line.style.backgroundClip = "text";
            }

            allLines.push(line);
          });

          const gradientParent = el.closest(".gradient-text") as HTMLElement;
          if (gradientParent && el === gradientParent) {
            gradientParent.style.background = "none";
            gradientParent.style.webkitTextFillColor = "initial";
          }
        });

        if (allLines.length > 0) {
          gsap.fromTo(
            allLines,
            { yPercent: 120 },
            {
              yPercent: 0,
              stagger: 0.08,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                scrub: true,
                start: "clamp(top 85%)",
                end: "clamp(top 35%)",
              },
            }
          );
        }

        const submitBtn = sectionRef.current.querySelector(".submit-btn-wrap");
        if (submitBtn) {
          gsap.fromTo(
            submitBtn,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "expo.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        }
      };

      let isMounted = true;

      if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (!isMounted || !sectionRef.current) return;
          init();
          try {
            ScrollTrigger?.refresh?.();
          } catch {
            // Ignore
          }
        });
      } else {
        init();
        try {
          ScrollTrigger?.refresh?.();
        } catch {
          // Ignore
        }
      }

      return () => {
        isMounted = false;
        splitInstances.forEach((t) => t.revert());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative mx-auto pt-20 pb-72 px-[100px] w-full overflow-visible no-global-reveal"
      style={{
        background:
          "radial-gradient(ellipse 75% 75% at 0% 0%, rgba(217, 70, 239, 0.14) 0%, rgba(217, 70, 239, 0) 70%)",
      }}
    >
      {/* Rectangle 180 - Figma radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
      />

      {/* Main Contact Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start relative z-10 mb-16 lg:mb-20">
        {/* Left - Heading & Subtitle */}
        <div>
          <p
            className="mb-3 font-semibold uppercase text-[12px] tracking-[4px] split"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#a2f4fd",
            }}
          >
            {d.SectionLabel}
          </p>
          <h2
            className="mb-6 font-anton text-4xl sm:text-5xl lg:text-[60px] leading-[1.0] uppercase split gradient-text"
            style={{
              background:
                "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {d.Title}
          </h2>
          <p
            className="text-sm sm:text-base leading-[24px] tracking-tight text-[#5e6670] max-w-[527px] split"
            style={{
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            {d.Description}
          </p>

          {/* Contact Info */}
          <div className="mt-8 flex flex-col gap-3">
            {d.Email && (
              <p className="text-sm text-white/70" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {d.Email}
              </p>
            )}
            {d.Phone && (
              <p className="text-sm text-white/70" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {d.Phone}
              </p>
            )}
            {d.Address && (
              <p className="text-sm text-white/70" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {d.Address}
              </p>
            )}
          </div>
        </div>

        {/* Right - Glassmorphism Form Card */}
        {form && (
          <div
            className="rounded-[20px] p-8 sm:p-10 border border-[#f4a8ff]/20 bg-white/[0.02] backdrop-blur-md relative"
            style={{
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            }}
          >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Honeypot field for bot protection */}
              <input
                type="text"
                name="botField"
                value={formData.botField}
                onChange={handleInputChange}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <FormInput
                label={form.FullNameLabel}
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={form.FullNamePlaceholder}
                disabled={isSubmitting}
                required
              />
              <FormInput
                label={form.EmailLabel}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={form.EmailPlaceholder}
                disabled={isSubmitting}
                required
              />
              <FormInput
                label={form.PhoneLabel}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={form.PhonePlaceholder}
                disabled={isSubmitting}
                required
              />
              <FormSelect
                label={form.SubjectLabel}
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                options={subjectOptions}
              />
              <FormTextarea
                label={form.MessageLabel}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={form.MessagePlaceholder}
                disabled={isSubmitting}
                required
              />
              {/* ReCAPTCHA */}
              <div className="w-full mt-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(token) => setRecaptchaToken(token)}
                  theme="dark"
                />
              </div>
              {/* Status Alert Banner right above submit button for immediate visibility */}
              {statusMessage && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold border flex items-center gap-3 transition-all duration-300 ${
                    statusMessage.type === "success"
                      ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                      : "bg-rose-500/15 border-rose-400/40 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.25)]"
                  }`}
                  role="alert"
                >
                  {statusMessage.type === "success" ? (
                    <svg className="w-5 h-5 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="leading-relaxed">{statusMessage.text}</span>
                </div>
              )}

              <div className="submit-btn-wrap w-full mt-2">
                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-[54px] rounded-full flex items-center justify-center font-bold text-sm text-[#05070d] transition-[box-shadow,transform,background] duration-300 ${
                    isSubmitting
                      ? "cursor-wait opacity-90"
                      : isSubmitted
                      ? "bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                      : "hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  }`}
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    background: isSubmitted
                      ? "linear-gradient(90deg, #6ee7b7 0%, #a7f3d0 50%, #34d399 100%)"
                      : "linear-gradient(90deg, #a2f4fd 0%, #a4f4cf 50%, #f6cfff 100%)",
                    boxShadow: isSubmitted
                      ? "0 0 54px rgba(52, 211, 153, 0.4)"
                      : "0 0 54px rgba(34, 211, 238, 0.25)",
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 font-bold tracking-wide">
                      <svg
                        className="animate-spin h-5 w-5 text-[#05070d]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Submitting Form...
                    </span>
                  ) : isSubmitted ? (
                    <span className="flex items-center gap-2 font-bold text-[#05070d] tracking-wide">
                      <svg className="w-5 h-5 text-[#05070d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Form Submitted Successfully!
                    </span>
                  ) : (
                    form.SubmitButton?.label ?? "Send Message"
                  )}
                </MagneticButton>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
