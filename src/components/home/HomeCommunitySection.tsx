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
    <section id="community" className="py-20 border-t border-[#202228]">
      <div className="container-custom max-w-4xl flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-medium text-[#6D8DFF] uppercase tracking-wider">
              Forum Komunitas &amp; Tanggapan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] tracking-tight">
              Diskusi &amp; Tanggapan Terbuka
            </h2>
            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-xl">
              Ruang interaksi publik untuk bertukar pikiran mengenai rekayasa perangkat lunak, sistem machine learning, dan implementasi computer vision.
            </p>
          </div>

          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B9CFF] hover:text-[#A8B7FF] transition-colors group shrink-0"
          >
            <span>Buka Halaman Komunitas Penuh</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <CommunityView initialComments={comments} initialUser={user} />
      </div>
    </section>
  );
}
