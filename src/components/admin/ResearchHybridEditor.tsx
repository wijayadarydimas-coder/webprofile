"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Save,
  Eye,
  Columns,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Layers,
  Cpu,
  Database,
  Bell,
  CheckCircle2,
  BookOpen,
  FileText,
  Smartphone,
  Monitor,
  AlertCircle,
  Check,
  RotateCcw,
  Code,
  Table as TableIcon,
  Quote,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link2,
  ExternalLink,
} from "lucide-react";
import ExternalLinksEditor from "@/components/admin/ExternalLinksEditor";
import { MarkdownRenderer } from "@/components/research/ResearchDocViewer";
import ProviderBadge from "@/components/ui/ProviderBadge";
import { GithubIcon } from "@/components/ui/Icons";
import type {
  ResearchItem,
  ResearchSectionItem,
  ResearchSectionType,
} from "@/types";

interface Props {
  initialItem: ResearchItem;
  onSave: (item: ResearchItem) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

// Pre-configured Writing Templates (Specification 4.5)
const WRITING_TEMPLATES: {
  id: string;
  title: string;
  type: ResearchSectionType;
  description: string;
  template: string;
}[] = [
  {
    id: "latar-belakang",
    title: "Latar Belakang Masalah",
    type: "text",
    description: "Konteks permasalahan, kondisi saat ini, kesenjangan, dan urgensi penelitian.",
    template: `### 1. Konteks Permasalahan
Perkembangan industri manufaktur dan konstruksi menuntut protokol Keselamatan dan Kesehatan Kerja (K3) yang ketat. Kepatuhan terhadap Alat Pelindung Diri (APD) merupakan garis pertahanan utama dalam mencegah cedera fatal di tempat kerja.

### 2. Kondisi Saat Ini
Metode pengawasan manual oleh petugas keselamatan sering kali menghadapi kendala keterbatasan rentang penglihatan, kelelahan, dan ketidakmampuan memantau area luas secara kontinu selama 24 jam.

### 3. Kesenjangan yang Ingin Diteliti
Implementasi deteksi objek berbasis computer vision standar sering mengalami degradasi akurasi saat mendeteksi APD berdimensi kecil (seperti sarung tangan dan sepatu kerja) pada variasi pencahayaan ekstrem dan jarak jauh.

### 4. Alasan Penelitian Dilakukan
Penelitian ini mengembangkan arsitektur deteksi objek yang dioptimalkan secara komputasi dengan mekanisme intervensi alarm instan untuk meminimalkan risiko kecelakaan kerja secara otomatis.`,
  },
  {
    id: "tujuan",
    title: "Tujuan Penelitian & Sasaran",
    type: "text",
    description: "Tujuan utama dan sasaran terukur yang ingin dicapai melalui eksperimen.",
    template: `### Sasaran Utama Penelitian
1. Mengembangkan model modifikasi ekstraksi fitur multi-skala untuk meningkatkan sensitivitas deteksi APD berukuran kecil.
2. Membangun dataset terstandarisasi untuk 4 kelas APD utama (helm, rompi, sarung tangan, sepatu keselamatan).
3. Merancang pipeline inferensi real-time yang mampu beroperasi di atas 30 FPS pada perangkat edge computing.
4. Mengintegrasikan subsistem alarm audio-visual yang terpicu otomatis saat terjadi pelanggaran zona bahaya.`,
  },
  {
    id: "metodologi",
    title: "Metodologi Penelitian",
    type: "methodology",
    description: "Pendekatan penelitian, alur eksperimen, tahapan validasi, dan batasan uji.",
    template: `### 1. Pendekatan Penelitian
Penelitian ini menerapkan metodologi eksperimental rekayasa perangkat lunak cerdas (*Applied Deep Learning Engineering*) dengan siklus iteratif pengumpulan data, pelatihan model, dan validasi lapangan.

### 2. Tahapan Alur Eksperimen
- **Tahap 1 — Akuisisi Data:** Perekaman video CCTV simulasi pabrik dan pengumpulan citra sekunder.
- **Tahap 2 — Anotasi & Augmentasi:** Pelabelan format YOLO bounding box dengan augmentasi mosaik, penyesuaian kontras, dan rotasi.
- **Tahap 3 — Modifikasi Arsitektur:** Integrasi modul perhatian dan penyesuaian head deteksi pada arsitektur YOLO.
- **Tahap 4 — Pelatihan & Hyperparameter Tuning:** Training menggunakan optimizer AdamW, cosine annealing learning rate, dan mixed precision (FP16).
- **Tahap 5 — Evaluasi Kuantitatif:** Pengukuran metrik presisi, recall, mAP@0.5, serta latency inferensi.

> [!NOTE]
> Seluruh eksperimen komputasi dijalankan menggunakan lingkungan CUDA dengan batch size terkontrol untuk menjaga konsistensi bobot gradien.`,
  },
  {
    id: "modifikasi-model",
    title: "Modifikasi Arsitektur Model",
    type: "architecture",
    description: "Arsitektur awal, perombakan backbone/neck, alasan perubahan, dan evaluasi performa.",
    template: `### 1. Arsitektur Awal (Baseline)
Arsitektur baseline menggunakan varian standar YOLOv11 yang memiliki keunggulan kecepatan tinggi namun cenderung mengalami *false negative* pada objek dengan resolusi spasial rendah di bawah 32x32 piksel.

### 2. Perubahan yang Dilakukan
- **Modul Neck BiFPN:** Menggantikan modul concatenation standar dengan weighted bi-directional feature pyramid network untuk fusi fitur lintas-skala yang lebih efektif.
- **P2 Small-Object Detection Head:** Menambahkan head deteksi resolusi tinggi khusus untuk menangkap objek berdimensi mikro seperti sarung tangan kerja pada jarak kamera medium.
- **Attention Mechanism:** Menanamkan modul Efficient Multi-Head Self-Attention pada lapisan teratas backbone.

### 3. Dampak yang Diharapkan
Peningkatan deteksi APD kecil tanpa mengorbankan kecepatan inferensi real-time (target frame time < 35 ms).`,
  },
  {
    id: "dataset",
    title: "Akuisisi Dataset & Batasan Pengujian",
    type: "dataset",
    description: "Karakteristik dataset, distribusi kelas, rasio split, dan skenario pengujian.",
    template: `### Karakteristik Dataset
Dataset penelitian terdiri dari kumpulan citra lingkungan kerja industri dengan variasi kondisi pencahayaan (siang, mendung, malam/lampu neon) dan sudut kamera (CCTV sudut tinggi 45° dan eye-level).

| Kelas APD | Jumlah Anotasi Bounding Box | Rasio Distribusi |
|---|---|---|
| Helm Proyek (Hardhat) | 2,450 | 32% |
| Rompi Keselamatan (Vest) | 2,180 | 28% |
| Sarung Tangan (Gloves) | 1,840 | 24% |
| Sepatu Keselamatan (Boots) | 1,230 | 16% |

### Pembagian Dataset (Split)
- **Training Set (70%):** Digunakan untuk optimasi bobot model.
- **Validation Set (20%):** Digunakan untuk tuning hyperparameter dan early stopping.
- **Testing Set (10%):** Citra independen yang belum pernah dilihat model untuk evaluasi akhir.`,
  },
  {
    id: "hasil",
    title: "Pengujian & Hasil Evaluasi",
    type: "results",
    description: "Tabel metrik kuantitatif perbandingan model dan analisis capaian.",
    template: `### Hasil Perbandingan Kinerja Deteksi

| Model | mAP@0.5 (%) | mAP@0.5:0.95 (%) | Precision (%) | Recall (%) | FPS (TensorRT) |
|---|---|---|---|---|---|
| Baseline YOLOv11n | 83.4 | 60.1 | 85.2 | 81.7 | 48.2 |
| YOLOv11 Modifikasi | 89.6 | 66.8 | 91.4 | 88.3 | 42.1 |
| **Selisih Peningkatan** | **+6.2%** | **+6.7%** | **+6.2%** | **+6.6%** | -6.1 FPS |

> [!TIP]
> Peningkatan paling signifikan tercatat pada deteksi kelas sarung tangan (+9.4% mAP) berkat penambahan high-resolution feature head P2.`,
  },
  {
    id: "alarm",
    title: "Integrasi Alarm Otomatis",
    type: "integration",
    description: "Logika pemetaan zona bahaya, aturan durasi pelanggaran, dan pemicu alarm.",
    template: `### Logika Pemetaan Zona Keselamatan (Zone Compliance)
Sistem memproses bounding box hasil inferensi model terhadap zona poligon virtual (*danger zone*) yang ditentukan administrator area kerja:

1. **Deteksi Kehadiran:** Sistem mendeteksi manusia berada di dalam batas poligon zona bahaya.
2. **Pemeriksaan Kepatuhan APD:** Algoritma memeriksa apakah objek *person* tersebut beririsan (IoU > 0.4) dengan helm, rompi, sarung tangan, dan sepatu.
3. **Threshold Waktu Pelanggaran:** Apabila pekerja terdeteksi tanpa kelengkapan APD selama lebih dari 3 frame berturut-turut (~0.1 detik), pelanggaran dikonfirmasi (*state: VIOLATION*).
4. **Triger Sinyal Alarm:** Controller mengaktifkan relay output untuk membunyikan sirine dan menyalakan lampu strobo peringatan, serta mencatat log insiden.`,
  },
  {
    id: "referensi",
    title: "Referensi & Dokumen Pendukung",
    type: "references",
    description: "Daftar pustaka ilmiah, dokumen skripsi, dan tautan repositori.",
    template: `### Daftar Pustaka Terpilih
1. Redmon, J., et al. (2016). *You Only Look Once: Unified, Real-Time Object Detection*. Proceedings of the IEEE CVPR.
2. Bochkovskiy, A., et al. (2020). *YOLOv4: Optimal Speed and Accuracy of Object Detection*. arXiv preprint arXiv:2004.10934.
3. Wang, C. Y., et al. (2023). *YOLOv7: Trainable bag-of-freebies sets new state-of-the-art for real-time object detectors*. IEEE CVPR.
4. Tan, M., & Le, Q. V. (2020). *EfficientDet: Scalable and efficient object detection*. IEEE CVPR.`,
  },
];

export default function ResearchHybridEditor({
  initialItem,
  onSave,
  onCancel,
  isSaving,
}: Props) {
  // Research State
  const [research, setResearch] = useState<ResearchItem>(initialItem);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [techInput, setTechInput] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // View modes: "editor" | "split" | "preview"
  const [viewMode, setViewMode] = useState<"editor" | "split" | "preview">("split");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Modals & Popovers
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // AI Assistant Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAction, setAiAction] = useState<string>("academic");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    suggestion: string;
    explanation?: string;
    keyImprovements?: string[];
  } | null>(null);
  const [aiReviewedSuggestion, setAiReviewedSuggestion] = useState<string>("");
  const [aiError, setAiError] = useState<string | null>(null);

  // Textarea Ref for inserting markdown snippets
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize sections if empty
  useEffect(() => {
    if (!research.sections || research.sections.length === 0) {
      // Build starter sections from existing legacy fields or template
      const fallbackSections: ResearchSectionItem[] = [
        {
          id: "sec-ringkasan",
          title: "Ringkasan Eksekutif",
          type: "text",
          content: research.summary || "Ringkasan fokus penelitian dan capaian utamanya.",
          orderIndex: 1,
          isVisible: true,
        },
        {
          id: "sec-latar-belakang",
          title: "Latar Belakang Masalah",
          type: "text",
          content: research.background || WRITING_TEMPLATES[0].template,
          orderIndex: 2,
          isVisible: true,
        },
        {
          id: "sec-tujuan",
          title: "Tujuan Penelitian & Sasaran",
          type: "text",
          content: research.objective || WRITING_TEMPLATES[1].template,
          orderIndex: 3,
          isVisible: true,
        },
        {
          id: "sec-metodologi",
          title: "Metodologi Penelitian",
          type: "methodology",
          content: research.methodology || WRITING_TEMPLATES[2].template,
          orderIndex: 4,
          isVisible: true,
        },
        {
          id: "sec-modifikasi",
          title: "Modifikasi Arsitektur Model",
          type: "architecture",
          content: research.modelModification || WRITING_TEMPLATES[3].template,
          orderIndex: 5,
          isVisible: true,
        },
        {
          id: "sec-dataset",
          title: "Akuisisi Dataset & Batasan Pengujian",
          type: "dataset",
          content: research.datasetNotes || WRITING_TEMPLATES[4].template,
          orderIndex: 6,
          isVisible: true,
        },
      ];
      setResearch((prev) => ({ ...prev, sections: fallbackSections }));
    }
  }, []);

  // Track active section safely
  const currentSections = research.sections || [];
  const activeSection: ResearchSectionItem | undefined =
    currentSections[activeSectionIndex] || currentSections[0];

  const updateActiveSection = (patch: Partial<ResearchSectionItem>) => {
    if (!activeSection) return;
    const updated = currentSections.map((sec, idx) =>
      idx === activeSectionIndex ? { ...sec, ...patch } : sec
    );
    setResearch((prev) => ({ ...prev, sections: updated }));
    setHasChanges(true);
  };

  // Section Management Actions
  const handleAddSectionFromTemplate = (template: (typeof WRITING_TEMPLATES)[0]) => {
    const newSection: ResearchSectionItem = {
      id: `sec-${Date.now()}`,
      title: template.title,
      type: template.type,
      content: template.template,
      orderIndex: currentSections.length + 1,
      isVisible: true,
    };
    const updated = [...currentSections, newSection];
    setResearch((prev) => ({ ...prev, sections: updated }));
    setActiveSectionIndex(updated.length - 1);
    setTemplateModalOpen(false);
    setHasChanges(true);
  };

  const handleDuplicateSection = (index: number) => {
    const target = currentSections[index];
    if (!target) return;
    const cloned: ResearchSectionItem = {
      ...target,
      id: `sec-${Date.now()}`,
      title: `${target.title} (Salinan)`,
      orderIndex: currentSections.length + 1,
    };
    const updated = [...currentSections, cloned];
    setResearch((prev) => ({ ...prev, sections: updated }));
    setActiveSectionIndex(updated.length - 1);
    setHasChanges(true);
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSections.length) return;

    const copy = [...currentSections];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Recalculate order indices
    const normalized = copy.map((sec, idx) => ({ ...sec, orderIndex: idx + 1 }));
    setResearch((prev) => ({ ...prev, sections: normalized }));
    setActiveSectionIndex(targetIndex);
    setHasChanges(true);
  };

  const handleDeleteSection = (index: number) => {
    const secToDelete = currentSections[index];
    if (!secToDelete) return;
    const updated = currentSections
      .filter((_, idx) => idx !== index)
      .map((sec, idx) => ({ ...sec, orderIndex: idx + 1 }));
    setResearch((prev) => ({ ...prev, sections: updated }));
    setActiveSectionIndex(Math.max(0, index - 1));
    setDeleteConfirmId(null);
    setHasChanges(true);
  };

  const handleToggleVisibility = (index: number) => {
    const updated = currentSections.map((sec, idx) =>
      idx === index ? { ...sec, isVisible: sec.isVisible === false ? true : false } : sec
    );
    setResearch((prev) => ({ ...prev, sections: updated }));
    setHasChanges(true);
  };

  // Technologies chips management
  const handleAddTech = () => {
    const clean = techInput.trim();
    if (!clean) return;
    const current = research.technologies || [];
    if (!current.includes(clean)) {
      setResearch((prev) => ({ ...prev, technologies: [...current, clean] }));
      setHasChanges(true);
    }
    setTechInput("");
  };

  const handleRemoveTech = (tech: string) => {
    const current = research.technologies || [];
    setResearch((prev) => ({
      ...prev,
      technologies: current.filter((t) => t !== tech),
    }));
    setHasChanges(true);
  };

  // Markdown Toolbar Insert Helper
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const el = textareaRef.current;
    if (!el || !activeSection) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const oldText = activeSection.content || "";
    const selected = oldText.substring(start, end);
    const replacement = `${prefix}${selected || "teks"}${suffix}`;

    const newContent =
      oldText.substring(0, start) + replacement + oldText.substring(end);

    updateActiveSection({ content: newContent });

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 0);
  };

  // AI Assistant Call
  const handleCallAi = async () => {
    if (!activeSection) return;
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const res = await fetch("/api/ai/research-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: aiAction,
          sectionTitle: activeSection.title,
          content: activeSection.content,
          researchTitle: research.title,
          executiveSummary: research.summary,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memproses bantuan AI.");
      }

      setAiResult(json.data);
      setAiReviewedSuggestion(json.data.suggestion);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memanggil AI.";
      setAiError(msg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (!aiReviewedSuggestion) return;
    updateActiveSection({ content: aiReviewedSuggestion });
    setAiModalOpen(false);
    setAiResult(null);
  };

  // Save changes
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!research.title.trim()) {
      alert("Judul penelitian wajib diisi.");
      return;
    }

    // Sync legacy columns to maintain 100% backward compatibility
    const bg = currentSections.find((s) => s.title.toLowerCase().includes("latar belakang"))?.content || research.background;
    const obj = currentSections.find((s) => s.title.toLowerCase().includes("tujuan"))?.content || research.objective;
    const met = currentSections.find((s) => s.title.toLowerCase().includes("metodologi"))?.content || research.methodology;
    const mod = currentSections.find((s) => s.title.toLowerCase().includes("modifikasi"))?.content || research.modelModification;
    const dat = currentSections.find((s) => s.title.toLowerCase().includes("dataset"))?.content || research.datasetNotes;

    const payload: ResearchItem = {
      ...research,
      background: bg,
      objective: obj,
      methodology: met,
      modelModification: mod,
      datasetNotes: dat,
      updatedAt: new Date().toISOString(),
    };

    await onSave(payload);
    setHasChanges(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16">
      {/* TOP STICKY BAR: Editor Navigation & Status */}
      <div className="sticky top-20 z-40 p-4 rounded-2xl bg-[#141720]/95 backdrop-blur-md border border-[#232733] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (hasChanges && !confirm("Ada perubahan yang belum disimpan. Yakin ingin kembali?")) return;
              onCancel();
            }}
            className="p-2 rounded-xl bg-[#1B1E29] border border-[#292D39] text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors cursor-pointer"
            title="Kembali ke Daftar Riset"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7790FF]/15 text-[#96A9FF] border border-[#7790FF]/30">
                Hybrid Research Editor
              </span>
              {hasChanges ? (
                <span className="text-[11px] font-mono text-[#F59E0B] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                  Belum disimpan
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[#22C55E] flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Tersimpan
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base font-bold text-[#F1F2F5] max-w-md truncate">
              {research.title || "Penelitian Baru"}
            </h1>
          </div>
        </div>

        {/* View Mode & Actions Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layout Mode Switcher */}
          <div className="flex items-center bg-[#1B1E29] p-1 rounded-xl border border-[#292D39]">
            <button
              onClick={() => setViewMode("editor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "editor" ? "bg-[#7790FF] text-white shadow-sm" : "text-[#8E95A8] hover:text-[#F1F2F5]"
              }`}
              title="Tampilkan hanya editor"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Editor Saja</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "split" ? "bg-[#7790FF] text-white shadow-sm" : "text-[#8E95A8] hover:text-[#F1F2F5]"
              }`}
              title="Bagi layar (Editor + Pratinjau Langsung)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Bagi Layar</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "preview" ? "bg-[#7790FF] text-white shadow-sm" : "text-[#8E95A8] hover:text-[#F1F2F5]"
              }`}
              title="Tampilkan hanya pratinjau publik"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pratinjau Penuh</span>
            </button>
          </div>

          {/* AI Writing Assistant Trigger */}
          <button
            onClick={() => {
              setAiError(null);
              setAiResult(null);
              setAiModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7790FF]/20 to-[#A855F7]/20 border border-[#7790FF]/40 text-[#96A9FF] hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Buka Asisten Penulisan AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Asisten AI</span>
          </button>

          {/* Save Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="btn-primary text-xs py-2 px-4 shadow-lg shadow-[#7790FF]/25 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-PANE WORKSPACE: LEFT PANE (METADATA + SECTIONS + EDITOR) | RIGHT PANE (LIVE PREVIEW) */}
      <div className={`grid gap-6 ${viewMode === "split" ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"}`}>
        {/* ================= LEFT / EDITOR PANE ================= */}
        {viewMode !== "preview" && (
          <div className={`flex flex-col gap-6 ${viewMode === "split" ? "lg:col-span-7" : "col-span-1"}`}>
            {/* AREA 1: STRUCTURED METADATA PANEL (Specification 4.2) */}
            <details open className="p-5 sm:p-6 rounded-2xl bg-[#141720] border border-[#232733] flex flex-col gap-4 group">
              <summary className="font-bold text-xs uppercase tracking-wider text-[#96A9FF] cursor-pointer flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#7790FF]" />
                  <span>1. Metadata &amp; Konteks Penelitian</span>
                </span>
                <span className="text-[11px] font-mono text-[#7D8496] group-open:rotate-180 transition-transform">
                  &darr;
                </span>
              </summary>

              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-[#1E222E]">
                {/* Judul Penelitian */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A6B5]">Judul Penelitian / Skripsi *</label>
                  <input
                    type="text"
                    required
                    value={research.title}
                    onChange={(e) => {
                      setResearch({ ...research, title: e.target.value });
                      setHasChanges(true);
                    }}
                    placeholder="Implementasi YOLOv11 Modifikasi Untuk Deteksi APD..."
                    className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                  />
                </div>

                {/* Published Status & Urutan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#A1A6B5]">Kategori / Status Publikasi</label>
                    <select
                      value={research.publishedStatus}
                      onChange={(e) => {
                        setResearch({ ...research, publishedStatus: e.target.value });
                        setHasChanges(true);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                    >
                      <option value="Penelitian Skripsi">Penelitian Skripsi</option>
                      <option value="Publikasi Jurnal Nasional">Publikasi Jurnal Nasional</option>
                      <option value="Publikasi Jurnal Internasional">Publikasi Jurnal Internasional</option>
                      <option value="Prosiding Seminar / Konferensi">Prosiding Seminar / Konferensi</option>
                      <option value="Eksplorasi AI / R&amp;D">Eksplorasi AI / R&amp;D</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#A1A6B5]">Urutan Tampilan</label>
                    <input
                      type="number"
                      min={1}
                      value={research.orderIndex}
                      onChange={(e) => {
                        setResearch({ ...research, orderIndex: parseInt(e.target.value) || 1 });
                        setHasChanges(true);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Institusi & Program Studi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#A1A6B5]">Institusi Akademik</label>
                    <input
                      type="text"
                      value={research.institution || ""}
                      onChange={(e) => {
                        setResearch({ ...research, institution: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="Universitas Muhammadiyah Purwokerto"
                      className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#A1A6B5]">Program Studi</label>
                    <input
                      type="text"
                      value={research.studyProgram || ""}
                      onChange={(e) => {
                        setResearch({ ...research, studyProgram: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="S1 Teknik Informatika"
                      className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Ringkasan Eksekutif */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A6B5]">Ringkasan Eksekutif (Executive Summary) *</label>
                  <textarea
                    rows={3}
                    required
                    value={research.summary}
                    onChange={(e) => {
                      setResearch({ ...research, summary: e.target.value });
                      setHasChanges(true);
                    }}
                    placeholder="Ringkasan singkat mengenai fokus penelitian dan capaian utamanya..."
                    className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                  />
                </div>

                {/* Technologies Tag Chips */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-[#A1A6B5]">Teknologi / Model Kunci</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      placeholder="Ketik teknologi (misal: YOLOv11, PyTorch, TensorRT, CVAT) lalu tekan Enter atau tombol Tambah"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="btn-secondary text-xs py-2 px-3 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>

                  {research.technologies && research.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {research.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#1E2330] text-[#96A9FF] border border-[#2C3244] flex items-center gap-1.5"
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(tech)}
                            className="text-[#7D8496] hover:text-[#EF4444]"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* URLs Repo & Paper */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#A1A6B5]">URL GitHub Repository</label>
                    <input
                      type="url"
                      value={research.repoUrl || ""}
                      onChange={(e) => {
                        setResearch({ ...research, repoUrl: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="https://github.com/wijayadarydimas-coder/..."
                      className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#A1A6B5]">URL Dokumen Skripsi / Paper (PDF)</label>
                    <input
                      type="url"
                      value={research.pdfUrl || ""}
                      onChange={(e) => {
                        setResearch({ ...research, pdfUrl: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="https://... atau /uploads/skripsi.pdf"
                      className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Multi-Provider Links (Roboflow, Hugging Face, etc.) */}
                <div className="pt-2">
                  <ExternalLinksEditor
                    links={research.externalLinks || []}
                    onChange={(updatedLinks) => {
                      setResearch({ ...research, externalLinks: updatedLinks });
                      setHasChanges(true);
                    }}
                    title="Tautan Ekosistem Riset (Roboflow, Hugging Face, Papers With Code, dll.)"
                    description="Hubungkan karya riset skripsi dengan dataset Roboflow Universe, Hugging Face weights, CVAT annotator task, atau Kaggle notebook."
                  />
                </div>
              </div>
            </details>

            {/* AREA 2: SECTIONS STRUCTURE MANAGER (Specification 4.3) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#141720] border border-[#232733] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E222E]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#7790FF]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#96A9FF]">
                    2. Struktur &amp; Bagian Penelitian ({currentSections.length})
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setTemplateModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#1E2330] hover:bg-[#282D3D] border border-[#2C3244] text-xs font-medium text-[#F1F2F5] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#7790FF]" />
                  <span>Tambah Bagian / Template</span>
                </button>
              </div>

              {/* List of Section Tabs */}
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {currentSections.map((sec, idx) => {
                  const isSelected = idx === activeSectionIndex;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setActiveSectionIndex(idx)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#1E2332] border-[#7790FF] shadow-sm shadow-[#7790FF]/15"
                          : "bg-[#161922] border-[#242835] hover:border-[#32374A]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[10px] font-mono text-[#7D8496] shrink-0">
                          0{idx + 1}.
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#F1F2F5] truncate">
                              {sec.title}
                            </span>
                            {sec.isVisible === false && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                                Tersembunyi
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#7D8496] block truncate">
                            Tipe: {sec.type} &bull; {sec.content?.length || 0} karakter
                          </span>
                        </div>
                      </div>

                      {/* Action buttons on section card */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {/* Reorder Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, "up")}
                          className="p-1 rounded text-[#7D8496] hover:text-[#F1F2F5] disabled:opacity-30"
                          title="Naikkan urutan"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Reorder Down */}
                        <button
                          type="button"
                          disabled={idx === currentSections.length - 1}
                          onClick={() => handleMoveSection(idx, "down")}
                          className="p-1 rounded text-[#7D8496] hover:text-[#F1F2F5] disabled:opacity-30"
                          title="Turunkan urutan"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicateSection(idx)}
                          className="p-1 rounded text-[#7D8496] hover:text-[#7790FF]"
                          title="Duplikasi bagian"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Visibility */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(idx)}
                          className={`p-1 rounded ${
                            sec.isVisible === false ? "text-[#EF4444]" : "text-[#7D8496] hover:text-[#F1F2F5]"
                          }`}
                          title={sec.isVisible === false ? "Tampilkan bagian ini" : "Sembunyikan bagian ini"}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete with Confirmation */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(sec.id)}
                          className="p-1 rounded text-[#7D8496] hover:text-[#EF4444]"
                          title="Hapus bagian ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AREA 3: CONTENT EDITOR FOR ACTIVE SECTION (Specification 4.4) */}
            {activeSection && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#141720] border border-[#232733] flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E222E]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#7790FF] block">
                      Edit Bagian Aktif 0{activeSectionIndex + 1}
                    </span>
                    <h3 className="font-bold text-sm text-[#F1F2F5]">
                      {activeSection.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={activeSection.type}
                      onChange={(e) =>
                        updateActiveSection({
                          type: e.target.value as ResearchSectionType,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#181B26] border border-[#282C3A] text-xs text-[#96A9FF] font-mono focus:outline-none"
                    >
                      <option value="text">Teks / Artikel</option>
                      <option value="methodology">Metodologi</option>
                      <option value="architecture">Arsitektur Model</option>
                      <option value="dataset">Dataset</option>
                      <option value="results">Hasil &amp; Metrik</option>
                      <option value="integration">Integrasi Sistem</option>
                      <option value="references">Referensi</option>
                    </select>
                  </div>
                </div>

                {/* Section Title Editor */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A6B5]">Judul Bagian</label>
                  <input
                    type="text"
                    value={activeSection.title}
                    onChange={(e) => updateActiveSection({ title: e.target.value })}
                    className="px-3.5 py-2 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                  />
                </div>

                {/* MARKDOWN FORMATTING TOOLBAR */}
                <div className="flex items-center gap-1 p-2 rounded-xl bg-[#181B26] border border-[#262A38] flex-wrap">
                  <button
                    type="button"
                    onClick={() => insertMarkdown("**", "**")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Tebal (**bold**)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("*", "*")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Miring (*italic*)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("## ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Heading 2 (## Judul)"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("### ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Heading 3 (### Subjudul)"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("- ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Bullet List (- poin)"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("1. ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Numbered List (1. poin)"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("```python\n# Kode atau arsitektur\n", "\n```")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Blok Kode (```)"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown(
                        "\n| Parameter | Nilai |\n|---|---|\n| Resolusi Input | 640x640 |\n| Batch Size | 16 |\n"
                      )
                    }
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Tabel Markdown"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("> [!NOTE]\n> ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Catatan Teknis Callout (> [!NOTE])"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("[Judul Tautan](", ")")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Tautan Web [Teks](url)"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAiError(null);
                        setAiResult(null);
                        setAiModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#7790FF]/15 text-[#96A9FF] hover:bg-[#7790FF]/25 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      title="Minta AI mengecek teks ini"
                    >
                      <Sparkles className="w-3 h-3 text-[#A855F7]" />
                      <span>Bantuan AI</span>
                    </button>
                  </div>
                </div>

                {/* Markdown Content Textarea */}
                <div className="flex flex-col gap-1.5">
                  <textarea
                    ref={textareaRef}
                    rows={12}
                    value={activeSection.content}
                    onChange={(e) => updateActiveSection({ content: e.target.value })}
                    placeholder="Tuliskan isi bagian ini menggunakan format Markdown bersih..."
                    className="w-full p-4 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs font-mono text-[#E2E8F0] leading-relaxed focus:border-[#7790FF] focus:outline-none"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#7D8496]">
                    <span>Format: Markdown &bull; Aman &amp; Tersanitasi</span>
                    <span>{activeSection.content?.length || 0} karakter</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= RIGHT / LIVE PREVIEW PANE (Specification 4.7) ================= */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div className={`${viewMode === "split" ? "lg:col-span-5" : "col-span-1"} flex flex-col gap-4`}>
            {/* Preview Toolbar */}
            <div className="p-3.5 rounded-2xl bg-[#141720] border border-[#232733] flex items-center justify-between gap-2 shadow-md">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#7790FF]" />
                <span className="text-xs font-bold text-[#F1F2F5]">
                  Pratinjau Publik (Live Renderer)
                </span>
              </div>

              {/* Device Frame Switcher */}
              <div className="flex items-center bg-[#1B1E29] p-0.5 rounded-lg border border-[#292D39]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewDevice === "desktop" ? "bg-[#7790FF] text-white" : "text-[#7D8496] hover:text-[#F1F2F5]"
                  }`}
                  title="Tampilan Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewDevice === "mobile" ? "bg-[#7790FF] text-white" : "text-[#7D8496] hover:text-[#F1F2F5]"
                  }`}
                  title="Tampilan Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Preview Container Frame */}
            <div
              className={`rounded-3xl border border-[#232733] bg-[#0D0F14] overflow-hidden shadow-2xl p-4 sm:p-6 transition-all ${
                previewDevice === "mobile" ? "max-w-sm mx-auto border-[#383E52]" : "w-full"
              }`}
            >
              {/* Simulated Browser Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1E222E] text-[10px] font-mono text-[#7D8496]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
                  <span className="ml-2 text-[#96A9FF]">/research</span>
                </div>
                <span>Mode Pratinjau</span>
              </div>

              {/* Research Header Preview */}
              <div className="p-5 rounded-2xl bg-[#141720] border border-[#232733] flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7790FF]/15 text-[#96A9FF] border border-[#7790FF]/30">
                    {research.publishedStatus || "Penelitian Skripsi"}
                  </span>
                  <span className="text-[10px] font-mono text-[#7D8496]">
                    {research.institution || "Universitas Muhammadiyah Purwokerto"}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[#F1F2F5] leading-snug">
                  {research.title || "Judul Penelitian"}
                </h2>

                <p className="text-xs text-[#A1A6B5] leading-relaxed">
                  {research.summary || "Ringkasan eksekutif penelitian..."}
                </p>

                {research.technologies && research.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {research.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1B1E29] text-[#A1A6B5] border border-[#272B38]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* External links preview */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1E222E]">
                  {research.repoUrl && (
                    <span className="btn-primary text-[10px] py-1 px-2.5">
                      <GithubIcon className="w-3 h-3" />
                      <span>GitHub</span>
                    </span>
                  )}
                  {research.pdfUrl && (
                    <span className="btn-secondary text-[10px] py-1 px-2.5">
                      <FileText className="w-3 h-3" />
                      <span>PDF</span>
                    </span>
                  )}
                  {research.externalLinks?.map((l, i) => (
                    <ProviderBadge key={i} link={l} size="sm" />
                  ))}
                </div>
              </div>

              {/* Rendered Sections List */}
              <div className="flex flex-col gap-6">
                {currentSections
                  .filter((s) => s.isVisible !== false)
                  .map((sec, idx) => (
                    <div
                      key={sec.id}
                      className="p-5 rounded-2xl bg-[#141720] border border-[#232733] flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2 pb-2 border-b border-[#1E222E]">
                        <span className="text-[10px] font-mono text-[#7790FF]">
                          0{idx + 1}.
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-[#F1F2F5]">
                          {sec.title}
                        </h3>
                      </div>
                      <div className="pt-2">
                        <MarkdownRenderer content={sec.content} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: ADD SECTION FROM TEMPLATE (Specification 4.5) ================= */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141720] border border-[#272B38] rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#202431] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7790FF]" />
                <h3 className="text-sm font-bold text-[#F1F2F5]">
                  Pilih Template Penulisan Penelitian
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTemplateModalOpen(false)}
                className="p-1.5 rounded-lg text-[#7D8496] hover:text-[#F1F2F5] hover:bg-[#1C202C]"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-3">
              <p className="text-xs text-[#A1A6B5]">
                Pilih struktur modul penelitian yang ingin ditambahkan. Template ini berfungsi sebagai kerangka panduan profesional yang dapat Anda sesuaikan.
              </p>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {WRITING_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleAddSectionFromTemplate(tmpl)}
                    className="p-4 rounded-2xl bg-[#181B26] border border-[#262A38] hover:border-[#7790FF] flex flex-col gap-1.5 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#F1F2F5] group-hover:text-[#96A9FF]">
                        {tmpl.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2332] text-[#7790FF]">
                        {tmpl.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E95A8]">
                      {tmpl.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CONFIRM DELETE SECTION ================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141720] border border-[#EF4444]/40 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#EF4444]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-[#F1F2F5]">
                Konfirmasi Hapus Bagian
              </h3>
            </div>
            <p className="text-xs text-[#A1A6B5] leading-relaxed">
              Apakah Anda yakin ingin menghapus bagian ini? Konten yang telah tertulis pada bagian ini akan hilang secara permanen setelah disimpan.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn-secondary text-xs py-2 px-3.5"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = currentSections.findIndex((s) => s.id === deleteConfirmId);
                  if (idx !== -1) handleDeleteSection(idx);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-medium transition-colors"
              >
                Hapus Bagian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: AI WRITING ASSISTANT (Specification 4.6) ================= */}
      {aiModalOpen && activeSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141720] border border-[#272B38] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#202431] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#A855F7]" />
                <div>
                  <h3 className="text-sm font-bold text-[#F1F2F5]">
                    Asisten Penulisan AI — {activeSection.title}
                  </h3>
                  <p className="text-[11px] text-[#7D8496]">
                    Analisis draf, perbaikan tata bahasa akademik, dan penyempurnaan struktur teks secara aman.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="p-1.5 rounded-lg text-[#7D8496] hover:text-[#F1F2F5] hover:bg-[#1C202C]"
              >
                &times;
              </button>
            </div>

            {/* AI Control Panel */}
            <div className="p-5 border-b border-[#202431] bg-[#161923] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs font-medium text-[#A1A6B5]">Pilih Tindakan AI:</label>
                <select
                  value={aiAction}
                  onChange={(e) => setAiAction(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#1B1E29] border border-[#2B3142] text-xs text-[#96A9FF] font-medium focus:outline-none"
                >
                  <option value="academic">Rapikan Bahasa Akademik Formal</option>
                  <option value="grammar">Perbaiki Tata Bahasa &amp; Ejaan</option>
                  <option value="concise">Buat Lebih Ringkas &amp; Padat</option>
                  <option value="expand">Kembangkan Kerangka Menjadi Draf</option>
                  <option value="structure">Susun Ulang Agar Lebih Terstruktur</option>
                  <option value="consistency">Periksa Konsistensi Istilah Teknis</option>
                  <option value="missing_info">Identifikasi Informasi yang Masih Kurang</option>
                  <option value="check_alignment">Periksa Keselarasan dengan Judul &amp; Ringkasan</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleCallAi}
                disabled={aiLoading}
                className="btn-primary text-xs py-2 px-4 shadow-md shadow-[#7790FF]/25 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>{aiLoading ? "Memproses AI..." : "Jalankan Asisten AI"}</span>
              </button>
            </div>

            {/* AI Comparison View (Specification 4.6 step 4: Teks asli vs Hasil AI) */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {aiError && (
                <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Text Pane */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#8E95A8] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Teks Asli Penulis (Saat Ini)</span>
                  </span>
                  <div className="p-4 rounded-2xl bg-[#11131A] border border-[#222532] text-xs font-mono text-[#A1A6B5] h-72 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {activeSection.content || "Belum ada konten."}
                  </div>
                </div>

                {/* AI Suggestion Pane */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#96A9FF] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
                      <span>Saran AI (Dapat Diedit Sebelum Diterapkan)</span>
                    </span>
                    {aiResult && (
                      <span className="text-[10px] font-mono text-[#22C55E]">
                        Selesai diproses
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={11}
                    value={aiReviewedSuggestion}
                    onChange={(e) => setAiReviewedSuggestion(e.target.value)}
                    placeholder={
                      aiLoading
                        ? "AI sedang meninjau dan menyempurnakan tulisan..."
                        : "Klik tombol 'Jalankan Asisten AI' di atas untuk menghasilkan saran alternatif."
                    }
                    className="w-full p-4 rounded-2xl bg-[#181B26] border border-[#2B3142] text-xs font-mono text-[#E2E8F0] h-72 overflow-y-auto leading-relaxed focus:border-[#7790FF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Explanations & Key Improvements Chips */}
              {aiResult && (
                <div className="p-4 rounded-2xl bg-[#161924] border border-[#262B3A] flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-[#F1F2F5]">
                    Catatan Perbaikan Asisten AI:
                  </span>
                  {aiResult.explanation && (
                    <p className="text-xs text-[#A1A6B5] leading-relaxed">
                      {aiResult.explanation}
                    </p>
                  )}

                  {aiResult.keyImprovements && aiResult.keyImprovements.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {aiResult.keyImprovements.map((imp, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#1E2332] text-[#96A9FF] border border-[#2B3144] flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-[#22C55E]" />
                          <span>{imp}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Modal Footer */}
            <div className="p-5 border-t border-[#202431] flex items-center justify-between gap-3 bg-[#12141C]">
              <span className="text-[11px] text-[#7D8496]">
                AI tidak otomatis menimpa naskah Anda tanpa persetujuan.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={!aiReviewedSuggestion || aiLoading}
                  onClick={handleApplyAiSuggestion}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Terapkan ke Bagian Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
