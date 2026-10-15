import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Cpu, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { db } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";
import { isSafeUrl } from "@/lib/security/sanitize";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await db.getProjectBySlug(slug);
  if (!project) return { title: "Proyek Tidak Ditemukan" };
  return {
    title: `${project.title} — Wijaya Dary Dimas`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await db.getProjectBySlug(slug);

  if (!project || !project.published) {
    notFound();
  }

  const hasRepo = isSafeUrl(project.repoUrl);
  const hasLive = isSafeUrl(project.liveUrl);

  return (
    <AppShell>
      <article className="pt-32 pb-24">
        <div className="container-custom max-w-4xl flex flex-col gap-10">
          {/* Breadcrumbs & Back link */}
          <div className="flex items-center gap-2 text-xs text-[#71717A]">
            <Link href="/projects" className="inline-flex items-center gap-1.5 text-[#8B9CFF] hover:text-[#F3F4F6] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Semua Proyek</span>
            </Link>
            <span>/</span>
            <span className="text-[#A1A1AA] truncate max-w-[200px] sm:max-w-none">{project.title}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="badge-tech">{project.category}</span>
              {project.featured && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#6D8DFF]/20 text-[#8B9CFF] border border-[#6D8DFF]/30">
                  Unggulan
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3F4F6] tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
              {project.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {hasRepo && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2 px-4"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Lihat Repository</span>
                </a>
              )}

              {hasLive && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2 px-4"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Kunjungi Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Cover Media Card */}
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-[#15171C] border border-[#2B2D34]">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            ) : null}
          </div>

          {/* Structured Case Study Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.problem && (
              <div className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-mono font-semibold uppercase">Masalah (Problem)</span>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {project.problem}
                </p>
              </div>
            )}

            {project.solution && (
              <div className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-[#6D8DFF]">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-mono font-semibold uppercase">Pendekatan Teknis</span>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {project.solution}
                </p>
              </div>
            )}

            {project.results && (
              <div className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-[#22C55E]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-mono font-semibold uppercase">Hasil &amp; Evaluasi</span>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {project.results}
                </p>
              </div>
            )}
          </div>

          {/* Full Narrative Content */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#F3F4F6]">Dokumentasi &amp; Penjelasan Teknis</h2>
            <div className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap flex flex-col gap-4">
              {project.fullDescription.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Technologies Used */}
          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[#15171C] border border-[#2B2D34]">
            <h3 className="text-xs font-mono font-semibold text-[#8B9CFF] uppercase">
              Stack &amp; Perangkat Lunak yang Digunakan
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="badge-tech text-xs py-1 px-3">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </AppShell>
  );
}
