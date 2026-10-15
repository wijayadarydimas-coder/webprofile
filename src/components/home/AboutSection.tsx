import Link from "next/link";
import { FileText, GraduationCap, Briefcase, Cpu } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { SiteProfile } from "@/types";

interface AboutSectionProps {
  profile: SiteProfile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 border-t border-[#202228]">
      <div className="container-custom">
        <div className="flex flex-col gap-12">
          {/* Section Header */}
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-xs font-mono font-medium text-[#6D8DFF] uppercase tracking-wider">
              Tentang Pemilik
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] tracking-tight">
              Profil, Prinsip Belajar &amp; Fokus Teknis
            </h2>
          </div>

          {/* Editorial Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
              {profile.aboutMe.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              <div className="flex items-center gap-4 pt-4">
                <a
                  href={profile.githubUrl || "https://github.com/wijayadarydimas-coder"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#F3F4F6] hover:text-[#6D8DFF] transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>

                {profile.cvUrl && (
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium text-[#F3F4F6] hover:text-[#6D8DFF] transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Unduh Resume / CV</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Summary Highlights Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-[#6D8DFF]">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs font-mono font-semibold uppercase">Pendidikan Terverifikasi</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#F3F4F6]">
                    Universitas Muhammadiyah Purwokerto
                  </span>
                  <span className="text-xs text-[#A1A1AA]">
                    Program Studi S1 Teknik Informatika
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-[#8B9CFF]">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs font-mono font-semibold uppercase">Pengalaman Kerja &amp; Praktik</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#F3F4F6]">
                    Badan Informasi Geospasial
                  </span>
                  <span className="text-xs text-[#A1A1AA]">
                    Pranata Komputer (Nov 2025 – Mei 2026)
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-[#22C55E]">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-mono font-semibold uppercase">Fokus Penelitian Skripsi</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#F3F4F6]">
                    Deteksi APD Real-Time &amp; Alarm Otomatis
                  </span>
                  <span className="text-xs text-[#A1A1AA]">
                    Modifikasi arsitektur YOLOv11 untuk keselamatan kerja industri
                  </span>
                </div>
                <Link
                  href="/research"
                  className="text-xs text-[#6D8DFF] hover:underline pt-1 w-fit"
                >
                  Baca rincian penelitian skripsi &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
