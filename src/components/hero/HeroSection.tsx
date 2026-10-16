"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { SiteProfile } from "@/types";
import Hero3DCanvas from "./Hero3DCanvas";

interface HeroSectionProps {
  profile: SiteProfile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background glow accent */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#6D8DFF]/10 blur-[120px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            {/* Status indicator badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15171C] border border-[#2B2D34] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs font-mono text-[#A1A1AA]">
                {profile.statusText || "Pranata Komputer di BIG & Riset YOLOv11 APD"}
              </span>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F3F4F6] leading-[1.1]">
                {profile.fullName}
              </h1>
              <p className="text-lg sm:text-xl text-[#8B9CFF] font-medium tracking-tight">
                {profile.headline}
              </p>
            </div>

            {/* Short Bio Description */}
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl">
              {profile.shortBio}
            </p>

            {/* CTAs and Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/projects" className="btn-primary">
                <span>Jelajahi Proyek</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {profile.cvUrl ? (
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <FileText className="w-4 h-4 text-[#A1A1AA]" />
                  <span>Lihat CV</span>
                </a>
              ) : (
                <button
                  onClick={() => alert("CV dapat diunggah melalui Admin Dashboard")}
                  className="btn-secondary"
                >
                  <FileText className="w-4 h-4 text-[#A1A1AA]" />
                  <span>Lihat CV</span>
                </button>
              )}

              <a
                href={profile.githubUrl || "https://github.com/wijayadarydimas-coder"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-3.5"
                title="Kunjungi GitHub Wijaya Dary Dimas"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-ai-modal"))}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1B1D23] border border-[#6D8DFF]/30 text-xs font-medium text-[#8B9CFF] hover:bg-[#6D8DFF]/15 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#6D8DFF]" />
                <span>Asisten AI</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Geometric Visual & Profile Photo Badge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[380px] flex flex-col items-center">
              {/* 3D Canvas element */}
              <div className="w-full">
                <Hero3DCanvas />
              </div>

              {/* Verified profile portrait card floating below 3D accent */}
              <div className="mt-4 flex items-center gap-3.5 p-3 rounded-xl bg-[#15171C]/90 backdrop-blur-md border border-[#2B2D34] shadow-xl w-full max-w-[320px]">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#1B1D23] border border-[#2B2D34] shrink-0 flex items-center justify-center">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.avatarAlt || "Foto Profil Wijaya Dary Dimas"}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-mono font-bold text-sm text-[#8B9CFF]">WDD</span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#F3F4F6] truncate">
                    {profile.fullName}
                  </span>
                  <span className="text-[11px] text-[#A1A1AA] truncate">
                    Teknik Informatika &bull; UMP
                  </span>
                  <span className="text-[10px] text-[#71717A] truncate font-mono">
                    {profile.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
