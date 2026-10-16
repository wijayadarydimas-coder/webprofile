"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, Trash2, AlertCircle } from "lucide-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const DEFAULT_GREETING = "Hai, ada yang bisa saya bantu?";

export default function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const [assistantName, setAssistantName] = useState("Asisten AI — Wijaya Dary Dimas");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: DEFAULT_GREETING,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Ambil nama kustom & pesan sapaan awal asisten AI
  useEffect(() => {
    fetch("/api/site-info")
      .then((res) => res.json())
      .then((data) => {
        const name = data?.aiAssistantName?.trim() || "Asisten AI — Wijaya Dary Dimas";
        setAssistantName(name);

        const customWelcome = data?.aiWelcomeMessage?.trim();
        const fallbackWelcome = `Halo! Salam kenal ya. Saya ${name}, asisten virtual untuk website personal ${data?.brandName || "Wijaya Dary Dimas"}. Ada yang bisa saya bantu atau ingin kamu obrolkan hari ini? 😊`;
        const activeWelcome = customWelcome || fallbackWelcome;

        setMessages((prev) => {
          if (prev.length <= 1 && (prev[0]?.content === DEFAULT_GREETING || prev.length === 0)) {
            return [{ role: "assistant", content: activeWelcome }];
          }
          return prev;
        });
      })
      .catch(() => {});
  }, []);

  // 2. Ambil riwayat percakapan dari PostgreSQL jika user terdaftar / admin sudah login
  useEffect(() => {
    if (isOpen) {
      fetch("/api/ai/history", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data?.loggedIn) {
            setIsLoggedIn(true);
            if (Array.isArray(data.messages) && data.messages.length > 0) {
              setMessages(data.messages);
            }
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

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

    setInput("");
    setError(null);

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses pesan AI.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.message || "Maaf, tidak ada tanggapan." },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan koneksi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Fitur hapus riwayat / reset memory secara sukarela
  const handleClearHistory = async () => {
    if (!confirm("Hapus seluruh riwayat percakapan Anda dengan Asisten AI?")) return;
    try {
      if (isLoggedIn) {
        await fetch("/api/ai/history", { method: "DELETE" });
      }
      setMessages([{ role: "assistant", content: DEFAULT_GREETING }]);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus riwayat";
      setError(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div className="relative w-full max-w-xl h-[560px] max-h-[90vh] bg-[#171A24] border border-[#292D39] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#292D39] bg-[#0B0D12] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1F2330] border border-[#7790FF]/40 flex items-center justify-center text-[#7790FF]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span id="ai-modal-title" className="text-xs font-semibold text-[#F1F2F5]">
                {assistantName}
              </span>
              <span className="text-[10px] text-[#22C55E] flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                Online
                {isLoggedIn && (
                  <span className="text-[#96A9FF] font-sans">&bull; Memori Tersimpan</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Tombol Hapus Riwayat Percakapan (Memory) Sukarela */}
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#EF4444]/15 text-[#7D8496] hover:text-[#EF4444] transition-colors text-xs cursor-pointer"
              title="Hapus seluruh riwayat percakapan Anda"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Hapus Riwayat</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#1F2330] text-[#7D8496] hover:text-[#F1F2F5] transition-colors cursor-pointer"
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
                    ? "bg-[#7790FF] text-white"
                    : "bg-[#1F2330] border border-[#292D39] text-[#96A9FF]"
                }`}
              >
                {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#7790FF] text-white"
                    : "bg-[#1F2330] border border-[#292D39] text-[#F1F2F5]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-[#7D8496] text-xs">
              <Bot className="w-3.5 h-3.5 text-[#7790FF] animate-pulse" />
              <span>Sedang mengetik jawaban...</span>
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

        {/* Input Bar */}
        <div className="p-3 border-t border-[#292D39] bg-[#0B0D12]">
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
              maxLength={800}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan atau tanyakan apa saja..."
              className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] placeholder-[#7D8496] focus:border-[#7790FF] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-lg bg-[#7790FF] hover:bg-[#5E7DFE] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Kirim pesan"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex justify-end items-center text-[10px] text-[#7D8496] mt-1.5 px-1 font-mono">
            <span>{input.length}/800</span>
          </div>
        </div>
      </div>
    </div>
  );
}
