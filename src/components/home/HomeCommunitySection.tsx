import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Comment, User } from "@/types";
import CommunityView from "@/components/community/CommunityView";

interface HomeCommunitySectionProps {
  comments: Comment[];
  user: any;
}

export default function HomeCommunitySection({ comments, user }: HomeCommunitySectionProps) {
  return (
    <section id="community" className="py-24 md:py-32 border-t border-[#1C202B] relative z-10">
      <div className="container-custom max-w-4xl flex flex-col gap-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-medium text-[#7790FF] uppercase tracking-wider">
              KOMUNITAS &amp; Diskusi
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F1F2F5] tracking-tight">
              Ruang Berbagi &amp; Berdiskusi
            </h2>
            <p className="text-sm text-[#A1A6B5] leading-relaxed max-w-xl">
              Tempat berbagi pemikiran, bertukar pengalaman, dan berdiskusi seputar teknologi, pemrograman, serta hal-hal yang menarik untuk dipelajari bersama.
            </p>
          </div>

          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96A9FF] hover:text-[#F1F2F5] transition-colors group shrink-0"
          >
            <span>Kunjungi Ruang Diskusi</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <CommunityView initialComments={comments} initialUser={user} />
      </div>
    </section>
  );
}
