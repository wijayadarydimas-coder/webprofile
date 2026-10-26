import { db } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";
import ResearchViewer from "@/components/research/ResearchViewer";

export const metadata = {
  title: "Research & Thesis — Wijaya Dary Dimas",
  description:
    "Thesis Research: Modified YOLOv11 Implementation for Personal Protective Equipment (Helmet, Vest, Gloves, Boots) Detection with Automated Alarm by Wijaya Dary Dimas at Universitas Muhammadiyah Purwokerto.",
};

export default async function ResearchPage() {
  const researchItems = await db.getResearchItems();

  return (
    <AppShell>
      <ResearchViewer researchItems={researchItems} />
    </AppShell>
  );
}
