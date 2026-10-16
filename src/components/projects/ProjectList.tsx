"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import type { Project } from "@/types";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  initialProjects: Project[];
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("Semua");

  // Ambil maksimal 5 teknologi teratas dari isi 'Teknologi (pisahkan koma)' yang ada di database/admin
  const dynamicTechs = useMemo(() => {
    const techMap = new Map<string, { original: string; count: number }>();

    for (const proj of initialProjects) {
      if (Array.isArray(proj.technologies)) {
        for (const rawTech of proj.technologies) {
          const trimmed = rawTech.trim();
          if (!trimmed) continue;
          const key = trimmed.toLowerCase();
          const existing = techMap.get(key);
          if (existing) {
            existing.count += 1;
          } else {
            techMap.set(key, { original: trimmed, count: 1 });
          }
        }
      }
    }

    // Urutkan berdasarkan frekuensi pemakaian di proyek, batasi maksimal 5 item
    return Array.from(techMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => item.original);
  }, [initialProjects]);

  const filterOptions = ["Semua", ...dynamicTechs];

  const filtered = initialProjects.filter((p) => {
    const matchesTech =
      selectedTech === "Semua" ||
      (Array.isArray(p.technologies) &&
        p.technologies.some((t) => t.toLowerCase() === selectedTech.toLowerCase()));

    const matchesSearch =
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesTech && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Dynamic Technology Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#15171C] border border-[#2B2D34]">
        {/* Dynamic Technology Pills (Max 5 + Semua) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {filterOptions.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedTech(item)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTech === item
                  ? "bg-[#6D8DFF] text-white shadow-sm"
                  : "bg-[#1B1D23] text-[#A1A1AA] hover:text-[#F3F4F6] hover:bg-[#22252E] border border-[#2B2D34]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari proyek atau teknologi..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] placeholder-[#71717A] focus:border-[#6D8DFF] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Results */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#71717A] bg-[#15171C] rounded-2xl border border-[#2B2D34]">
          Tidak ditemukan proyek yang cocok dengan filter atau kata kunci pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}
    </div>
  );
}
