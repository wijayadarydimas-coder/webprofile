import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { Project } from "@/types";
import { isSafeUrl } from "@/lib/security/sanitize";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const hasRepo = isSafeUrl(project.repoUrl);
  const hasLive = isSafeUrl(project.liveUrl);

  return (
    <article className="card-surface overflow-hidden flex flex-col group h-full">
      {/* Cover Image Container */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#15171C] border-b border-[#2B2D34] block"
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={`Gambar proyek ${project.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#71717A]">
            No Preview Available
          </div>
        )}

        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#101114]/80 backdrop-blur-md border border-[#2B2D34] text-[#8B9CFF]">
            {project.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <Link href={`/projects/${project.slug}`} className="group/title">
            <h3 className="text-base sm:text-lg font-semibold text-[#F3F4F6] group-hover/title:text-[#6D8DFF] transition-colors flex items-center justify-between">
              <span className="line-clamp-2">{project.title}</span>
              <ArrowUpRight className="w-4 h-4 text-[#71717A] group-hover/title:text-[#6D8DFF] transition-colors shrink-0 ml-2" />
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-3 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Footer: Tags and Action Links */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[#202228]">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="badge-tech">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[10px] text-[#71717A] font-mono self-center">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <Link
              href={`/projects/${project.slug}`}
              className="text-xs font-medium text-[#8B9CFF] hover:underline"
            >
              Baca Studi Kasus &rarr;
            </Link>

            <div className="flex items-center gap-2.5">
              {hasRepo && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md hover:bg-[#1B1D23] text-[#A1A1AA] hover:text-[#F3F4F6] transition-colors"
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
                  className="p-1.5 rounded-md hover:bg-[#1B1D23] text-[#A1A1AA] hover:text-[#F3F4F6] transition-colors"
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
