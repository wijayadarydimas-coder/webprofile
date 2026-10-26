"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, TikTokIcon } from "@/components/ui/Icons";
import type { SiteProfile } from "@/types";

interface ContactSectionProps {
  profile: SiteProfile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", hp: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus({
        type: "success",
        message: "Your message has been sent successfully! Thank you for reaching out.",
      });
      setFormData({ name: "", email: "", message: "", hp: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 border-t border-[#1C202B] relative z-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          {/* Left Column: Direct Info & Social Channels */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-medium text-[#7790FF] uppercase tracking-wider">
                CONTACT
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F1F2F5] tracking-tight">
                Get In Touch
              </h2>
              <p className="text-sm text-[#A1A6B5] leading-relaxed">
                I am open to discussing engineering ideas, technical consultations, or exploring potential collaboration opportunities. Feel free to connect via any of the channels below.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-4 rounded-xl bg-[#171A24] border border-[#292D39] hover:border-[#7790FF]/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#1F2330] text-[#7790FF] group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-[#7D8496]">Official Email</span>
                      <span className="text-xs sm:text-sm font-medium text-[#F1F2F5] truncate">
                        {profile.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#96A9FF] font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">
                    Send Email &rarr;
                  </span>
                </a>
              ) : null}

              <a
                href={profile.githubUrl || "https://github.com/wijayadarydimas-coder"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#171A24] border border-[#292D39] hover:border-[#7790FF]/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#1F2330] text-[#F1F2F5]">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#7D8496]">GitHub Profile</span>
                    <span className="text-xs sm:text-sm font-medium text-[#F1F2F5]">
                      @wijayadarydimas-coder
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#96A9FF] font-medium">Visit Profile &rarr;</span>
              </a>

              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-[#171A24] border border-[#292D39] hover:border-[#7790FF]/40 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1F2330] text-[#0A66C2]">
                      <LinkedinIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#7D8496]">LinkedIn</span>
                      <span className="text-xs sm:text-sm font-medium text-[#F1F2F5]">
                        {profile.fullName || "LinkedIn Profile"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#96A9FF] font-medium">Visit Profile &rarr;</span>
                </a>
              )}

              {profile.instagramUrl && (
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-[#171A24] border border-[#292D39] hover:border-[#E1306C]/40 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1F2330] text-[#E1306C]">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#7D8496]">Instagram</span>
                      <span className="text-xs sm:text-sm font-medium text-[#F1F2F5]">
                        @{profile.instagramUrl.split("/").filter(Boolean).pop()?.replace(/^@/, "") || "Instagram"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#96A9FF] font-medium">Visit Profile &rarr;</span>
                </a>
              )}

              {profile.tiktokUrl && (
                <a
                  href={profile.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-[#171A24] border border-[#292D39] hover:border-[#25F4EE]/40 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1F2330] text-[#25F4EE]">
                      <TikTokIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#7D8496]">TikTok</span>
                      <span className="text-xs sm:text-sm font-medium text-[#F1F2F5]">
                        @{profile.tiktokUrl.split("/").filter(Boolean).pop()?.replace(/^@/, "") || "TikTok"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#96A9FF] font-medium">Visit Profile &rarr;</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#171A24] border border-[#292D39] shadow-xl">
              <h3 className="text-lg font-semibold text-[#F1F2F5] mb-1">Send a Direct Message</h3>
              <p className="text-xs text-[#7D8496] mb-6">
                Messages are delivered directly to the inbox and will be answered via your email.
              </p>

              {status.type && (
                <div
                  className={`p-3.5 rounded-lg mb-5 flex items-start gap-2.5 text-xs ${
                    status.type === "success"
                      ? "bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]"
                      : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="hp"
                  value={formData.hp}
                  onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-xs font-medium text-[#A1A6B5]">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="px-3.5 py-2.5 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] placeholder-[#7D8496] focus:border-[#7790FF] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-xs font-medium text-[#A1A6B5]">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="yourname@domain.com"
                      className="px-3.5 py-2.5 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] placeholder-[#7D8496] focus:border-[#7790FF] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-xs font-medium text-[#A1A6B5]">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Have questions, ideas, or feedback? Leave your message here..."
                    className="px-3.5 py-2.5 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] placeholder-[#7D8496] focus:border-[#7790FF] focus:outline-none transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-fit mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "Sending Message..." : "Send Message"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
