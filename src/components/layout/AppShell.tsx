"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIAssistantModal from "../ai/AIAssistantModal";
import { Sparkles } from "lucide-react";

const GlobalParticleAtmosphere = dynamic(
  () => import("../particles/GlobalParticleAtmosphere"),
  { ssr: false }
);

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    const handleOpenAi = () => setIsAiOpen(true);
    window.addEventListener("open-ai-modal", handleOpenAi);
    return () => window.removeEventListener("open-ai-modal", handleOpenAi);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D12] text-[#F1F2F5] selection:bg-[#7790FF]/30 selection:text-white relative">
      {/* One Global Shared Ambient Particle Layer for the entire page */}
      <GlobalParticleAtmosphere />

      {/* Floating Global Navigation */}
      <Navbar onOpenAi={() => setIsAiOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Persistent Floating AI Trigger for quick accessibility on all pages */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#171A24]/90 hover:bg-[#1F2330] border border-[#292D39] hover:border-[#7790FF]/60 text-xs font-medium text-[#F1F2F5] shadow-xl shadow-black/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        aria-label="Tanya Asisten AI Wijaya Dary Dimas"
        title="Tanya Asisten AI tentang profil dan proyek"
      >
        <div className="w-5 h-5 rounded-full bg-[#7790FF]/15 flex items-center justify-center text-[#7790FF] group-hover:rotate-12 transition-transform">
          <Sparkles className="w-3 h-3" />
        </div>
        <span className="hidden sm:inline">Tanya AI</span>
      </button>

      <AIAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}

