"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Bell, ShieldCheck, Database, Layers, FileText, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { isSafeUrl } from "@/lib/security/sanitize";
import type { ResearchItem } from "@/types";

interface Props {
  researchItems: ResearchItem[];
}

export default function ResearchViewer({ researchItems }: Props) {
  const [selectedId, setSelectedId] = useState<string>(
    researchItems[0]?.id || ""
  );

  const activeItem =
    researchItems.find((r) => r.id === selectedId) || researchItems[0];

  if (!activeItem) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="text-sm text-[#71717A]">Belum ada dokumentasi penelitian yang dipublikasikan.</p>
      </div>
    );
  }

  const hasRepo = isSafeUrl(activeItem.repoUrl);
  const hasPdf = isSafeUrl(activeItem.pdfUrl);

  return (
    <div className="pt-32 pb-24">
      <div className="container-custom max-w-4xl flex flex-col gap-10">
        {/* Back Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#71717A]">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[#8B9CFF] hover:text-[#F3F4F6] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <span>/</span>
          <span className="text-[#A1A1AA]">Penelitian &amp; Skripsi</span>
        </div>

        {/* Multi-Item Tabs (jika ada lebih dari 1 penelitian/skripsi) */}
        {researchItems.length > 1 && (
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#15171C] border border-[#2B2D34]">
            <span className="text-xs font-semibold text-[#F3F4F6]">Daftar Karya Riset &amp; Publikasi:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {researchItems.map((item, index) => {
                const isSelected = item.id === (activeItem?.id || "");
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#6D8DFF] text-white shadow-lg shadow-[#6D8DFF]/25 border border-[#6D8DFF]"
                        : "bg-[#1B1D23] text-[#A1A1AA] hover:text-[#F3F4F6] hover:bg-[#202228] border border-[#2B2D34]"
                    }`}
                  >
                    <span className="font-mono opacity-80">#{index + 1}</span>
                    <span className="max-w-[220px] truncate">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Title Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#6D8DFF]/15 text-[#8B9CFF] border border-[#6D8DFF]/30">
              {activeItem.publishedStatus || "Penelitian Skripsi"}
            </span>
            <span className="text-xs text-[#71717A] font-mono">
              Universitas Muhammadiyah Purwokerto &bull; Teknik Informatika
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3F4F6] tracking-tight leading-tight">
            {activeItem.title}
          </h1>

          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            {activeItem.summary}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {hasRepo && (
              <a
                href={activeItem.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2 px-4"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}

            {hasPdf && (
              <a
                href={activeItem.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 px-4"
              >
                <FileText className="w-4 h-4" />
                <span>Naskah PDF Lengkap</span>
              </a>
            )}
          </div>
        </div>

        {/* Research Modules Details */}
        <div className="flex flex-col gap-6">
          {/* Latar Belakang */}
          {activeItem.background && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#F59E0B]">
                <Layers className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">1. Latar Belakang Masalah</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {activeItem.background}
              </p>
            </div>
          )}

          {/* Tujuan Penelitian */}
          {activeItem.objective && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#6D8DFF]">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">2. Tujuan Penelitian &amp; Sasaran</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {activeItem.objective}
              </p>
            </div>
          )}

          {/* Modifikasi Model YOLOv11 */}
          {activeItem.modelModification && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#22C55E]">
                <Cpu className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">3. Modifikasi Arsitektur Model</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {activeItem.modelModification}
              </p>
            </div>
          )}

          {/* Metodologi */}
          {activeItem.methodology && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#8B9CFF]">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">4. Metodologi &amp; Alur Pengujian</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {activeItem.methodology}
              </p>
            </div>
          )}

          {/* Dataset & Kondisi Lapangan */}
          {activeItem.datasetNotes && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#A1A1AA]">
                <Database className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">5. Akuisisi Dataset &amp; Batasan Uji</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {activeItem.datasetNotes}
              </p>
            </div>
          )}

          {/* Alarm Automation Integration */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#EF4444]">
              <Bell className="w-5 h-5" />
              <h2 className="text-base font-bold text-[#F3F4F6]">6. Logika Integrasi Alarm Otomatis</h2>
            </div>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Output inferensi deteksi objek dipetakan ke aturan kepatuhan zona keselamatan kerja. Apabila seorang pekerja terdeteksi berada di dalam area bahaya tanpa perlengkapan APD esensial selama durasi ambang batas tertentu, sistem kontrol mengirim sinyal pemicu alarm peringatan (audio-visual) untuk mencegah risiko insiden secara preventif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
