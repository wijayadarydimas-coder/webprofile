"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, Heart } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#101114] border-t border-[#2B2D34] mt-24 py-12 text-sm text-[#A1A1AA]">
      <div className="container-custom flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#202228]">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-[#F3F4F6]">Wijaya Dary Dimas</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#1B1D23] border border-[#2B2D34] text-[#A1A1AA] font-mono">
                S1 Teknik Informatika
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
            <span>&copy; {currentYear} Wijaya Dary Dimas. Seluruh hak cipta dilindungi.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/wijayadarydimas-coder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#F3F4F6] transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-[#F3F4F6] transition-colors cursor-pointer"
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
