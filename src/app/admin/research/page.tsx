"use client";

import { useState, useEffect } from "react";
import { Cpu, Save, CheckCircle2, AlertCircle } from "lucide-react";
import type { ResearchItem } from "@/types";

export default function AdminResearchPage() {
  const [research, setResearch] = useState<ResearchItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const loadResearch = () => {
    fetch("/api/admin/content?entity=research")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setResearch(json.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat riset skripsi:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadResearch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!research) return;
    setSaving(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "research",
          action: "save",
          data: research,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan rincian skripsi.");
      }

      setResearch(data.data);
      setStatus({ type: "success", message: "Data penelitian skripsi berhasil diperbarui dan diterapkan!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setStatus({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !research) {
    return <div className="text-xs text-[#71717A]">Memuat data penelitian skripsi...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-[#202228]">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#22C55E]" />
          <h1 className="text-xl font-bold text-[#F3F4F6]">Pengelolaan Penelitian &amp; Skripsi</h1>
        </div>
        <p className="text-xs text-[#A1A1AA]">
          Perbarui judul resmi skripsi, modul modifikasi arsitektur YOLOv11, metodologi, dan link dokumen penelitian.
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

      <form onSubmit={handleSave} className="flex flex-col gap-5 text-xs">
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-[#A1A1AA]">Judul Resmi Penelitian Skripsi</label>
            <input
              type="text"
              required
              value={research.title}
              onChange={(e) => setResearch({ ...research, title: e.target.value })}
              className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">Status Publikasi</label>
              <input
                type="text"
                required
                value={research.publishedStatus}
                onChange={(e) => setResearch({ ...research, publishedStatus: e.target.value })}
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">URL Repository GitHub</label>
              <input
                type="text"
                value={research.repoUrl || ""}
                onChange={(e) => setResearch({ ...research, repoUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">URL Dokumen PDF / Naskah</label>
              <input
                type="text"
                value={research.pdfUrl || ""}
                onChange={(e) => setResearch({ ...research, pdfUrl: e.target.value })}
                placeholder="/files/skripsi.pdf"
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#A1A1AA]">Ringkasan Eksekutif (Summary)</label>
            <textarea
              rows={3}
              required
              value={research.summary}
              onChange={(e) => setResearch({ ...research, summary: e.target.value })}
              className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">Latar Belakang Masalah</label>
              <textarea
                rows={4}
                value={research.background}
                onChange={(e) => setResearch({ ...research, background: e.target.value })}
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">Tujuan Penelitian</label>
              <textarea
                rows={4}
                value={research.objective}
                onChange={(e) => setResearch({ ...research, objective: e.target.value })}
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">Metode Penelitian &amp; Pipeline</label>
              <textarea
                rows={4}
                value={research.methodology}
                onChange={(e) => setResearch({ ...research, methodology: e.target.value })}
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">Modifikasi Model YOLOv11</label>
              <textarea
                rows={4}
                value={research.modelModification}
                onChange={(e) => setResearch({ ...research, modelModification: e.target.value })}
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#A1A1AA]">Catatan Dataset &amp; Pengujian</label>
            <textarea
              rows={3}
              value={research.datasetNotes}
              onChange={(e) => setResearch({ ...research, datasetNotes: e.target.value })}
              className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 font-semibold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Data Skripsi"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
