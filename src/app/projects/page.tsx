import { db } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";
import ProjectList from "@/components/projects/ProjectList";

export const metadata = {
  title: "Projects & Portfolio — Wijaya Dary Dimas",
  description: "Portfolio of software engineering projects, computer vision research, and spatial data pipelines by Wijaya Dary Dimas.",
};

export default async function ProjectsPage() {
  const projects = await db.getProjects({ publishedOnly: true });

  return (
    <AppShell>
      <div className="pt-32 pb-24">
        <div className="container-custom flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-mono font-medium text-[#6D8DFF] uppercase tracking-wider">
              PORTFOLIO
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F3F4F6] tracking-tight">
              Featured Projects
            </h1>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              A showcase of projects and engineering explorations demonstrating hands-on problem solving, technical depth, and modern tech stacks.
            </p>
          </div>

          <ProjectList initialProjects={projects} />
        </div>
      </div>
    </AppShell>
  );
}
