import { db } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";
import ResearchViewer from "@/components/research/ResearchViewer";

export const metadata = {
  title: "Riset & Skripsi — Wijaya Dary Dimas",
  description:
    "Penelitian skripsi: Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis oleh Wijaya Dary Dimas di Universitas Muhammadiyah Purwokerto.",
};

export default async function ResearchPage() {
  const researchItems = await db.getResearchItems();

  return (
    <AppShell>
      <ResearchViewer researchItems={researchItems} />
    </AppShell>
  );
}
