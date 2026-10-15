"use client";

import { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, AlertCircle, Sparkles, Shield, Key } from "lucide-react";
import type { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    aiProvider: "gemini",
    aiModel: "gemini-1.5-flash",
    contactEmail: "",
    enableAiAssistant: true,
    enableComments: true,
    notifyOnComment: false,
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  useEffect(() => {
    fetch("/api/admin/content?entity=settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSettings(json.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat pengaturan:", err);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "settings",
          action: "update",
          data: settings,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan konfigurasi.");

      setSettings(data.data);
      setStatus({ type: "success", message: "Pengaturan sistem berhasil disimpan dan diterapkan!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setStatus({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-[#202228]">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#6D8DFF]" />
          <h1 className="text-xl font-bold text-[#F3F4F6]">Konfigurasi Sistem &amp; AI Assistant</h1>
        </div>
        <p className="text-xs text-[#A1A1AA]">
          Atur parameter penyedia model AI, fitur komentar komunitas, dan keamanan sistem.
        </p>
      </div>

      {status.type && (
        <div
          className={`p-3.5 rounded-lg flex items-center gap-2.5 text-xs ${
            status.type === "success"
              ? "bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]"
              : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Security Best-Practice Banner */}
      <div className="p-4 rounded-xl bg-[#6D8DFF]/10 border border-[#6D8DFF]/25 flex items-start gap-3">
        <Key className="w-5 h-5 text-[#6D8DFF] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-semibold text-[#F3F4F6]">Praktik Keamanan API Key</span>
          <p className="text-[#A1A1AA] leading-relaxed">
            Sesuai standar arsitektur keamanan, <strong>AI_API_KEY</strong> dan kredensial database tidak disimpan melalui input form browser melainkan dimuat secara aman melalui server environment (<code>.env.local</code>). Kunci rahasia Anda tidak akan pernah bocor ke client-side bundle.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 text-xs">
        {/* AI Config */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#8B9CFF]">
            <Sparkles className="w-4 h-4" />
            <h2 className="text-sm font-semibold text-[#F3F4F6]">Konfigurasi AI Assistant</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">Penyedia Layanan AI (Provider)</label>
              <select
                value={settings.aiProvider}
                onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
              >
                <option value="gemini">Google Gemini (Disarankan)</option>
                <option value="openai">OpenAI / Compatible Endpoint</option>
                <option value="custom">Custom Server Endpoint</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">Model Identifier</label>
              <input
                type="text"
                value={settings.aiModel}
                onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                placeholder="gemini-1.5-flash"
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAiAssistant}
                onChange={(e) => setSettings({ ...settings, enableAiAssistant: e.target.checked })}
                className="rounded bg-[#1B1D23] border-[#2B2D34]"
              />
              <span className="text-[#F3F4F6]">Aktifkan Widget Asisten AI di Halaman Publik</span>
            </label>
          </div>
        </div>

        {/* Community & Moderation */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#22C55E]">
            <Shield className="w-4 h-4" />
            <h2 className="text-sm font-semibold text-[#F3F4F6]">Pengaturan Komunitas &amp; Keamanan</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableComments}
                onChange={(e) => setSettings({ ...settings, enableComments: e.target.checked })}
                className="rounded bg-[#1B1D23] border-[#2B2D34]"
              />
              <span className="text-[#F3F4F6]">Aktifkan Kolom Komentar &amp; Diskusi Publik</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyOnComment}
                onChange={(e) => setSettings({ ...settings, notifyOnComment: e.target.checked })}
                className="rounded bg-[#1B1D23] border-[#2B2D34]"
              />
              <span className="text-[#F3F4F6]">Simpan Log Notifikasi untuk Komentar Baru</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 font-semibold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
