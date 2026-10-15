import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";
import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured && p.published).slice(0, 3);

  return (
    <section id="projects" className="py-20 border-t border-[#202228]">
      <div className="container-custom flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-xs font-mono font-medium text-[#6D8DFF] uppercase tracking-wider">
              Karya Unggulan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] tracking-tight">
              Proyek &amp; Studi Kasus Terpilih
            </h2>
            <p className="text-sm text-[#A1A1AA]">
              Implementasi nyata dari penelitian computer vision, infrastruktur geospasial, dan arsitektur sistem modern.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B9CFF] hover:text-[#F3F4F6] transition-colors w-fit"
          >
            <span>Lihat Semua Proyek</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </div>
    </section>
  );
}
