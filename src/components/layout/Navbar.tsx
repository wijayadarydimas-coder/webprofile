"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Menu, X, Shield, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenAi: () => void;
}

export default function Navbar({ onOpenAi }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in as admin
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/projects" },
    { name: "Experience", href: "/#experience" },
    { name: "Research", href: "/research" },
    { name: "Community", href: "/community" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#101114]/90 backdrop-blur-md border-b border-[#2B2D34] shadow-lg shadow-black/20 py-3"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-decoration-none focus:outline-none"
          aria-label="Wijaya Dary Dimas Homepage"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1B1D23] border border-[#2B2D34] flex items-center justify-center font-mono font-bold text-sm text-[#F3F4F6] group-hover:border-[#6D8DFF] transition-colors">
            W
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-[#F3F4F6] group-hover:text-[#6D8DFF] transition-colors">
              Wijaya Dary Dimas
            </span>
            <span className="text-[10px] text-[#71717A] font-mono leading-none">
              Informatics &amp; CV Engineer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "text-[#F3F4F6] bg-[#1B1D23] border border-[#2B2D34]"
                    : "text-[#A1A1AA] hover:text-[#F3F4F6] hover:bg-[#15171C]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions: AI Assistant & Admin (if authorized) */}
        <div className="flex items-center gap-2.5">
          {/* AI Assistant Trigger Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15171C] hover:bg-[#1B1D23] border border-[#2B2D34] hover:border-[#6D8DFF]/40 text-xs font-medium text-[#F3F4F6] transition-all cursor-pointer group shadow-sm"
            aria-label="Tanya AI Assistant"
            title="Tanya seputar profil & proyek Wijaya Dary Dimas"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6D8DFF] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Admin badge link if logged in */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#6D8DFF]/10 border border-[#6D8DFF]/30 text-xs font-medium text-[#8B9CFF] hover:bg-[#6D8DFF]/20 transition-colors"
              title="Akses Dashboard Admin"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-[#15171C] border border-[#2B2D34] text-[#A1A1AA] hover:text-[#F3F4F6] transition-colors cursor-pointer"
            aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#101114]/98 backdrop-blur-xl border-b border-[#2B2D34] py-4 px-6 shadow-2xl transition-all">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#A1A1AA] hover:text-[#F3F4F6] hover:bg-[#1B1D23] transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-[#2B2D34] flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAi();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B1D23] border border-[#6D8DFF]/40 text-sm font-medium text-[#F3F4F6]"
              >
                <Bot className="w-4 h-4 text-[#6D8DFF]" />
                Tanya Asisten AI
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#6D8DFF]/15 border border-[#6D8DFF]/30 text-sm font-medium text-[#8B9CFF]"
                >
                  <Shield className="w-4 h-4" />
                  Buka Panel Admin
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
