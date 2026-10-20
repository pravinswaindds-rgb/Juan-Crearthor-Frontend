"use client";

import { Heading, FormInput, FormSelect, FormTextarea } from "@/components/ui";
import type { StrapiContactPageFormSection, StrapiMapSection, StrapiProject } from "@/types/strapi";
import { getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useRef } from "react";

interface ContactFormProps {
  data?: StrapiContactPageFormSection | null;
  mapData?: StrapiMapSection | null;
  projects?: StrapiProject[];
}

export default function ContactForm({ data, projects = [] }: ContactFormProps) {
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
  if (data?.ContactForm?.SubjectOptions && typeof data.ContactForm.SubjectOptions === "string") {
    const parsedOptions = data.ContactForm.SubjectOptions.split(",")
      .map((opt) => opt.trim())
      .filter(Boolean);
    if (parsedOptions.length > 0 && !parsedOptions.includes("General Inquiry")) {
      subjectOptions = [
        ...parsedOptions.map((opt) => ({
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

      // Reset button submitted state after 4 seconds
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

  // Sort contact items by Order
  const contactItems = [...(data?.Items || [])].sort((a, b) => (a.Order || 0) - (b.Order || 0));

  return (
    <section
      id="contact-form"
      className="py-16 px-6 lg:px-10 max-w-[1440px] mx-auto no-global-reveal scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left Side: Contact Info */}
        <div className="flex flex-col pt-4">
          <Heading level={2} gradient className="mb-4 text-[40px] leading-none uppercase">
            {data?.Title || "Contact Us For Your Personal Queries"}
          </Heading>

          {data?.Description && (
            <p className="text-sm text-text-muted mb-12 leading-relaxed max-w-md">
              {data.Description}
            </p>
          )}

          <div className="flex flex-col gap-8">
            {contactItems.length > 0 ? (
              contactItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full border border-cyan-light/30 bg-[#05070d] flex items-center justify-center">
                    {item.Icon?.url ? (
                      <Image
                        src={getStrapiMedia(item.Icon.url) || ""}
                        alt={item.Icon.alternativeText || item.Label}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-cyan-light" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-bold text-white text-xs mb-1">{item.Label}:</span>
                    {item.Link ? (
                      item.Type?.toLowerCase() === "email" ? (
                        <a
                          href={`mailto:${item.Link}`}
                          className="text-text-muted text-sm hover:text-cyan transition-colors break-all"
                        >
                          {item.Link}
                        </a>
                      ) : item.Type?.toLowerCase() === "phone" ? (
                        <a
                          href={`tel:${item.Link}`}
                          className="text-text-muted text-sm hover:text-cyan transition-colors"
                        >
                          {item.Link}
                        </a>
                      ) : (
                        <span className="text-text-muted text-sm leading-relaxed">{item.Link}</span>
                      )
                    ) : (
                      <span className="text-text-muted text-sm leading-relaxed">{item.Label}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              /* Fallback */
              <div className="text-sm text-text-muted">Contact details loading...</div>
            )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div
          className="rounded-3xl p-8 lg:p-10"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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

            <div>
              <label className="block text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                {data?.ContactForm?.FullNameLabel || "Full Name"} <span className="text-red-500">*</span>
              </label>
              <FormInput
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={data?.ContactForm?.FullNamePlaceholder || "Your name"}
                className="bg-[#0b0e14] border-transparent rounded-xl focus:border-cyan-light/30"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                {data?.ContactForm?.EmailLabel || "Email"} <span className="text-red-500">*</span>
              </label>
              <FormInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={data?.ContactForm?.EmailPlaceholder || "you@company.com"}
                className="bg-[#0b0e14] border-transparent rounded-xl focus:border-cyan-light/30"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                {data?.ContactForm?.PhoneLabel || "Phone"} <span className="text-red-500">*</span>
              </label>
              <FormInput
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={data?.ContactForm?.PhonePlaceholder || "+1 717 288 6972"}
                className="bg-[#0b0e14] border-transparent rounded-xl focus:border-cyan-light/30"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                {data?.ContactForm?.SubjectLabel || "Subject"} <span className="text-red-500">*</span>
              </label>
              <FormSelect
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                options={subjectOptions}
                className="bg-[#0b0e14] border-transparent rounded-xl focus:border-cyan-light/30"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                {data?.ContactForm?.MessageLabel || "Message"} <span className="text-red-500">*</span>
              </label>
              <FormTextarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder={data?.ContactForm?.MessagePlaceholder || "Tell us what you want to build"}
                className="bg-[#0b0e14] border-transparent rounded-xl focus:border-cyan-light/30"
                disabled={isSubmitting}
                required
              />
            </div>

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

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 w-full py-4 rounded-full font-bold text-sm text-[#05070d] tracking-wide transition-all duration-300 ${
                isSubmitting
                  ? "cursor-wait opacity-90"
                  : isSubmitted
                  ? "bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                  : "hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(162,244,253,0.3)] cursor-pointer"
              }`}
              style={{
                background: isSubmitted
                  ? "linear-gradient(90deg, #6ee7b7 0%, #a7f3d0 50%, #34d399 100%)"
                  : "linear-gradient(90deg, #a2f4fd 0%, #f6cfff 50%, #a4f4cf 100%)",
                boxShadow: isSubmitted
                  ? "0 0 54px rgba(52, 211, 153, 0.4)"
                  : undefined,
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2 font-bold tracking-wide">
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
                <span className="flex items-center justify-center gap-2 font-bold text-[#05070d] tracking-wide">
                  <svg className="w-5 h-5 text-[#05070d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Form Submitted Successfully!
                </span>
              ) : (
                data?.ContactForm?.SubmitButton?.label || "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
