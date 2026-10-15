import Link from "next/link";
import { Cpu, Bell, ShieldCheck, ArrowRight, FileText } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { ResearchItem } from "@/types";
import { isSafeUrl } from "@/lib/security/sanitize";

interface ResearchSectionProps {
  research: ResearchItem;
}

export default function ResearchSection({ research }: ResearchSectionProps) {
  const hasRepo = isSafeUrl(research.repoUrl);
  const hasPdf = isSafeUrl(research.pdfUrl);

  return (
    <section id="research" className="py-20 border-t border-[#202228]">
      <div className="container-custom flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[#6D8DFF] uppercase tracking-wider">
              Fokus Penelitian Skripsi
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#6D8DFF]/15 text-[#8B9CFF] border border-[#6D8DFF]/30">
              {research.publishedStatus}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] tracking-tight">
            {research.title}
          </h2>
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            {research.summary}
          </p>
        </div>

        {/* Technical Architecture Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-surface p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1B1D23] border border-[#2B2D34] flex items-center justify-center text-[#6D8DFF]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#F3F4F6]">Modifikasi Arsitektur</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Penyesuaian ekstraksi fitur multi-skala pada modul neck dan backbone YOLOv11 guna meningkatkan sensitivitas deteksi objek berdimensi kecil (seperti sarung tangan dan sepatu).
            </p>
          </div>

          <div className="card-surface p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1B1D23] border border-[#2B2D34] flex items-center justify-center text-[#8B9CFF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#F3F4F6]">4 Kelas APD Industri</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Klasifikasi simultan untuk helm proyek, rompi visibilitas tinggi, sarung tangan pelindung, dan sepatu keselamatan kerja pada berbagai sudut pengawasan.
            </p>
          </div>

          <div className="card-surface p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1B1D23] border border-[#2B2D34] flex items-center justify-center text-[#22C55E]">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#F3F4F6]">Integrasi Alarm Otomatis</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Mekanisme pemicu alarm peringatan instan ketika algoritma mendeteksi ketidaklengkapan APD pada zona kerja berbahaya, mendukung kepatuhan K3 real-time.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#202228]">
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B9CFF] hover:text-[#F3F4F6] transition-colors"
          >
            <span>Buka Halaman Rincian Penelitian</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
                href={research.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 px-3"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dokumen PDF</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
