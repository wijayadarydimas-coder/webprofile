import { Briefcase, GraduationCap, ExternalLink } from "lucide-react";
import type { Experience, Education } from "@/types";
import { isSafeUrl } from "@/lib/security/sanitize";

interface TimelineSectionProps {
  experiences: Experience[];
  educations: Education[];
}

export default function TimelineSection({ experiences, educations }: TimelineSectionProps) {
  return (
    <section id="experience" className="py-20 border-t border-[#202228]">
      <div className="container-custom flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-mono font-medium text-[#6D8DFF] uppercase tracking-wider">
            Perjalanan &amp; Rekam Jejak
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] tracking-tight">
            Pengalaman Praktik &amp; Pendidikan
          </h2>
          <p className="text-sm text-[#A1A1AA]">
            Rekam jejak resmi kegiatan instansi, eksplorasi teknologi, dan fondasi akademis.
          </p>
        </div>

        {/* Dual Column Layout: Experience on left, Education on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Column 1: Pengalaman Kerja & Magang */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#202228]">
              <div className="p-2 rounded-lg bg-[#15171C] border border-[#2B2D34] text-[#6D8DFF]">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#F3F4F6]">Pengalaman Kerja &amp; Praktik</h3>
            </div>

            <div className="flex flex-col gap-6 relative pl-6 border-l border-[#2B2D34]">
              {experiences.map((exp) => {
                const hasUrl = isSafeUrl(exp.url);
                return (
                  <div key={exp.id} className="relative flex flex-col gap-2 group">
                    {/* Timeline Node dot */}
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#101114] border-2 border-[#6D8DFF] group-hover:bg-[#6D8DFF] transition-colors" />

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-1.5">
                          {exp.role}
                          {hasUrl && (
                            <a
                              href={exp.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#71717A] hover:text-[#8B9CFF] inline-flex items-center"
                              title={`Kunjungi situs ${exp.organization}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                        <span className="text-[11px] font-mono text-[#8B9CFF] px-2 py-0.5 rounded bg-[#1B1D23] border border-[#2B2D34]">
                          {exp.period}
                        </span>
                      </div>

                      <span className="text-xs font-medium text-[#A1A1AA]">
                        {exp.organization}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Pendidikan Formal */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#202228]">
              <div className="p-2 rounded-lg bg-[#15171C] border border-[#2B2D34] text-[#8B9CFF]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#F3F4F6]">Pendidikan Formal</h3>
            </div>

            <div className="flex flex-col gap-6 relative pl-6 border-l border-[#2B2D34]">
              {educations.map((edu) => {
                const hasUrl = isSafeUrl(edu.url);
                return (
                  <div key={edu.id} className="relative flex flex-col gap-2 group">
                    {/* Timeline Node dot */}
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#101114] border-2 border-[#8B9CFF] group-hover:bg-[#8B9CFF] transition-colors" />

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-1.5">
                          {edu.degree}
                          {hasUrl && (
                            <a
                              href={edu.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#71717A] hover:text-[#8B9CFF] inline-flex items-center"
                              title={`Kunjungi situs resmi ${edu.institution}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                        <span className="text-[11px] font-mono text-[#8B9CFF] px-2 py-0.5 rounded bg-[#1B1D23] border border-[#2B2D34]">
                          {edu.period}
                        </span>
                      </div>

                      <span className="text-xs font-medium text-[#A1A1AA]">
                        {edu.institution}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed pt-1">
                      {edu.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
