import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { ProviderBadgeList } from "@/components/ui/ProviderBadge";
import type { Project } from "@/types";
import { isSafeUrl } from "@/lib/security/sanitize";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const hasRepo = isSafeUrl(project.repoUrl);
  const hasLive = isSafeUrl(project.liveUrl);

  return (
    <article className="card-surface overflow-hidden flex flex-col group h-full transition-all duration-300">
      {/* Cover Image Container with Consistent Ratio */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative w-full aspect-[16/10] overflow-hidden bg-[#171A24] border-b border-[#292D39] block"
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={`Gambar proyek ${project.title}`}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#7D8496]">
            Pratinjau Tidak Tersedia
          </div>
        )}

        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#0B0D12]/85 backdrop-blur-md border border-[#292D39] text-[#96A9FF]">
            {project.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <Link href={`/projects/${project.slug}`} className="group/title">
            <h3 className="text-base sm:text-lg font-semibold text-[#F1F2F5] group-hover/title:text-[#7790FF] transition-colors flex items-center justify-between gap-2">
              <span className="line-clamp-2 leading-snug">{project.title}</span>
              <ArrowUpRight className="w-4 h-4 text-[#7D8496] group-hover/title:text-[#7790FF] transition-colors shrink-0" />
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-[#A1A6B5] line-clamp-3 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Footer: Tags and Action Links */}
        <div className="flex flex-col gap-3 pt-3 border-t border-[#1C202B]">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="badge-tech">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[10px] text-[#7D8496] font-mono self-center">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Dynamic External Platform Links */}
          {project.externalLinks && project.externalLinks.length > 0 && (
            <div className="pt-0.5">
              <ProviderBadgeList links={project.externalLinks} size="sm" maxVisible={2} />
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <Link
              href={`/projects/${project.slug}`}
              className="text-xs font-medium text-[#96A9FF] hover:text-[#7790FF] transition-colors inline-flex items-center gap-1"
            >
              <span>Baca Studi Kasus</span>
              <span>&rarr;</span>
            </Link>

            <div className="flex items-center gap-2">
              {hasRepo && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#1F2330] hover:bg-[#262A38] border border-[#292D39] text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors"
                  title="Source Code"
                  aria-label={`Repository GitHub untuk ${project.title}`}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}

              {hasLive && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#1F2330] hover:bg-[#262A38] border border-[#292D39] text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors"
                  title="Live Demo"
                  aria-label={`Live Demo untuk ${project.title}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
