"use client";

import Link from "next/link";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { SiteProfile } from "@/types";
import Hero3DCanvas from "./Hero3DCanvas";

interface HeroSectionProps {
  profile: SiteProfile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section id="home" className="relative z-10 pt-36 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Ambient Dark Matter subtle light falloff behind 3D focal visual */}
      <div
        className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-[#7790FF]/[0.04] blur-[150px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Focus & Calls to Action */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            {/* Status indicator badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#171A24] border border-[#292D39] w-fit shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs font-mono text-[#A1A6B5] tracking-wide">
                {profile.statusText || "Pranata Komputer di BIG & Riset YOLOv11 APD"}
              </span>
            </div>

            {/* Main Typographic Focus: Name & Headline */}
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F1F2F5] leading-[1.05]">
                {profile.fullName}
              </h1>
              <p className="text-lg sm:text-2xl text-[#96A9FF] font-medium tracking-tight leading-snug">
                {profile.headline}
              </p>
            </div>

            {/* Short Bio Description */}
            <p className="text-sm sm:text-base text-[#A1A6B5] leading-relaxed max-w-xl">
              {profile.shortBio}
            </p>

            {/* Calls to Action */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link href="/projects" className="btn-primary">
                <span>Jelajahi Proyek</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {profile.cvUrl ? (
                <a
                  href="/api/profile/cv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <FileText className="w-4 h-4 text-[#A1A6B5]" />
                  <span>Lihat CV</span>
                </a>
              ) : (
                <button
                  onClick={() => alert("CV dapat diunggah melalui Admin Dashboard")}
                  className="btn-secondary"
                >
                  <FileText className="w-4 h-4 text-[#A1A6B5]" />
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#171A24] border border-[#7790FF]/30 text-xs font-medium text-[#96A9FF] hover:bg-[#7790FF]/15 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7790FF]" />
                <span>Asisten AI</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Geometric Focal Wireframe Object */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[420px] flex flex-col items-center">
              <Hero3DCanvas />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
