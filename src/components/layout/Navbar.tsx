"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bot, Menu, X, Shield, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenAi: () => void;
}

interface NavItem {
  name: string;
  sectionId: string;
  pageHref: string;
}

export default function Navbar({ onOpenAi }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [branding, setBranding] = useState({
    brandName: "Wijaya Dary Dimas",
    roleTitle: "Informatics & CV Engineer",
    logoUrl: "",
  });

  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const navItems: NavItem[] = [
    { name: "Home", sectionId: "home", pageHref: "/" },
    { name: "About", sectionId: "about", pageHref: "/#about" },
    { name: "Projects", sectionId: "projects", pageHref: "/projects" },
    { name: "Experience", sectionId: "experience", pageHref: "/#experience" },
    { name: "Research", sectionId: "research", pageHref: "/research" },
    { name: "Community", sectionId: "community", pageHref: "/community" },
    { name: "Contact", sectionId: "contact", pageHref: "/contact" },
  ];

  useEffect(() => {
    // 1. Cek hak akses admin secara reaktif & no-store
    const checkAuth = () => {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          setIsAdmin(data?.user?.role === "admin");
        })
        .catch(() => {
          setIsAdmin(false);
        });
    };

    checkAuth();
    window.addEventListener("auth-changed", checkAuth);
    window.addEventListener("focus", checkAuth);

    // 2. Ambil branding kustom (Logo, Nama Brand, Sub-Title Profesi)
    fetch("/api/site-info")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setBranding({
            brandName: data.brandName || "Wijaya Dary Dimas",
            roleTitle: data.roleTitle || "Informatics & CV Engineer",
            logoUrl: data.logoUrl || "",
          });
        }
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scrollspy di Homepage untuk mendeteksi letak section yang sedang dilihat
      if (isHomePage) {
        const sections = ["home", "about", "projects", "experience", "research", "community", "contact"];
        const scrollPosition = window.scrollY + 200;

        for (const secId of sections) {
          const el = document.getElementById(secId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(secId);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("auth-changed", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, [isHomePage, pathname]);

  // Handler klik menu navbar
  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (isHomePage) {
      // MODE HOMEPAGE: Smooth scroll meluncur ke bawah sesuai letak section/hero
      e.preventDefault();
      const element = document.getElementById(item.sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setActiveSection(item.sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("home");
      }
      setIsOpen(false);
    } else {
      // MODE RINCIAN / DETAIL: Ganti page (bukan smooth scroll lokal)
      setIsOpen(false);
      // Biarkan browser / Link berpindah ke halaman rincian atau kembali ke homepage
    }
  };

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-40 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 px-3.5 sm:px-5 py-2.5 rounded-2xl sm:rounded-full transition-all duration-300 w-full max-w-5xl ${
          scrolled
            ? "bg-[#0B0D12]/85 backdrop-blur-xl border border-[#292D39] shadow-[0_12px_36px_rgba(0,0,0,0.65)]"
            : "bg-[#0B0D12]/70 backdrop-blur-lg border border-[#292D39]/70 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        }`}
      >
        {/* Brand Logo & Name */}
        <Link
          href="/"
          onClick={(e) => {
            if (isHomePage) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setActiveSection("home");
            }
          }}
          className="group flex items-center gap-2.5 text-decoration-none focus:outline-none shrink-0"
          aria-label={`${branding.brandName} Homepage`}
        >
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-full bg-[#171A24] border border-[#292D39] flex items-center justify-center font-mono font-bold text-xs text-[#F1F2F5] group-hover:border-[#7790FF] transition-colors overflow-hidden">
            {branding.logoUrl ? (
              <Image
                src={branding.logoUrl}
                alt={branding.brandName}
                fill
                sizes="32px"
                className="object-contain p-0.5"
              />
            ) : (
              <span>{(branding.brandName || "W")[0]?.toUpperCase() || "W"}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-[#F1F2F5] group-hover:text-[#7790FF] transition-colors">
              {branding.brandName}
            </span>
            <span className="text-[10px] text-[#7D8496] font-mono leading-none hidden xs:inline">
              {branding.roleTitle}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3" aria-label="Main Navigation">
          {navItems.map((item) => {
            let isActive = false;
            if (isHomePage) {
              isActive = activeSection === item.sectionId;
            } else {
              isActive = pathname === item.pageHref || (item.pageHref !== "/" && pathname.startsWith(item.pageHref));
            }

            return (
              <Link
                key={item.name}
                href={isHomePage ? `#${item.sectionId}` : item.pageHref}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative px-2.5 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-[#F1F2F5]"
                    : "text-[#A1A6B5] hover:text-[#F1F2F5]"
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <span
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#7790FF] shadow-[0_0_8px_#7790FF]"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions: AI Assistant & Admin */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Trigger Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171A24] hover:bg-[#1F2330] border border-[#292D39] hover:border-[#7790FF]/50 text-xs font-medium text-[#F1F2F5] transition-all cursor-pointer group shadow-sm"
            aria-label="Tanya AI Assistant"
            title={`Tanya seputar profil & proyek ${branding.brandName}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7790FF] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Admin badge link if logged in */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#7790FF]/10 border border-[#7790FF]/30 text-xs font-medium text-[#96A9FF] hover:bg-[#7790FF]/20 transition-colors"
              title="Akses Dashboard Admin"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full bg-[#171A24] border border-[#292D39] text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors cursor-pointer"
            aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Floating Panel */}
      {isOpen && (
        <div className="pointer-events-auto md:hidden fixed inset-x-3 top-[68px] sm:top-[74px] bg-[#0B0D12]/95 backdrop-blur-2xl border border-[#292D39] rounded-2xl py-4 px-5 shadow-2xl transition-all">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              let isActive = false;
              if (isHomePage) {
                isActive = activeSection === item.sectionId;
              } else {
                isActive = pathname === item.pageHref || (item.pageHref !== "/" && pathname.startsWith(item.pageHref));
              }

              return (
                <Link
                  key={item.name}
                  href={isHomePage ? `#${item.sectionId}` : item.pageHref}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#171A24] text-[#F1F2F5] border border-[#292D39]"
                      : "text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#171A24]"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7790FF]" />
                  )}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-[#292D39] flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAi();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#171A24] border border-[#7790FF]/40 text-sm font-medium text-[#F1F2F5] hover:bg-[#1F2330] transition-colors"
              >
                <Bot className="w-4 h-4 text-[#7790FF]" />
                Tanya Asisten AI
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7790FF]/15 border border-[#7790FF]/30 text-sm font-medium text-[#96A9FF]"
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
