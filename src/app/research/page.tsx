import Link from "next/link";
import { ArrowLeft, Cpu, Bell, ShieldCheck, Database, Layers, FileText, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { db } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";
import { isSafeUrl } from "@/lib/security/sanitize";

export const metadata = {
  title: "Riset Skripsi YOLOv11 APD — Wijaya Dary Dimas",
  description:
    "Penelitian skripsi: Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis oleh Wijaya Dary Dimas di Universitas Muhammadiyah Purwokerto.",
};

export default async function ResearchPage() {
  const researchItems = await db.getResearchItems();
  const research = researchItems[0] || {
    title: "Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis.",
    summary: "Penelitian skripsi mengenai pengembangan model deteksi objek modifikasi YOLOv11 untuk mengidentifikasi 4 kelas APD.",
    background: "Tingginya angka kecelakaan kerja pada sektor konstruksi dan industri manufaktur sebagian besar dipicu oleh kelalaian pekerja.",
    objective: "Mengembangkan model deteksi modifikasi YOLOv11 yang efisien dalam mengklasifikasikan helm, rompi, sarung tangan, dan sepatu pelindung.",
    methodology: "Metodologi mencakup: studi literatur, akuisisi dan anotasi dataset APD, modifikasi arsitektur model YOLOv11, proses training dan validasi.",
    modelModification: "Optimalisasi penangkapan fitur multi-skala guna meminimalisir miss-detection pada objek berskala kecil.",
    datasetNotes: "Dataset dikurasi secara terarah mencakup beragam sudut pandang kamera pengawas dan pencahayaan.",
    publishedStatus: "Penelitian Skripsi",
    repoUrl: "https://github.com/wijayadarydimas-coder",
    pdfUrl: "",
  };

  const hasRepo = isSafeUrl(research.repoUrl);
  const hasPdf = isSafeUrl(research.pdfUrl);

  return (
    <AppShell>
      <div className="pt-32 pb-24">
        <div className="container-custom max-w-4xl flex flex-col gap-10">
          {/* Back Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#71717A]">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[#8B9CFF] hover:text-[#F3F4F6] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <span>/</span>
            <span className="text-[#A1A1AA]">Penelitian Skripsi</span>
          </div>

          {/* Title Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#6D8DFF]/15 text-[#8B9CFF] border border-[#6D8DFF]/30">
                {research.publishedStatus}
              </span>
              <span className="text-xs text-[#71717A] font-mono">
                Universitas Muhammadiyah Purwokerto &bull; Teknik Informatika
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3F4F6] tracking-tight leading-tight">
              {research.title}
            </h1>

            <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
              {research.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {hasRepo && (
                <a
                  href={research.repoUrl}
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
                  href={research.pdfUrl}
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
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#F59E0B]">
                <Layers className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">1. Latar Belakang Masalah</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {research.background}
              </p>
            </div>

            {/* Tujuan Penelitian */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#6D8DFF]">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">2. Tujuan Penelitian &amp; Sasaran</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {research.objective}
              </p>
            </div>

            {/* Modifikasi Model YOLOv11 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#22C55E]">
                <Cpu className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">3. Modifikasi Arsitektur YOLOv11</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {research.modelModification}
              </p>
            </div>

            {/* Metodologi */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#8B9CFF]">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">4. Metodologi &amp; Alur Pengujian</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {research.methodology}
              </p>
            </div>

            {/* Dataset & Kondisi Lapangan */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#A1A1AA]">
                <Database className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">5. Akuisisi Dataset &amp; Batasan Uji</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {research.datasetNotes}
              </p>
            </div>

            {/* Alarm Automation Integration */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[#EF4444]">
                <Bell className="w-5 h-5" />
                <h2 className="text-base font-bold text-[#F3F4F6]">6. Logika Integrasi Alarm Otomatis</h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Output inferensi dari 4 bounding box APD (helm, rompi, sarung tangan, sepatu) dipetakan ke aturan kepatuhan zona K3. Apabila seorang pekerja terdeteksi berada di dalam area bahaya tanpa salah satu atribut pelindung esensial selama durasi ambang batas tertentu, modul kontrol mengirim sinyal pemicu alarm peringatan (audio-visual) untuk mencegah risiko insiden secara preventif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
