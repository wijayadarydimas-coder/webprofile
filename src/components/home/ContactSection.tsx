"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Copy, Check, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
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
  const [copied, setCopied] = useState(false);

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
        throw new Error(data.error || "Gagal mengirimkan pesan.");
      }

      setStatus({
        type: "success",
        message: "Pesan Anda berhasil dikirimkan! Terima kasih atas komunikasinya.",
      });
      setFormData({ name: "", email: "", message: "", hp: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = () => {
    if (!profile.email) return;
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 border-t border-[#202228]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-medium text-[#6D8DFF] uppercase tracking-wider">
                Hubungi
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] tracking-tight">
                Mulai Diskusi &amp; Kolaborasi
              </h2>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Terbuka untuk diskusi seputar teknologi, penelitian computer vision, atau eksplorasi kesempatan kerja sama profesional.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              {profile.email ? (
                <div className="p-4 rounded-xl bg-[#15171C] border border-[#2B2D34] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#1B1D23] text-[#6D8DFF]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-[#71717A]">Email Resmi</span>
                      <span className="text-xs sm:text-sm font-medium text-[#F3F4F6] truncate">
                        {profile.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg hover:bg-[#1B1D23] text-[#A1A1AA] hover:text-[#F3F4F6] transition-colors"
                    title="Salin alamat email"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ) : null}

              <a
                href={profile.githubUrl || "https://github.com/wijayadarydimas-coder"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#15171C] border border-[#2B2D34] hover:border-[#6D8DFF]/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#1B1D23] text-[#F3F4F6]">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#71717A]">GitHub Profile</span>
                    <span className="text-xs sm:text-sm font-medium text-[#F3F4F6]">
                      @wijayadarydimas-coder
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#8B9CFF] font-medium">Kunjungi &rarr;</span>
              </a>

              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-[#15171C] border border-[#2B2D34] hover:border-[#6D8DFF]/40 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1B1D23] text-[#0A66C2]">
                      <LinkedinIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#71717A]">LinkedIn</span>
                      <span className="text-xs sm:text-sm font-medium text-[#F3F4F6]">
                        Profil Profesional
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#8B9CFF] font-medium">Kunjungi &rarr;</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34]">
              <h3 className="text-lg font-semibold text-[#F3F4F6] mb-1">Kirim Pesan Langsung</h3>
              <p className="text-xs text-[#71717A] mb-6">
                Pesan akan tersimpan langsung di inbox admin dan dibalas ke alamat email Anda.
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
                    <label htmlFor="contact-name" className="text-xs font-medium text-[#A1A1AA]">
                      Nama Lengkap
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama Anda"
                      className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] placeholder-[#71717A] focus:border-[#6D8DFF] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-xs font-medium text-[#A1A1AA]">
                      Alamat Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] placeholder-[#71717A] focus:border-[#6D8DFF] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-xs font-medium text-[#A1A1AA]">
                    Isi Pesan
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan pesan, pertanyaan, atau tawaran kerja sama Anda di sini..."
                    className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] placeholder-[#71717A] focus:border-[#6D8DFF] focus:outline-none transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-fit mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "Mengirimkan Pesan..." : "Kirimkan Pesan"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
