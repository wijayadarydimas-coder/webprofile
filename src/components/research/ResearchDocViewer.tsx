"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Copy,
  Check,
  Menu,
  ChevronDown,
  Layers,
  Cpu,
  Database,
  Bell,
  CheckCircle2,
  BookOpen,
  Share2,
  ExternalLink,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import ProviderBadge from "@/components/ui/ProviderBadge";
import { isSafeUrl } from "@/lib/security/sanitize";
import type { ResearchItem, ResearchSectionItem } from "@/types";

interface ResearchDocViewerProps {
  researchItems: ResearchItem[];
  initialActiveId?: string;
}

// Icon mapper for section types
function getSectionIcon(type: string, title: string) {
  const normTitle = title.toLowerCase();
  if (normTitle.includes("latar belakang") || type === "text") return Layers;
  if (normTitle.includes("tujuan")) return CheckCircle2;
  if (normTitle.includes("modifikasi") || normTitle.includes("arsitektur") || type === "architecture") return Cpu;
  if (normTitle.includes("metodologi") || normTitle.includes("metode") || type === "methodology") return CheckCircle2;
  if (normTitle.includes("dataset") || type === "dataset") return Database;
  if (normTitle.includes("alarm") || normTitle.includes("integrasi") || type === "integration") return Bell;
  if (normTitle.includes("referensi") || normTitle.includes("pustaka") || type === "references") return BookOpen;
  return FileText;
}

// Simple copy code block component
function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-[#2B2D34] bg-[#0E1015]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#15171C] border-b border-[#202228] text-[11px] font-mono text-[#A1A1AA]">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-[#1F2330] hover:text-[#F3F4F6] transition-colors"
          title="Salin kode"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Tersalin" : "Salin"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-[#E2E8F0] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Lightweight, safe Markdown & Article Renderer
export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "code";

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Code blocks ```
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        renderedElements.push(
          <CodeBlock
            key={`code-${i}`}
            code={codeBuffer.join("\n")}
            language={codeLang || "code"}
          />
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.trim().replace(/^```/, "").trim() || "text";
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // 2. Tables | col | col |
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());

      // Check if it's separator line |---|---|
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
        tableRows = [];
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      // Flush table
      renderedElements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-xl border border-[#2B2D34]">
          <table className="w-full text-left text-xs text-[#A1A1AA]">
            <thead className="bg-[#15171C] text-[#F3F4F6] font-semibold border-b border-[#2B2D34]">
              <tr>
                {tableHeader.map((th, thIdx) => (
                  <th key={thIdx} className="p-3">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202228] bg-[#111317]">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#181A22]/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }

    // 3. GitHub Callout Alerts (> [!NOTE], etc.)
    if (line.trim().startsWith(">")) {
      const quoteText = line.replace(/^>\s?/, "").trim();
      let alertType: "note" | "tip" | "important" | "warning" = "note";
      let displayQuote = quoteText;

      if (quoteText.startsWith("[!NOTE]")) {
        alertType = "note";
        displayQuote = quoteText.replace("[!NOTE]", "").trim();
      } else if (quoteText.startsWith("[!TIP]")) {
        alertType = "tip";
        displayQuote = quoteText.replace("[!TIP]", "").trim();
      } else if (quoteText.startsWith("[!IMPORTANT]")) {
        alertType = "important";
        displayQuote = quoteText.replace("[!IMPORTANT]", "").trim();
      } else if (quoteText.startsWith("[!WARNING]")) {
        alertType = "warning";
        displayQuote = quoteText.replace("[!WARNING]", "").trim();
      }

      const alertStyles = {
        note: "border-[#6D8DFF] bg-[#6D8DFF]/10 text-[#CBD5E1]",
        tip: "border-[#22C55E] bg-[#22C55E]/10 text-[#CBD5E1]",
        important: "border-[#A855F7] bg-[#A855F7]/10 text-[#CBD5E1]",
        warning: "border-[#EAB308] bg-[#EAB308]/10 text-[#CBD5E1]",
      };

      renderedElements.push(
        <div
          key={`alert-${i}`}
          className={`p-4 rounded-xl border-l-4 my-3 text-xs leading-relaxed ${alertStyles[alertType]}`}
        >
          {displayQuote || "Catatan Teknis"}
        </div>
      );
      continue;
    }

    // 4. Headings
    if (line.startsWith("#### ")) {
      renderedElements.push(
        <h4 key={`h4-${i}`} className="text-sm font-semibold text-[#F3F4F6] mt-4 mb-2">
          {line.replace("#### ", "")}
        </h4>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      renderedElements.push(
        <h3 key={`h3-${i}`} className="text-base font-semibold text-[#F3F4F6] mt-5 mb-2">
          {line.replace("### ", "")}
        </h3>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      renderedElements.push(
        <h2 key={`h2-${i}`} className="text-lg sm:text-xl font-bold text-[#F3F4F6] mt-6 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
      continue;
    }

    // 5. Bullet / Numbered lists
    if (/^[-*]\s/.test(line.trim())) {
      const itemText = line.trim().replace(/^[-*]\s/, "");
      renderedElements.push(
        <li key={`li-${i}`} className="text-xs sm:text-sm text-[#A1A6B5] ml-5 list-disc leading-relaxed my-1">
          {renderInlineFormatting(itemText)}
        </li>
      );
      continue;
    }
    if (/^\d+\.\s/.test(line.trim())) {
      const itemText = line.trim().replace(/^\d+\.\s/, "");
      renderedElements.push(
        <li key={`ol-${i}`} className="text-xs sm:text-sm text-[#A1A6B5] ml-5 list-decimal leading-relaxed my-1">
          {renderInlineFormatting(itemText)}
        </li>
      );
      continue;
    }

    // 6. Empty line
    if (!line.trim()) {
      renderedElements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    // 7. Regular paragraph
    renderedElements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm text-[#A1A6B5] leading-relaxed my-1.5">
        {renderInlineFormatting(line)}
      </p>
    );
  }

  // Flush remaining table if ended with file
  if (inTable && tableHeader.length > 0) {
    renderedElements.push(
      <div key="table-flush" className="overflow-x-auto my-4 rounded-xl border border-[#2B2D34]">
        <table className="w-full text-left text-xs text-[#A1A1AA]">
          <thead className="bg-[#15171C] text-[#F3F4F6] font-semibold border-b border-[#2B2D34]">
            <tr>
              {tableHeader.map((th, thIdx) => (
                <th key={thIdx} className="p-3">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202228] bg-[#111317]">
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-[#181A22]/50">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <div className="space-y-1">{renderedElements}</div>;
}

// Inline formatting (bold, italic, code, links)
function renderInlineFormatting(text: string): React.ReactNode {
  // Simple regex parser for bold, inline code, and links
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-[#F1F2F5]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-[#1F2330] text-[#7790FF] text-[11px] font-mono border border-[#292D39]">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7790FF] underline hover:text-[#96A9FF] inline-flex items-center gap-0.5"
          >
            <span>{linkMatch[1]}</span>
            <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
        );
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function ResearchDocViewer({
  researchItems,
  initialActiveId,
}: ResearchDocViewerProps) {
  const [selectedId, setSelectedId] = useState<string>(
    initialActiveId || researchItems[0]?.id || ""
  );
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeItem =
    researchItems.find((r) => r.id === selectedId) || researchItems[0];

  const visibleSections = (activeItem?.sections || []).filter(
    (sec) => sec.isVisible !== false && sec.content?.trim() !== ""
  );

  // Scrollspy via IntersectionObserver
  useEffect(() => {
    if (visibleSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    visibleSections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleSections]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (!activeItem) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="text-sm text-[#71717A]">
          Belum ada dokumentasi penelitian yang dipublikasikan.
        </p>
      </div>
    );
  }

  const hasRepo = isSafeUrl(activeItem.repoUrl);
  const pdfHref = activeItem.pdfUrl?.startsWith("data:application/pdf;base64,")
    ? `/api/research/${activeItem.id}/pdf`
    : activeItem.pdfUrl;
  const hasPdf = Boolean(pdfHref && (pdfHref.startsWith("/") || isSafeUrl(pdfHref)));

  return (
    <div className="pt-28 pb-24 relative z-10">
      <div className="container-custom max-w-7xl flex flex-col gap-8">
        {/* Breadcrumb & Global Navigation */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1C202B]">
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[#8B9CFF] hover:text-[#F3F4F6] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <span className="text-[#3A3D4D]">/</span>
            <span className="text-[#A1A6B5] font-medium">Dokumentasi Penelitian &amp; Skripsi</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-[#171A24] border border-[#292D39] text-[11px] font-mono text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Salin tautan penelitian"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Tautan Tersalin" : "Bagikan"}</span>
            </button>
          </div>
        </div>

        {/* Multi-Item Switcher (If multiple research papers exist) */}
        {researchItems.length > 1 && (
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-[#141720] border border-[#232733]">
            <span className="text-xs font-semibold text-[#A1A6B5] px-1">
              Koleksi Naskah Riset ({researchItems.length}):
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {researchItems.map((item, idx) => {
                const isSelected = item.id === activeItem.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setActiveSectionId("");
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-[#7790FF] text-white shadow-md shadow-[#7790FF]/25 border border-[#7790FF]"
                        : "bg-[#1B1E28] text-[#A1A6B5] hover:text-[#F1F2F5] border border-[#272B38]"
                    }`}
                  >
                    <span className="font-mono opacity-70">#{idx + 1}</span>
                    <span className="max-w-[200px] truncate">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RESEARCH EXECUTIVE HEADER (Specification 3.1) */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#171A24] to-[#12141C] border border-[#272B38] flex flex-col gap-6 relative overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#7790FF]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badges & Academic Context */}
          <div className="flex items-center gap-3 flex-wrap relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#7790FF]/15 text-[#96A9FF] border border-[#7790FF]/30">
              {activeItem.publishedStatus || "Penelitian Skripsi"}
            </span>

            <span className="text-xs text-[#8A91A5] font-mono flex items-center gap-1.5">
              <span>{activeItem.institution || "Universitas Muhammadiyah Purwokerto"}</span>
              <span className="text-[#3A3D4D]">&bull;</span>
              <span>{activeItem.studyProgram || "S1 Teknik Informatika"}</span>
            </span>
          </div>

          {/* Dominant Research Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#F1F2F5] tracking-tight leading-snug sm:leading-tight relative z-10">
            {activeItem.title}
          </h1>

          {/* Executive Summary */}
          <div className="p-5 rounded-2xl bg-[#0F1118]/80 border border-[#222633] text-sm sm:text-base text-[#C2C8D6] leading-relaxed relative z-10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7790FF] block mb-1.5 font-semibold">
              Ringkasan Eksekutif (Executive Summary)
            </span>
            <p>{activeItem.summary}</p>
          </div>

          {/* Technologies Chips */}
          {activeItem.technologies && activeItem.technologies.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap relative z-10">
              <span className="text-[11px] font-mono text-[#7D8496] mr-1">Teknologi &amp; Model:</span>
              {activeItem.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#1B1E29] text-[#A1A6B5] border border-[#2A2F3D]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Action Links & Multi-Provider Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10 border-t border-[#202431]">
            {hasRepo && (
              <a
                href={activeItem.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2 px-4 shadow-lg shadow-[#7790FF]/20"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}

            {hasPdf && (
              <a
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 px-4"
              >
                <FileText className="w-4 h-4" />
                <span>Naskah PDF Lengkap</span>
              </a>
            )}

            {/* Dynamic External Platform Badges (Roboflow, Hugging Face, Kaggle, CVAT, etc. with official icons) */}
            {activeItem.externalLinks &&
              activeItem.externalLinks.map((link, idx) => (
                <ProviderBadge key={`${link.provider}-${idx}`} link={link} size="md" />
              ))}
          </div>
        </header>

        {/* MOBILE TABLE OF CONTENTS (Specification 3.2 Mobile Dropdown) */}
        <div className="lg:hidden sticky top-20 z-30">
          <button
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="w-full p-3.5 rounded-xl bg-[#141720]/95 backdrop-blur-md border border-[#272B38] text-xs font-medium text-[#F1F2F5] flex items-center justify-between shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Menu className="w-4 h-4 text-[#7790FF]" />
              <span>
                Navigasi Dokumen:{" "}
                <strong className="text-[#7790FF]">
                  {visibleSections.find((s) => s.id === activeSectionId)?.title || "Daftar Isi"}
                </strong>
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileTocOpen ? "rotate-180" : ""}`} />
          </button>

          {mobileTocOpen && (
            <div className="mt-2 p-3 rounded-2xl bg-[#141720] border border-[#272B38] shadow-2xl flex flex-col gap-1 max-h-72 overflow-y-auto animate-fade-in">
              {visibleSections.map((sec, idx) => {
                const isActive = activeSectionId === sec.id;
                const IconComponent = getSectionIcon(sec.type, sec.title);
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setMobileTocOpen(false)}
                    className={`p-2.5 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                      isActive
                        ? "bg-[#7790FF]/15 text-[#96A9FF] font-semibold border-l-2 border-[#7790FF]"
                        : "text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#1C202C]"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="font-mono text-[10px] opacity-60">0{idx + 1}.</span>
                    <span className="truncate">{sec.title}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* TWO-COLUMN TECHNICAL DOCUMENTATION LAYOUT (Specification 3.2 Desktop Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: Sticky Table of Contents (TOC) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28">
            <div className="p-5 rounded-2xl bg-[#141720]/80 backdrop-blur-sm border border-[#242835] flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#20232F]">
                <h3 className="text-xs font-bold text-[#F1F2F5] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#7790FF]" />
                  <span>Daftar Isi Penelitian</span>
                </h3>
                <span className="text-[10px] font-mono text-[#7D8496]">
                  {visibleSections.length} Bagian
                </span>
              </div>

              <nav className="flex flex-col gap-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 no-scrollbar">
                {visibleSections.map((sec, idx) => {
                  const isActive = activeSectionId === sec.id;
                  const IconComponent = getSectionIcon(sec.type, sec.title);
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`group px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all duration-200 ${
                        isActive
                          ? "bg-[#7790FF]/15 text-[#96A9FF] font-semibold border-l-2 border-[#7790FF] shadow-sm shadow-[#7790FF]/10 translate-x-1"
                          : "text-[#8E95A8] hover:text-[#F1F2F5] hover:bg-[#1B1E29]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconComponent
                          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                            isActive ? "text-[#7790FF]" : "opacity-60 group-hover:text-[#F1F2F5]"
                          }`}
                        />
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-50 shrink-0 ml-2">
                        0{idx + 1}
                      </span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* MAIN ARTICLE AREA (Specification 3.3 & 3.4) */}
          <main className="lg:col-span-8 flex flex-col gap-8">
            {visibleSections.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#141720] border border-[#242835] text-sm text-[#7D8496]">
                Belum ada rincian konten yang dipublikasikan pada naskah ini.
              </div>
            ) : (
              visibleSections.map((sec, idx) => {
                const IconComponent = getSectionIcon(sec.type, sec.title);
                return (
                  <article
                    key={sec.id}
                    id={sec.id}
                    className="p-6 sm:p-9 rounded-3xl bg-[#141720] border border-[#232733] flex flex-col gap-4 scroll-mt-28 transition-all hover:border-[#2D3344] shadow-lg"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#1E222E]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1B1F2C] border border-[#2B3142] flex items-center justify-center text-[#7790FF]">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7790FF] block">
                            Bagian 0{idx + 1} &bull; {sec.type}
                          </span>
                          <h2 className="text-lg sm:text-xl font-bold text-[#F1F2F5]">
                            {sec.title}
                          </h2>
                        </div>
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className="pt-2">
                      <MarkdownRenderer content={sec.content} />
                    </div>
                  </article>
                );
              })
            )}

            {/* Back to top & next exploration */}
            <div className="p-6 rounded-2xl bg-[#12141C] border border-[#1E222E] flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <span className="text-xs text-[#7D8496]">
                Dokumentasi resmi rekayasa skripsi &bull; Wijaya Dary Dimas
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/projects"
                  className="btn-secondary text-xs py-2 px-3.5"
                >
                  <span>Jelajahi Proyek Lain</span>
                </Link>
                <a
                  href="#top"
                  className="btn-secondary text-xs py-2 px-3.5"
                >
                  <span>Kembali ke Atas &uarr;</span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
