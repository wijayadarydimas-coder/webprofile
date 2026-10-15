import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import AppShell from "@/components/layout/AppShell";
import CommunityView from "@/components/community/CommunityView";

export const metadata = {
  title: "Komunitas & Diskusi — Wijaya Dary Dimas",
  description: "Ruang diskusi terbuka dua arah antara pengunjung dan Wijaya Dary Dimas.",
};

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const [comments, user] = await Promise.all([
    db.getComments({ includeHidden: false }),
    getCurrentUser(),
  ]);

  return (
    <AppShell>
      <div className="pt-32 pb-24">
        <div className="container-custom max-w-3xl flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-medium text-[#6D8DFF] uppercase tracking-wider">
              Forum Komunitas
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F3F4F6] tracking-tight">
              Diskusi &amp; Tanggapan Dua Arah
            </h1>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Ruang interaksi publik untuk bertukar pikiran mengenai rekayasa perangkat lunak, sistem machine learning, dan implementasi computer vision.
            </p>
          </div>

          <CommunityView initialComments={comments} initialUser={user as any} />
        </div>
      </div>
    </AppShell>
  );
}
