"use client";

import { useState } from "react";
import { X, Lock, Mail, User, AlertCircle } from "lucide-react";
import type { User as UserType } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload = mode === "login" ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal melakukan autentikasi.");
      }

      onSuccess(data.user);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-changed"));
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm bg-[#171A24] border border-[#292D39] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-[#F1F2F5]">
              {mode === "login" ? "Masuk ke Komunitas" : "Buat Akun Komunitas"}
            </h3>
            <p className="text-xs text-[#7D8496]">
              {mode === "login"
                ? "Gunakan akun Anda untuk berkomentar dan membalas diskusi."
                : "Daftar dengan cepat menggunakan nama dan email."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#7D8496] hover:text-[#F1F2F5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {mode === "register" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#A1A6B5]">Nama Tampilan</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-[#7D8496]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap / Panggilan"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] placeholder-[#7D8496] focus:border-[#7790FF] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#A1A6B5]">Alamat Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-[#7D8496]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] placeholder-[#7D8496] focus:border-[#7790FF] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#A1A6B5]">Kata Sandi</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-[#7D8496]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] placeholder-[#7D8496] focus:border-[#7790FF] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 py-2 text-xs font-semibold"
          >
            {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar Akun"}
          </button>
        </form>

        <div className="pt-2 border-t border-[#1C202B] text-center text-xs text-[#7D8496]">
          {mode === "login" ? (
            <span>
              Belum memiliki akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="text-[#7790FF] hover:underline font-medium cursor-pointer"
              >
                Daftar sekarang
              </button>
            </span>
          ) : (
            <span>
              Sudah memiliki akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="text-[#7790FF] hover:underline font-medium cursor-pointer"
              >
                Masuk di sini
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
