"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, TikTokIcon } from "@/components/ui/Icons";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [siteInfo, setSiteInfo] = useState<{
    brandName?: string;
    roleTitle?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
  }>({});

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    fetch("/api/site-info")
      .then((res) => res.json())
      .then((data) => setSiteInfo(data))
      .catch(() => {});
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const brand = siteInfo.brandName || "Wijaya Dary Dimas";
  const role = siteInfo.roleTitle || "Informatics & CV Engineer";

  return (
    <footer className="w-full bg-[#101114] border-t border-[#2B2D34] mt-24 py-12 text-sm text-[#A1A1AA]">
      <div className="container-custom flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#202228]">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-[#F3F4F6]">{brand}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#1B1D23] border border-[#2B2D34] text-[#A1A1AA] font-mono">
                {role}
              </span>
            </div>
            <p className="text-xs text-[#71717A] max-w-md">
              Exploring Technology. Building Ideas. Creating Impact.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/" className="hover:text-[#F3F4F6] transition-colors">
              Home
            </Link>
            <Link href="/projects" className="hover:text-[#F3F4F6] transition-colors">
              Projects
            </Link>
            <Link href="/research" className="hover:text-[#F3F4F6] transition-colors">
              Research &amp; Skripsi
            </Link>
            <Link href="/community" className="hover:text-[#F3F4F6] transition-colors">
              Community
            </Link>
            <Link href="/contact" className="hover:text-[#F3F4F6] transition-colors">
              Contact
            </Link>
            <Link href="/admin/login" className="text-[#71717A] hover:text-[#A1A1AA] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <div className="flex items-center gap-1.5">
            <span>&copy; {currentYear} {brand}. Seluruh hak cipta dilindungi.</span>
          </div>

          <div className="flex items-center gap-4">
            {siteInfo.githubUrl && (
              <a
                href={siteInfo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#F3F4F6] transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            )}

            {siteInfo.linkedinUrl && (
              <a
                href={siteInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#0A66C2] transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            )}

            {siteInfo.instagramUrl && (
              <a
                href={siteInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#E1306C] transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
            )}

            {siteInfo.tiktokUrl && (
              <a
                href={siteInfo.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#25F4EE] transition-colors"
                title="TikTok"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">TikTok</span>
              </a>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-[#F3F4F6] transition-colors cursor-pointer ml-2"
              title="Kembali ke atas"
              aria-label="Kembali ke atas halaman"
            >
              <span>Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
