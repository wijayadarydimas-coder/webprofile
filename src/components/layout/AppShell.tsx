"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIAssistantModal from "../ai/AIAssistantModal";
import { Sparkles } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-[#101114] text-[#F3F4F6] selection:bg-[#6D8DFF]/30 selection:text-white">
      <Navbar onOpenAi={() => setIsAiOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Persistent Floating AI Trigger for quick accessibility on all pages */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#15171C]/90 hover:bg-[#1B1D23] border border-[#6D8DFF]/40 hover:border-[#6D8DFF] text-xs font-medium text-[#F3F4F6] shadow-xl shadow-black/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
        aria-label="Tanya Asisten AI Wijaya Dary Dimas"
        title="Tanya Asisten AI tentang profil dan proyek"
      >
        <div className="w-5 h-5 rounded-full bg-[#6D8DFF]/20 flex items-center justify-center text-[#6D8DFF] group-hover:rotate-12 transition-transform">
          <Sparkles className="w-3 h-3" />
        </div>
        <span className="hidden sm:inline">Tanya AI</span>
      </button>

      <AIAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
