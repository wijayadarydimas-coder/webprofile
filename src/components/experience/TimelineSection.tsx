import { Briefcase, GraduationCap, ExternalLink } from "lucide-react";
import type { Experience, Education } from "@/types";
import { isSafeUrl } from "@/lib/security/sanitize";

interface TimelineSectionProps {
  experiences: Experience[];
  educations: Education[];
}

export default function TimelineSection({ experiences, educations }: TimelineSectionProps) {
  return (
    <section id="experience" className="py-24 md:py-32 border-t border-[#1C202B] relative z-10">
      <div className="container-custom flex flex-col gap-12 lg:gap-16">
        {/* Section Header */}
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-mono font-medium text-[#7790FF] uppercase tracking-wider">
            Journey &amp; Experience
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F1F2F5] tracking-tight">
            Experience &amp; Education
          </h2>
          <p className="text-sm text-[#A1A6B5]">
            A chronicle of academic learning and professional experience, from formal education to delivering real-world engineering solutions.
          </p>
        </div>

        {/* Dual Column Layout: Experience on left, Education on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Column 1: Pengalaman Kerja & Magang */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1C202B]">
              <div className="p-2 rounded-lg bg-[#171A24] border border-[#292D39] text-[#7790FF]">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#F1F2F5]">Work Experience</h3>
            </div>

            <div className="flex flex-col gap-8 relative pl-6 border-l border-[#292D39]">
              {experiences.map((exp) => {
                const hasUrl = isSafeUrl(exp.url);
                return (
                  <div key={exp.id} className="relative flex flex-col gap-2 group">
                    {/* Timeline Node dot */}
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0B0D12] border-2 border-[#7790FF] group-hover:bg-[#7790FF] group-hover:shadow-[0_0_8px_#7790FF] transition-all" />

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#F1F2F5] flex items-center gap-1.5">
                          {exp.role}
                          {hasUrl && (
                            <a
                              href={exp.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#7D8496] hover:text-[#96A9FF] inline-flex items-center transition-colors"
                              title={`Visit ${exp.organization}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                        <span className="text-[11px] font-mono text-[#96A9FF] px-2.5 py-0.5 rounded-md bg-[#171A24] border border-[#292D39]">
                          {exp.period}
                        </span>
                      </div>

                      <span className="text-xs font-medium text-[#A1A6B5]">
                        {exp.organization}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#7D8496] leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Pendidikan Formal */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1C202B]">
              <div className="p-2 rounded-lg bg-[#171A24] border border-[#292D39] text-[#96A9FF]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#F1F2F5]">Formal Education</h3>
            </div>

            <div className="flex flex-col gap-8 relative pl-6 border-l border-[#292D39]">
              {educations.map((edu) => {
                const hasUrl = isSafeUrl(edu.url);
                return (
                  <div key={edu.id} className="relative flex flex-col gap-2 group">
                    {/* Timeline Node dot */}
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0B0D12] border-2 border-[#96A9FF] group-hover:bg-[#96A9FF] group-hover:shadow-[0_0_8px_#96A9FF] transition-all" />

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#F1F2F5] flex items-center gap-1.5">
                          {edu.degree}
                          {hasUrl && (
                            <a
                              href={edu.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#7D8496] hover:text-[#96A9FF] inline-flex items-center transition-colors"
                              title={`Visit official site of ${edu.institution}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                        <span className="text-[11px] font-mono text-[#96A9FF] px-2.5 py-0.5 rounded-md bg-[#171A24] border border-[#292D39]">
                          {edu.period}
                        </span>
                      </div>

                      <span className="text-xs font-medium text-[#A1A6B5]">
                        {edu.institution}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#7D8496] leading-relaxed pt-1">
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
