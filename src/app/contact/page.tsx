import { db } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";
import ContactSection from "@/components/home/ContactSection";

export const metadata = {
  title: "Kontak & Kolaborasi — Wijaya Dary Dimas",
  description: "Hubungi Wijaya Dary Dimas untuk kolaborasi proyek, diskusi riset teknologi, atau peluang profesional.",
};

export default async function ContactPage() {
  const profile = await db.getProfile();

  return (
    <AppShell>
      <div className="pt-24 pb-12">
        <ContactSection profile={profile} />
      </div>
    </AppShell>
  );
}
