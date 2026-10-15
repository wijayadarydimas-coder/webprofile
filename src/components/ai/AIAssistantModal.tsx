"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, RotateCcw, AlertCircle } from "lucide-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya Asisten AI Wijaya Dary Dimas. Saya dapat membantu Anda memahami proyek, penelitian skripsi deteksi APD berbasis YOLOv11, dan pengalaman magang di Badan Informasi Geospasial. Ada yang ingin Anda tanyakan?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setError(null);
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menghubungi asisten AI.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, respon tidak dapat ditampilkan saat ini. Silakan coba kembali atau gunakan topik lain.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Percakapan telah direset. Silakan tanyakan hal seputar portofolio, latar belakang akademis, atau proyek Wijaya Dary Dimas.",
      },
    ]);
    setError(null);
  };

  const presetQuestions = [
    "Jelaskan tentang skripsi YOLOv11 APD",
    "Apa pengalaman di Badan Informasi Geospasial?",
    "Teknologi apa saja yang dikuasai?",
    "Di mana Wijaya menempuh pendidikan?",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div className="relative w-full max-w-xl h-[600px] max-h-[90vh] bg-[#15171C] border border-[#2B2D34] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#2B2D34] bg-[#111317] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1B1D23] border border-[#6D8DFF]/40 flex items-center justify-center text-[#6D8DFF]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span id="ai-modal-title" className="text-xs font-semibold text-[#F3F4F6]">
                Asisten AI — Wijaya Dary Dimas
              </span>
              <span className="text-[10px] text-[#22C55E] flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                Online &bull; Konteks Terverifikasi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md hover:bg-[#1B1D23] text-[#71717A] hover:text-[#A1A1AA] transition-colors"
              title="Reset Percakapan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[#1B1D23] text-[#71717A] hover:text-[#F3F4F6] transition-colors"
              aria-label="Tutup Asisten AI"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-[#6D8DFF] text-white"
                    : "bg-[#1B1D23] border border-[#2B2D34] text-[#8B9CFF]"
                }`}
              >
                {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#6D8DFF] text-white"
                    : "bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-[#71717A] text-xs">
              <Bot className="w-3.5 h-3.5 text-[#6D8DFF] animate-pulse" />
              <span>Menyiapkan respon terverifikasi...</span>
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-[11px] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-t border-[#202228] bg-[#111317]/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {presetQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-2.5 py-1 rounded-md bg-[#1B1D23] hover:bg-[#22252E] border border-[#2B2D34] text-[11px] text-[#A1A1AA] hover:text-[#F3F4F6] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#2B2D34] bg-[#111317]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan sesuatu tentang Wijaya Dary Dimas..."
              className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] placeholder-[#71717A] focus:border-[#6D8DFF] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-lg bg-[#6D8DFF] hover:bg-[#5A7AE8] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Kirim pesan"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex justify-between items-center text-[10px] text-[#71717A] mt-1.5 px-1 font-mono">
            <span>Privasi: Tidak menyimpan histori percakapan</span>
            <span>{input.length}/500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
