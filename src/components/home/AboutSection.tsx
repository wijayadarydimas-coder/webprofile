import Image from "next/image";
import { FileText, GraduationCap, Briefcase, Cpu, MapPin } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { SiteProfile, Education, Experience, ResearchItem } from "@/types";

interface AboutSectionProps {
  profile: SiteProfile;
  primaryEducation?: Education;
  primaryExperience?: Experience;
  primaryResearch?: ResearchItem;
}

export default function AboutSection({
  profile,
  primaryEducation,
  primaryExperience,
  primaryResearch,
}: AboutSectionProps) {
  return (
    <section id="about" className="py-24 md:py-32 border-t border-[#1C202B] relative z-10">
      <div className="container-custom">
        <div className="flex flex-col gap-12 lg:gap-16">
          {/* Section Header */}
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-xs font-mono font-medium text-[#7790FF] uppercase tracking-wider">
              Tentang Saya
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F1F2F5] tracking-tight">
              {profile.aboutTitle || "Profil, Prinsip Belajar & Fokus Teknis"}
            </h2>
          </div>

          {/* Editorial Split Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Rectangular Editorial Portrait (approx 40% width) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="group relative w-full aspect-[4/5] max-w-[390px] mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-[#171A24] border border-[#292D39] shadow-2xl transition-all duration-700 ease-out hover:border-[#7790FF]/40">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.avatarAlt || `Foto Potret ${profile.fullName}`}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-sm text-[#7D8496]">
                    Foto Profil Tidak Tersedia
                  </div>
                )}

                {/* Subtle dark gradient overlay at the base for grounding */}
                <div
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/40 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Editorial verified badge inside photo */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#F1F2F5] text-sm drop-shadow-md">
                      {profile.fullName}
                    </span>
                    <span className="text-[11px] text-[#A1A6B5] drop-shadow-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#7790FF]" />
                      {profile.location || "Purwokerto, Indonesia"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-card: Core technical discipline */}
              <div className="max-w-[390px] mx-auto lg:mx-0 w-full px-4 py-3 rounded-xl bg-[#171A24]/60 border border-[#292D39] flex items-center justify-between text-xs text-[#A1A6B5]">
                <span className="font-mono text-[#7D8496]">Spesialisasi</span>
                <span className="font-medium text-[#F1F2F5]">{profile.roleTitle || "Informatics & CV Engineer"}</span>
              </div>
            </div>

            {/* Right Column: Biography Narrative & Structured Technical Timeline */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Biography narrative */}
              <div className="flex flex-col gap-4 text-sm sm:text-base text-[#A1A6B5] leading-relaxed">
                {profile.aboutMe.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Direct Profile Links */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href={profile.githubUrl || "https://github.com/wijayadarydimas-coder"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#F1F2F5] hover:text-[#7790FF] transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>

                {profile.cvUrl && (
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium text-[#F1F2F5] hover:text-[#7790FF] transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Unduh Resume / CV</span>
                  </a>
                )}
              </div>

              {/* Structured Summary Cards (Dynamic from database) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#171A24] border border-[#292D39] flex flex-col gap-2 hover:border-[#7790FF]/30 transition-colors">
                  <div className="flex items-center gap-2 text-[#7790FF]">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-semibold uppercase">Pendidikan</span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-xs font-semibold text-[#F1F2F5] leading-snug line-clamp-1"
                      title={primaryEducation?.institution || "Universitas Muhammadiyah Purwokerto"}
                    >
                      {primaryEducation?.institution || "Universitas Muhammadiyah Purwokerto"}
                    </span>
                    <span className="text-[11px] text-[#A1A6B5] mt-1 line-clamp-1">
                      {primaryEducation?.degree
                        ? `${primaryEducation.degree}${primaryEducation.period ? ` · ${primaryEducation.period}` : ""}`
                        : "S1 Teknik Informatika"}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#171A24] border border-[#292D39] flex flex-col gap-2 hover:border-[#7790FF]/30 transition-colors">
                  <div className="flex items-center gap-2 text-[#96A9FF]">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-semibold uppercase">Pengalaman</span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-xs font-semibold text-[#F1F2F5] leading-snug line-clamp-1"
                      title={primaryExperience?.organization || "Badan Informasi Geospasial"}
                    >
                      {primaryExperience?.organization || "Badan Informasi Geospasial"}
                    </span>
                    <span className="text-[11px] text-[#A1A6B5] mt-1 line-clamp-1">
                      {primaryExperience?.role
                        ? `${primaryExperience.role}${primaryExperience.period ? ` (${primaryExperience.period})` : ""}`
                        : "Pranata Komputer (2025–2026)"}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#171A24] border border-[#292D39] flex flex-col gap-2 hover:border-[#7790FF]/30 transition-colors">
                  <div className="flex items-center gap-2 text-[#22C55E]">
                    <Cpu className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-semibold uppercase">
                      {primaryResearch?.publishedStatus || "Penelitian Skripsi"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-xs font-semibold text-[#F1F2F5] leading-snug line-clamp-2"
                      title={primaryResearch?.title || "Deteksi APD YOLOv11"}
                    >
                      {primaryResearch?.title || "Deteksi APD YOLOv11"}
                    </span>
                    <span className="text-[11px] text-[#7D8496] mt-1 line-clamp-1">
                      {primaryResearch?.modelModification || "Modifikasi Arsitektur YOLOv11 & Alarm"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
