"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      if (data.user?.role !== "admin") {
        throw new Error("This account does not have administrator privileges.");
      }

      // Dispatch auth change event so other components update immediately
      window.dispatchEvent(new Event("auth-changed"));
      window.location.href = "/admin";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[#15171C] border border-[#2B2D34] shadow-2xl flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-12 h-12 rounded-xl bg-[#6D8DFF]/15 border border-[#6D8DFF]/30 flex items-center justify-center text-[#6D8DFF]">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#F3F4F6]">Admin Authentication</h1>
        <p className="text-xs text-[#71717A] max-w-xs">
          Sign in to manage profile, projects, research, media assets, and community moderation.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Administrator Email</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 w-4 h-4 text-[#71717A]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wijayadarydimas.dev"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] placeholder-[#71717A] focus:border-[#6D8DFF] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Password</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 w-4 h-4 text-[#71717A]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] placeholder-[#71717A] focus:border-[#6D8DFF] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 mt-2 text-xs font-semibold disabled:opacity-50"
        >
          {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
        </button>
      </form>

      <div className="pt-2 border-t border-[#202228] flex items-center justify-between text-xs text-[#71717A]">
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#F3F4F6] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="font-mono text-[10px]">WDD-Auth v1.0</span>
      </div>
    </div>
  );
}
