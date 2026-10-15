"use client";

import { useState } from "react";
import { Cpu, Save, CheckCircle2, AlertCircle } from "lucide-react";
import type { ResearchItem } from "@/types";

export default function AdminResearchPage() {
  const [research, setResearch] = useState<ResearchItem>({
    id: "res-1",
    title:
      "Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis.",
    summary:
      "Penelitian skripsi mengenai pengembangan model deteksi objek modifikasi YOLOv11 untuk mengidentifikasi 4 kelas Alat Pelindung Diri (APD) keselamatan kerja secara simultan dengan integrasi peringatan otomatis.",
    background:
      "Tingginya angka kecelakaan kerja pada sektor konstruksi dan industri manufaktur sebagian besar dipicu oleh kelalaian pekerja dalam memakai APD lengkap. Diperlukan sistem pengawasan digital otomatis yang mampu mendeteksi pelanggaran secara real-time.",
    objective:
      "Mengembangkan model deteksi modifikasi YOLOv11 yang efisien dalam mengklasifikasikan helm, rompi, sarung tangan, dan sepatu pelindung, serta menghubungkan hasil inferensi dengan sistem alarm audio-visual otomatis.",
    methodology:
      "Metodologi mencakup: studi literatur, akuisisi dan anotasi dataset APD, modifikasi arsitektur model YOLOv11 pada modul ekstraksi fitur, proses training dan validasi, serta pengujian sistem alarm otomatis di lingkungan uji coba.",
    modelModification:
      "Optimalisasi penangkapan fitur multi-skala guna meminimalisir miss-detection pada objek berskala kecil dan sering terhalang (seperti sarung tangan dan sepatu), serta mempertahankan frame rate tinggi untuk streaming kamera.",
    datasetNotes:
      "Dataset dikurasi secara terarah mencakup beragam sudut pandang kamera pengawas, variasi pencahayaan ruangan/lapangan, dan berbagai warna APD standar keselamatan.",
    publishedStatus: "Penelitian Skripsi",
    repoUrl: "https://github.com/wijayadarydimas-coder",
    pdfUrl: "",
    orderIndex: 1,
    updatedAt: new Date().toISOString(),
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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

      setStatus({ type: "success", message: "Data penelitian skripsi berhasil diperbarui!" });
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
