import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import AppShell from "@/components/layout/AppShell";
import CommunityView from "@/components/community/CommunityView";

export const metadata = {
  title: "Community & Discussions — Wijaya Dary Dimas",
  description: "An open two-way discussion board between visitors, developers, and Wijaya Dary Dimas.",
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
              COMMUNITY &amp; DISCUSSIONS
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F3F4F6] tracking-tight">
              Community Discussion Board
            </h1>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              A collaborative space to exchange ideas, share engineering experiences, and discuss computer vision, programming, and emerging technology.
            </p>
          </div>

          <CommunityView initialComments={comments} initialUser={user as any} />
        </div>
      </div>
    </AppShell>
  );
}
