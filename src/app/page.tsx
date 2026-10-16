import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import AppShell from "@/components/layout/AppShell";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import TimelineSection from "@/components/experience/TimelineSection";
import ResearchSection from "@/components/research/ResearchSection";
import HomeCommunitySection from "@/components/home/HomeCommunitySection";
import ContactSection from "@/components/home/ContactSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, projects, experiences, educations, researchItems, comments, currentUser] = await Promise.all([
    db.getProfile(),
    db.getProjects({ publishedOnly: true }),
    db.getExperiences(),
    db.getEducation(),
    db.getResearchItems(),
    db.getComments({ includeHidden: false }),
    getCurrentUser(),
  ]);

  const primaryResearch = researchItems[0] || {
    id: "res-1",
    title: "Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis.",
    summary: "Penelitian skripsi mengenai pengembangan arsitektur YOLOv11 yang dimodifikasi untuk mendeteksi kelengkapan APD.",
    publishedStatus: "Penelitian Skripsi",
    repoUrl: "https://github.com/wijayadarydimas-coder",
    pdfUrl: "",
  };

  return (
    <AppShell>
      {/* 1. Hero Section */}
      <HeroSection profile={profile} />

      {/* 2. About Me Section */}
      <AboutSection profile={profile} />

      {/* 3. Featured Projects Showcase */}
      <FeaturedProjects projects={projects} />

      {/* 4. Experience & Education Timeline */}
      <TimelineSection experiences={experiences} educations={educations} />

      {/* 5. Research & Skripsi Spotlight */}
      <ResearchSection research={primaryResearch as any} />

      {/* 6. Embedded Community Discussion Section */}
      <HomeCommunitySection comments={comments} user={currentUser as any} />

      {/* 7. Contact Section */}
      <ContactSection profile={profile} />
    </AppShell>
  );
}
