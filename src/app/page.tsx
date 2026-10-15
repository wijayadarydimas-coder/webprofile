import { db } from "@/lib/db";
import AppShell from "@/components/layout/AppShell";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import TimelineSection from "@/components/experience/TimelineSection";
import ResearchSection from "@/components/research/ResearchSection";
import ContactSection from "@/components/home/ContactSection";

export default async function HomePage() {
  const [profile, projects, experiences, educations, researchItems] = await Promise.all([
    db.getProfile(),
    db.getProjects({ publishedOnly: true }),
    db.getExperiences(),
    db.getEducation(),
    db.getResearchItems(),
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

      {/* 6. Contact Section */}
      <ContactSection profile={profile} />
    </AppShell>
  );
}
