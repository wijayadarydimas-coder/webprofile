"use client";

import { useState, useEffect } from "react";
import { Cpu, Plus, Edit, Trash2, Save, X, ExternalLink, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import type { ResearchItem } from "@/types";

export default function AdminResearchPage() {
  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const loadResearch = () => {
    setLoading(true);
    fetch("/api/admin/content?entity=research")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setResearchList(json.data);
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

  const handleOpenNew = () => {
    setEditingItem({
      id: "",
      title: "",
      summary: "",
      background: "",
      objective: "",
      methodology: "",
      modelModification: "",
      datasetNotes: "",
      publishedStatus: "Penelitian Skripsi",
      repoUrl: "",
      pdfUrl: "",
      orderIndex: researchList.length + 1,
      updatedAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: ResearchItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "research",
          action: "save",
          data: editingItem,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan rincian riset.");
      }

      setStatus({ type: "success", message: "Data penelitian / skripsi berhasil disimpan dan diterapkan!" });
      setIsModalOpen(false);
      loadResearch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setStatus({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus penelitian/skripsi ini secara permanen?")) return;
    try {
      if (id && !id.startsWith("res-")) {
        const res = await fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entity: "research", action: "delete", id }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Gagal menghapus data.");
      }
      setStatus({ type: "success", message: "Data penelitian berhasil dihapus." });
      loadResearch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus";
      setStatus({ type: "error", message: msg });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202228]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#22C55E]" />
            <h1 className="text-xl font-bold text-[#F3F4F6]">Pengelolaan Penelitian &amp; Skripsi</h1>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Kelola karya skripsi utama, publikasi jurnal, paper, maupun proyek riset lanjutan secara fleksibel.
          </p>
        </div>

        <button onClick={handleOpenNew} className="btn-primary text-xs py-2 px-3.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Riset / Skripsi</span>
        </button>
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

      {loading ? (
        <div className="text-xs text-[#71717A]">Memuat data riset &amp; skripsi...</div>
      ) : researchList.length === 0 ? (
        <div className="p-8 rounded-xl bg-[#15171C] border border-[#2B2D34] text-center flex flex-col items-center gap-3">
          <Cpu className="w-8 h-8 text-[#71717A]" />
          <span className="text-sm text-[#F3F4F6] font-medium">Belum ada riset atau skripsi yang tersimpan</span>
          <p className="text-xs text-[#71717A] max-w-sm">
            Klik tombol &quot;Tambah Riset / Skripsi&quot; untuk mendokumentasikan karya penelitian Anda.
          </p>
          <button onClick={handleOpenNew} className="btn-primary text-xs py-2 px-4 mt-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {researchList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3 hover:border-[#6D8DFF]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#6D8DFF]/15 text-[#8B9CFF] border border-[#6D8DFF]/30">
                      {item.publishedStatus || "Penelitian Skripsi"}
                    </span>
                    <span className="text-[11px] text-[#71717A] font-mono">
                      Urutan: {item.orderIndex}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#F3F4F6] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg bg-[#1B1D23] border border-[#2B2D34] hover:border-[#6D8DFF] text-xs text-[#F3F4F6] flex items-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#6D8DFF]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg bg-[#1B1D23] border border-[#2B2D34] hover:border-[#EF4444] text-xs text-[#EF4444] flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>

              {/* Extra details snippet */}
              <div className="pt-3 border-t border-[#202228] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#71717A]">
                <div>
                  <strong className="text-[#A1A1AA]">Modifikasi Model:</strong>{" "}
                  <span className="line-clamp-1">{item.modelModification || "Standard"}</span>
                </div>
                <div>
                  <strong className="text-[#A1A1AA]">Dataset:</strong>{" "}
                  <span className="line-clamp-1">{item.datasetNotes || "Internal"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editor Form */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#15171C] border border-[#2B2D34] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#202228] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#22C55E]" />
                <h2 className="text-sm sm:text-base font-bold text-[#F3F4F6]">
                  {editingItem.id ? "Edit Rincian Riset / Skripsi" : "Tambah Karya Riset Baru"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#71717A] hover:text-[#F3F4F6] hover:bg-[#1B1D23]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#A1A1AA]">Judul Penelitian / Skripsi *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Contoh: Implementasi YOLOv11 Modifikasi Untuk Deteksi APD..."
                  className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A1AA]">Status Publikasi / Kategori</label>
                  <select
                    value={editingItem.publishedStatus}
                    onChange={(e) => setEditingItem({ ...editingItem, publishedStatus: e.target.value })}
                    className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                  >
                    <option value="Penelitian Skripsi">Penelitian Skripsi</option>
                    <option value="Publikasi Jurnal Nasional">Publikasi Jurnal Nasional</option>
                    <option value="Publikasi Jurnal Internasional">Publikasi Jurnal Internasional</option>
                    <option value="Prosiding Seminar / Konferensi">Prosiding Seminar / Konferensi</option>
                    <option value="Eksplorasi AI / R&amp;D">Eksplorasi AI / R&amp;D</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A1AA]">Urutan Tampilan</label>
                  <input
                    type="number"
                    min={1}
                    value={editingItem.orderIndex}
                    onChange={(e) => setEditingItem({ ...editingItem, orderIndex: parseInt(e.target.value) || 1 })}
                    className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#A1A1AA]">Ringkasan Eksekutif (Summary) *</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.summary}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  placeholder="Ringkasan singkat mengenai fokus penelitian dan capaian utamanya..."
                  className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A1AA]">Latar Belakang Masalah</label>
                  <textarea
                    rows={4}
                    value={editingItem.background}
                    onChange={(e) => setEditingItem({ ...editingItem, background: e.target.value })}
                    placeholder="Mengapa penelitian ini penting? Masalah apa yang dipecahkan?"
                    className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A1AA]">Tujuan Penelitian</label>
                  <textarea
                    rows={4}
                    value={editingItem.objective}
                    onChange={(e) => setEditingItem({ ...editingItem, objective: e.target.value })}
                    placeholder="Tujuan terukur yang ingin dicapai melalui penelitian ini..."
                    className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#A1A1AA]">Metodologi Penelitian</label>
                <textarea
                  rows={3}
                  value={editingItem.methodology}
                  onChange={(e) => setEditingItem({ ...editingItem, methodology: e.target.value })}
                  placeholder="Tahapan penelitian: studi literatur, akuisisi dataset, augmentasi, training, evaluasi..."
                  className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A1AA]">Modifikasi Model / Arsitektur</label>
                  <textarea
                    rows={3}
                    value={editingItem.modelModification}
                    onChange={(e) => setEditingItem({ ...editingItem, modelModification: e.target.value })}
                    placeholder="Bagian spesifik yang dirombak atau dioptimalkan pada arsitektur model..."
                    className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A1AA]">Karakteristik &amp; Anotasi Dataset</label>
                  <textarea
                    rows={3}
                    value={editingItem.datasetNotes}
                    onChange={(e) => setEditingItem({ ...editingItem, datasetNotes: e.target.value })}
                    placeholder="Jumlah kelas, variasi pencahayaan, sudut kamera, sumber data lapangan..."
                    className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A1AA]">URL GitHub Repository</label>
                  <input
                    type="url"
                    value={editingItem.repoUrl || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, repoUrl: e.target.value })}
                    placeholder="https://github.com/wijayadarydimas-coder/..."
                    className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A1AA]">URL Dokumen Skripsi / Paper (PDF)</label>
                  <input
                    type="url"
                    value={editingItem.pdfUrl || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, pdfUrl: e.target.value })}
                    placeholder="https://... atau /uploads/skripsi.pdf"
                    className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#202228] flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs py-2 px-5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Menyimpan..." : "Simpan Riset"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
