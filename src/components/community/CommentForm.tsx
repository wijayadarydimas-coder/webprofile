"use client";

import { useState } from "react";
import { Send, LogIn, MessageSquare } from "lucide-react";
import type { User } from "@/types";

interface CommentFormProps {
  currentUser: User | null;
  onSubmit: (content: string) => Promise<void>;
  onOpenAuth: () => void;
}

export default function CommentForm({ currentUser, onSubmit, onOpenAuth }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-6 rounded-2xl bg-[#171A24] border border-[#292D39] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-[#F1F2F5]">
            Ingin bergabung dalam diskusi?
          </span>
          <p className="text-xs text-[#7D8496]">
            Masuk atau daftarkan akun komunitas Anda untuk menulis komentar dan tanggapan.
          </p>
        </div>

        <button onClick={onOpenAuth} className="btn-primary shrink-0">
          <LogIn className="w-4 h-4" />
          <span>Masuk / Daftar Akun</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-[#171A24] border border-[#292D39] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#7790FF]" />
          <span className="text-xs font-semibold text-[#F1F2F5]">
            Tulis Komentar sebagai <span className="text-[#96A9FF]">{currentUser.name}</span>
          </span>
        </div>
        <span className="text-[11px] text-[#7D8496] font-mono">
          {content.length}/1000
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          rows={3}
          required
          maxLength={1000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tuliskan pemikiran, tanggapan teknis, atau pertanyaan Anda..."
          className="w-full p-3 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] placeholder-[#7D8496] focus:border-[#7790FF] focus:outline-none transition-colors"
        />

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="btn-primary text-xs py-2 px-4 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? "Mengirimkan..." : "Kirim Komentar"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
