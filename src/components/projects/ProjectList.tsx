"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Project } from "@/types";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  initialProjects: Project[];
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = ["Semua", "Computer Vision", "Geospatial", "Full-Stack", "System"];

  const filtered = initialProjects.filter((p) => {
    const matchesCategory = selectedCategory === "Semua" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#15171C] border border-[#2B2D34]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#6D8DFF] text-white shadow-sm"
                  : "bg-[#1B1D23] text-[#A1A1AA] hover:text-[#F3F4F6] hover:bg-[#22252E] border border-[#2B2D34]"
              }`}
            >
              {cat}
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
          Tidak ditemukan proyek yang cocok dengan kata kunci &quot;{search}&quot;.
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
