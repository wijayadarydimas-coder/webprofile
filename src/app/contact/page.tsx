import { db } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";
import ContactSection from "@/components/home/ContactSection";

export const metadata = {
  title: "Contact & Collaboration — Wijaya Dary Dimas",
  description: "Get in touch with Wijaya Dary Dimas for project collaborations, engineering discussions, or professional opportunities.",
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
