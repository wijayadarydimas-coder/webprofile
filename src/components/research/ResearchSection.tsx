import Link from "next/link";
import { Cpu, Bell, ShieldCheck, ArrowRight, FileText } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import ProviderBadge from "@/components/ui/ProviderBadge";
import type { ResearchItem } from "@/types";
import { isSafeUrl } from "@/lib/security/sanitize";

interface ResearchSectionProps {
  research: ResearchItem;
}

export default function ResearchSection({ research }: ResearchSectionProps) {
  const hasRepo = isSafeUrl(research.repoUrl);
  const pdfHref = research.pdfUrl?.startsWith("data:application/pdf;base64,")
    ? `/api/research/${research.id}/pdf`
    : research.pdfUrl;
  const hasPdf = Boolean(pdfHref && (pdfHref.startsWith("/") || isSafeUrl(pdfHref)));

  return (
    <section id="research" className="py-24 md:py-32 border-t border-[#1C202B] relative z-10">
      <div className="container-custom flex flex-col gap-12 lg:gap-16">
        {/* Section Header */}
        <div className="flex flex-col gap-3 max-w-3xl">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-medium text-[#7790FF] uppercase tracking-wider">
              Penelitian Skripsi
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#7790FF]/15 text-[#96A9FF] border border-[#7790FF]/30">
              {research.publishedStatus}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F1F2F5] tracking-tight leading-snug">
            {research.title}
          </h2>
          <p className="text-sm sm:text-base text-[#A1A6B5] leading-relaxed">
            {research.summary}
          </p>
        </div>

        {/* Technical Architecture Feature Cards with Subtle CV Motifs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="card-surface p-6 sm:p-7 flex flex-col justify-between gap-4 group">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#1F2330] border border-[#292D39] flex items-center justify-center text-[#7790FF] group-hover:border-[#7790FF]/50 transition-colors">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-[#7D8496]">ARCH//01</span>
              </div>
              <h3 className="text-base font-semibold text-[#F1F2F5]">Modifikasi Arsitektur</h3>
              <p className="text-xs sm:text-sm text-[#A1A6B5] leading-relaxed">
                Penyesuaian ekstraksi fitur multi-skala pada modul neck dan backbone YOLOv11 guna meningkatkan sensitivitas deteksi objek berdimensi kecil (seperti sarung tangan dan sepatu).
              </p>
            </div>
          </div>

          <div className="card-surface p-6 sm:p-7 flex flex-col justify-between gap-4 group">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#1F2330] border border-[#292D39] flex items-center justify-center text-[#96A9FF] group-hover:border-[#96A9FF]/50 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-[#7D8496]">DET//04</span>
              </div>
              <h3 className="text-base font-semibold text-[#F1F2F5]">4 Kelas APD Industri</h3>
              <p className="text-xs sm:text-sm text-[#A1A6B5] leading-relaxed">
                Klasifikasi simultan untuk helm proyek, rompi visibilitas tinggi, sarung tangan pelindung, dan sepatu keselamatan kerja pada berbagai sudut kamera pengawas.
              </p>
            </div>
          </div>

          <div className="card-surface p-6 sm:p-7 flex flex-col justify-between gap-4 group">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#1F2330] border border-[#292D39] flex items-center justify-center text-[#22C55E] group-hover:border-[#22C55E]/50 transition-colors">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-[#7D8496]">ALARM//AUTO</span>
              </div>
              <h3 className="text-base font-semibold text-[#F1F2F5]">Integrasi Alarm Otomatis</h3>
              <p className="text-xs sm:text-sm text-[#A1A6B5] leading-relaxed">
                Mekanisme pemicu sinyal audio-visual instan ketika algoritma mendeteksi ketidaklengkapan APD pada zona kerja berbahaya, mendukung kepatuhan K3 real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1C202B]">
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96A9FF] hover:text-[#F1F2F5] transition-colors group"
          >
            <span>Buka Halaman Rincian Penelitian</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-3">
            {hasRepo && (
              <a
                href={research.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 px-3"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Repository Penelitian</span>
              </a>
            )}

            {hasPdf && (
              <a
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 px-3"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dokumen PDF</span>
              </a>
            )}

            {/* Dynamic External Platform Badges (Roboflow, Hugging Face, etc.) */}
            {research.externalLinks &&
              research.externalLinks.map((link, idx) => (
                <ProviderBadge key={`${link.provider}-${idx}`} link={link} size="sm" />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
