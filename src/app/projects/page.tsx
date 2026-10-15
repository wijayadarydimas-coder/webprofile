import { db } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";
import ProjectList from "@/components/projects/ProjectList";

export const metadata = {
  title: "Portofolio Proyek — Wijaya Dary Dimas",
  description: "Daftar portofolio proyek rekayasa perangkat lunak, penelitian computer vision, dan pipeline data spasial oleh Wijaya Dary Dimas.",
};

export default async function ProjectsPage() {
  const projects = await db.getProjects({ publishedOnly: true });

  return (
    <AppShell>
      <div className="pt-32 pb-24">
        <div className="container-custom flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-mono font-medium text-[#6D8DFF] uppercase tracking-wider">
              Koleksi Portofolio
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F3F4F6] tracking-tight">
              Proyek &amp; Studi Kasus Rekayasa
            </h1>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Dokumentasi teknis dari solusi yang dibangun, mulai dari modifikasi YOLOv11 untuk deteksi APD, infrastruktur geospasial di BIG, hingga platform aplikasi full-stack.
            </p>
          </div>

          <ProjectList initialProjects={projects} />
        </div>
      </div>
    </AppShell>
  );
}
