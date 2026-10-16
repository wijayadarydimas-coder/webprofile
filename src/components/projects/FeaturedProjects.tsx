import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { ProviderBadgeList } from "@/components/ui/ProviderBadge";
import type { Project } from "@/types";
import { isSafeUrl } from "@/lib/security/sanitize";
import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured && p.published);

  // If no projects marked featured, fall back to published ones
  const displayProjects = (featured.length > 0 ? featured : projects.filter((p) => p.published)).slice(0, 4);

  const flagship = displayProjects[0];
  const secondaryProjects = displayProjects.slice(1);

  const hasFlagshipRepo = flagship && isSafeUrl(flagship.repoUrl);
  const hasFlagshipLive = flagship && isSafeUrl(flagship.liveUrl);

  return (
    <section id="projects" className="py-24 md:py-32 border-t border-[#1C202B] relative z-10">
      <div className="container-custom flex flex-col gap-12 lg:gap-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-mono font-medium text-[#7790FF] uppercase tracking-wider">
              Proyek
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F1F2F5] tracking-tight">
              Proyek &amp; Eksplorasi
            </h2>
            <p className="text-sm text-[#A1A6B5] leading-relaxed">
              Kumpulan proyek dan eksperimen yang menjadi bagian dari proses belajar, mencoba hal baru, dan mengembangkan ide menjadi sesuatu yang nyata.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96A9FF] hover:text-[#F1F2F5] transition-colors w-fit shrink-0 group"
          >
            <span>Jelajahi Proyek</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Balanced Composition */}
        {displayProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#171A24] border border-[#292D39] text-xs text-[#7D8496]">
            Belum ada proyek yang dipublikasikan.
          </div>
        ) : displayProjects.length === 1 ? (
          /* SINGLE PROJECT: Full-Width Editorial Spotlight */
          <article className="card-surface overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-2xl">
            <Link
              href={`/projects/${flagship.slug}`}
              className="lg:col-span-7 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#171A24] border border-[#292D39] block group"
            >
              {flagship.coverImage ? (
                <Image
                  src={flagship.coverImage}
                  alt={flagship.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              ) : null}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#0B0D12]/85 backdrop-blur-md border border-[#292D39] text-[#96A9FF]">
                  {flagship.category}
                </span>
              </div>
            </Link>

            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7790FF]/15 text-[#96A9FF] border border-[#7790FF]/30">
                    Proyek
                  </span>
                </div>

                <Link href={`/projects/${flagship.slug}`} className="group/title">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#F1F2F5] group-hover/title:text-[#7790FF] transition-colors leading-snug flex items-center justify-between gap-2">
                    <span>{flagship.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-[#7D8496] group-hover/title:text-[#7790FF] transition-colors shrink-0" />
                  </h3>
                </Link>

                <p className="text-sm text-[#A1A6B5] leading-relaxed">
                  {flagship.shortDescription}
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-[#1C202B]">
                <div className="flex flex-wrap gap-1.5">
                  {flagship.technologies.map((tech) => (
                    <span key={tech} className="badge-tech">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Dynamic External Platform Badges */}
                {flagship.externalLinks && flagship.externalLinks.length > 0 && (
                  <div className="pt-0.5">
                    <ProviderBadgeList links={flagship.externalLinks} size="sm" maxVisible={3} />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Link href={`/projects/${flagship.slug}`} className="btn-primary text-xs py-2 px-4">
                    <span>Baca Studi Kasus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {hasFlagshipRepo && (
                      <a
                        href={flagship.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#1F2330] hover:bg-[#262A38] border border-[#292D39] text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors"
                        title="Repository"
                        aria-label={`Repository untuk ${flagship.title}`}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {hasFlagshipLive && (
                      <a
                        href={flagship.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#1F2330] hover:bg-[#262A38] border border-[#292D39] text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors"
                        title="Live Demo"
                        aria-label={`Live demo untuk ${flagship.title}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ) : displayProjects.length === 2 ? (
          /* TWO PROJECTS: Balanced 2-Column Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {displayProjects.map((proj, idx) => (
              <ProjectCard key={proj.id} project={proj} priority={idx === 0} />
            ))}
          </div>
        ) : (
          /* THREE OR MORE PROJECTS: Flagship Hero on Top + Balanced Companion Grid Below */
          <div className="flex flex-col gap-8">
            {/* 1. Flagship Hero Project (Spans Full Width with Horizontal Split) */}
            <article className="card-surface overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-2xl">
              <Link
                href={`/projects/${flagship.slug}`}
                className="lg:col-span-7 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#171A24] border border-[#292D39] block group"
              >
                {flagship.coverImage ? (
                  <Image
                    src={flagship.coverImage}
                    alt={flagship.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : null}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#0B0D12]/85 backdrop-blur-md border border-[#292D39] text-[#96A9FF]">
                    {flagship.category}
                  </span>
                </div>
              </Link>

              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7790FF]/15 text-[#96A9FF] border border-[#7790FF]/30">
                      Karya Utama
                    </span>
                  </div>

                  <Link href={`/projects/${flagship.slug}`} className="group/title">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#F1F2F5] group-hover/title:text-[#7790FF] transition-colors leading-snug flex items-center justify-between gap-2">
                      <span>{flagship.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-[#7D8496] group-hover/title:text-[#7790FF] transition-colors shrink-0" />
                    </h3>
                  </Link>

                  <p className="text-sm text-[#A1A6B5] leading-relaxed">
                    {flagship.shortDescription}
                  </p>
                </div>

                <div className="flex flex-col gap-4 pt-4 border-t border-[#1C202B]">
                  <div className="flex flex-wrap gap-1.5">
                    {flagship.technologies.slice(0, 5).map((tech) => (
                      <span key={tech} className="badge-tech">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Link href={`/projects/${flagship.slug}`} className="btn-primary text-xs py-2 px-4">
                      <span>Baca Studi Kasus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {hasFlagshipRepo && (
                        <a
                          href={flagship.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-[#1F2330] hover:bg-[#262A38] border border-[#292D39] text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors"
                          title="Repository"
                          aria-label={`Repository untuk ${flagship.title}`}
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {hasFlagshipLive && (
                        <a
                          href={flagship.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-[#1F2330] hover:bg-[#262A38] border border-[#292D39] text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors"
                          title="Live Demo"
                          aria-label={`Live demo untuk ${flagship.title}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 2. Secondary Companion Projects (Balanced Grid Below) */}
            <div
              className={`grid grid-cols-1 ${
                secondaryProjects.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
              } gap-8`}
            >
              {secondaryProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
