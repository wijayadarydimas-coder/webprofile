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
    title: "Background & Problem Statement",
    type: "text",
    description: "Problem context, current conditions, research gaps, and urgency of the study.",
    template: `### 1. Problem Context
The rapid evolution of manufacturing and construction industries demands rigorous Occupational Health and Safety (OHS/HSE) compliance. Personal Protective Equipment (PPE) adherence serves as the frontline defense in mitigating workplace hazards and preventing injuries.

### 2. Current Industry Limitations
Manual surveillance conducted by safety supervisors suffers from human visual fatigue, blind spots, and an inability to maintain 24/7 continuous monitoring across large-scale facilities.

### 3. Identified Research Gap
Standard computer vision object detection algorithms frequently experience degraded sensitivity and high false-negative rates when identifying small-dimension PPE items (such as gloves and safety shoes) under extreme lighting and high-angle surveillance cameras.

### 4. Proposed Solution
This research introduces an optimized deep learning architecture integrated with automated audio-visual alarm triggering to enforce real-time PPE compliance and reduce workplace accident risks automatically.`,
  },
  {
    id: "tujuan",
    title: "Research Objectives & Key Results",
    type: "text",
    description: "Primary goals, quantitative milestones, and expected experimental targets.",
    template: `### Primary Research Objectives
1. Develop an architectural enhancement for multi-scale feature extraction to boost detection sensitivity on small-scale PPE objects.
2. Build a standardized annotation dataset covering 4 key industrial PPE classes (helmets, safety vests, gloves, and boots).
3. Architect an end-to-end real-time inference pipeline operating above 30 FPS on edge-computing devices.
4. Integrate an automated audio-visual alert subsystem triggered when safety violations occur in hazardous zones.`,
  },
  {
    id: "metodologi",
    title: "Methodology & Experimental Pipeline",
    type: "methodology",
    description: "Engineering approach, experimental stages, validation procedures, and testing parameters.",
    template: `### 1. Engineering Approach
This study follows an Applied Deep Learning Engineering methodology featuring iterative cycles of dataset curation, architectural tuning, and physical validation.

### 2. Experimental Stages
- **Stage 1 — Data Acquisition:** Synthetic and simulated factory CCTV recordings combined with field imagery.
- **Stage 2 — Annotation & Augmentation:** Standardized bounding-box labeling with mosaic, contrast jittering, and rotational augmentations.
- **Stage 3 — Architectural Adaptation:** Attention module insertion and multi-scale detection head re-engineering.
- **Stage 4 — Training & Hyperparameter Tuning:** Mixed-precision FP16 training with AdamW optimizer and cosine annealing schedules.
- **Stage 5 — Quantitative Evaluation:** Metrics benchmarks including Precision, Recall, mAP@0.5, and inference latency.

> [!NOTE]
> All computational experiments were executed in an isolated CUDA environment with deterministic batch sizes to maintain gradient consistency.`,
  },
  {
    id: "modifikasi-model",
    title: "Model Architecture Modifications",
    type: "architecture",
    description: "Baseline architecture, backbone/neck modifications, technical rationale, and impact.",
    template: `### 1. Baseline Architecture
The baseline model utilizes standard YOLOv11, known for high inference throughput but prone to false negatives on low spatial resolution targets (< 32x32 pixels).

### 2. Proposed Architectural Enhancements
- **BiFPN Neck Module:** Replacing standard concatenation with weighted bi-directional feature pyramid networks for superior cross-scale feature fusion.
- **P2 Small-Object Detection Head:** Integrating a high-resolution detection head specifically dedicated to detecting small objects such as work gloves at medium camera distances.
- **Attention Mechanism:** Embedding an Efficient Multi-Head Self-Attention module within the uppermost backbone layers.

### 3. Expected Performance Impact
Substantially improved small PPE recall without compromising real-time inference deadlines (target frame time < 35 ms).`,
  },
  {
    id: "dataset",
    title: "Dataset Acquisition & Evaluation Boundaries",
    type: "dataset",
    description: "Dataset characteristics, class distributions, train/val/test splits, and validation setup.",
    template: `### Dataset Characteristics
The dataset encompasses diverse industrial workplace scenarios featuring varied lighting conditions (daylight, overcast, nighttime neon) and surveillance angles (45° elevated CCTV and eye-level perspectives).

| PPE Class | Bounding Box Annotations | Distribution Ratio |
|---|---|---|
| Hardhat / Helmet | 2,450 | 32% |
| Safety Vest | 2,180 | 28% |
| Protective Gloves | 1,840 | 24% |
| Safety Boots | 1,230 | 16% |

### Dataset Partitioning (Split)
- **Training Set (70%):** Model weights optimization and feature representations.
- **Validation Set (20%):** Hyperparameter tuning and early stopping calibration.
- **Testing Set (10%):** Held-out independent test set for final benchmarking.`,
  },
  {
    id: "hasil",
    title: "Testing & Evaluation Results",
    type: "results",
    description: "Quantitative metrics comparison table and performance analysis.",
    template: `### Comparative Detection Performance

| Model | mAP@0.5 (%) | mAP@0.5:0.95 (%) | Precision (%) | Recall (%) | FPS (TensorRT) |
|---|---|---|---|---|---|
| Baseline YOLOv11n | 83.4 | 60.1 | 85.2 | 81.7 | 48.2 |
| Modified YOLOv11 | 89.6 | 66.8 | 91.4 | 88.3 | 42.1 |
| **Improvement Delta** | **+6.2%** | **+6.7%** | **+6.2%** | **+6.6%** | -6.1 FPS |

> [!TIP]
> The most significant accuracy leap was recorded in the glove class (+9.4% mAP) owing to the P2 high-resolution detection head.`,
  },
  {
    id: "alarm",
    title: "Automated Alarm & Event Integration",
    type: "integration",
    description: "Zone compliance logic, violation duration thresholds, and alarm triggering mechanisms.",
    template: `### Danger Zone Compliance Logic
The system processes model detection bounding boxes against designated virtual polygon safety perimeters (*danger zones*):

1. **Worker Presence Detection:** System identifies person bounding boxes within danger zone boundaries.
2. **PPE Compliance Verification:** Evaluates intersection-over-union (IoU > 0.4) between the detected worker and required PPE classes (helmet, vest, gloves, boots).
3. **Violation Time Threshold:** If non-compliance persists for > 3 consecutive frames (~0.1 seconds), a confirmed safety violation event is registered (*state: VIOLATION*).
4. **Alarm Signal Dispatch:** Actuates hardware relays for sirens and strobe lights, recording a timestamped audit event log.`,
  },
  {
    id: "referensi",
    title: "References & Scientific Citations",
    type: "references",
    description: "Peer-reviewed literature, thesis documentation, and source code repositories.",
    template: `### Selected References
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
        throw new Error(json.error || "Failed to process AI assistance.");
      }

      setAiResult(json.data);
      setAiReviewedSuggestion(json.data.suggestion);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while calling AI.";
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
      alert("Research title is required.");
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
              if (hasChanges && !confirm("You have unsaved changes. Are you sure you want to go back?")) return;
              onCancel();
            }}
            className="p-2 rounded-xl bg-[#1B1E29] border border-[#292D39] text-[#A1A6B5] hover:text-[#F1F2F5] transition-colors cursor-pointer"
            title="Back to Research List"
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
                  Unsaved changes
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[#22C55E] flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Saved
                </span>
              )}
            </div>
            <h1 className="text-sm sm:text-base font-bold text-[#F1F2F5] max-w-md truncate">
              {research.title || "New Research"}
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
              title="Show editor only"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Editor Only</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "split" ? "bg-[#7790FF] text-white shadow-sm" : "text-[#8E95A8] hover:text-[#F1F2F5]"
              }`}
              title="Split screen (Editor + Live Preview)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split Screen</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "preview" ? "bg-[#7790FF] text-white shadow-sm" : "text-[#8E95A8] hover:text-[#F1F2F5]"
              }`}
              title="Show full preview only"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Full Preview</span>
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
            title="Open AI Writing Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>AI Assistant</span>
          </button>

          {/* Save Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="btn-primary text-xs py-2 px-4 shadow-lg shadow-[#7790FF]/25 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
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
                  <span>1. Research Metadata &amp; Context</span>
                </span>
                <span className="text-[11px] font-mono text-[#7D8496] group-open:rotate-180 transition-transform">
                  &darr;
                </span>
              </summary>

              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-[#1E222E]">
                {/* Judul Penelitian */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A6B5]">Research / Thesis Title *</label>
                  <input
                    type="text"
                    required
                    value={research.title}
                    onChange={(e) => {
                      setResearch({ ...research, title: e.target.value });
                      setHasChanges(true);
                    }}
                    placeholder="e.g. Modified YOLOv11 Implementation for PPE Detection..."
                    className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                  />
                </div>

                {/* Published Status & Urutan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#A1A6B5]">Category / Publication Status</label>
                    <select
                      value={research.publishedStatus}
                      onChange={(e) => {
                        setResearch({ ...research, publishedStatus: e.target.value });
                        setHasChanges(true);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                    >
                      <option value="Thesis Research">Thesis Research</option>
                      <option value="National Journal Publication">National Journal Publication</option>
                      <option value="International Journal Publication">International Journal Publication</option>
                      <option value="Conference Proceedings">Conference Proceedings</option>
                      <option value="AI Exploration / R&amp;D">AI Exploration / R&amp;D</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#A1A6B5]">Display Order</label>
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
                    <label className="text-xs font-medium text-[#A1A6B5]">Academic Institution</label>
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
                    <label className="text-xs font-medium text-[#A1A6B5]">Study Program / Major</label>
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
                  <label className="text-xs font-medium text-[#A1A6B5]">Executive Summary *</label>
                  <textarea
                    rows={3}
                    required
                    value={research.summary}
                    onChange={(e) => {
                      setResearch({ ...research, summary: e.target.value });
                      setHasChanges(true);
                    }}
                    placeholder="Brief summary of research focus and primary achievements..."
                    className="px-3.5 py-2.5 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                  />
                </div>

                {/* Technologies Tag Chips */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-[#A1A6B5]">Key Technologies / Models</label>
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
                      placeholder="Enter technology (e.g. YOLOv11, PyTorch, TensorRT, CVAT) then press Enter or Add"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="btn-secondary text-xs py-2 px-3 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
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
                    <label className="text-xs font-medium text-[#A1A6B5]">GitHub Repository URL</label>
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
                    <label className="text-xs font-medium text-[#A1A6B5]">Thesis Document / Paper URL (PDF)</label>
                    <input
                      type="url"
                      value={research.pdfUrl || ""}
                      onChange={(e) => {
                        setResearch({ ...research, pdfUrl: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="https://... or /uploads/thesis.pdf"
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
                    title="Research Ecosystem Links (Roboflow, Hugging Face, Papers With Code, etc.)"
                    description="Connect this research with Roboflow Universe datasets, Hugging Face weights, CVAT annotator tasks, or Kaggle notebooks."
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
                    2. Research Structure &amp; Sections ({currentSections.length})
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setTemplateModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#1E2330] hover:bg-[#282D3D] border border-[#2C3244] text-xs font-medium text-[#F1F2F5] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#7790FF]" />
                  <span>Add Section / Template</span>
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
                                Hidden
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#7D8496] block truncate">
                            Type: {sec.type} &bull; {sec.content?.length || 0} chars
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
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Reorder Down */}
                        <button
                          type="button"
                          disabled={idx === currentSections.length - 1}
                          onClick={() => handleMoveSection(idx, "down")}
                          className="p-1 rounded text-[#7D8496] hover:text-[#F1F2F5] disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicateSection(idx)}
                          className="p-1 rounded text-[#7D8496] hover:text-[#7790FF]"
                          title="Duplicate section"
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
                          title={sec.isVisible === false ? "Show this section" : "Hide this section"}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete with Confirmation */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(sec.id)}
                          className="p-1 rounded text-[#7D8496] hover:text-[#EF4444]"
                          title="Delete this section"
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
                      Edit Active Section 0{activeSectionIndex + 1}
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
                      <option value="text">Text / Article</option>
                      <option value="methodology">Methodology</option>
                      <option value="architecture">Model Architecture</option>
                      <option value="dataset">Dataset</option>
                      <option value="results">Results &amp; Metrics</option>
                      <option value="integration">System Integration</option>
                      <option value="references">References</option>
                    </select>
                  </div>
                </div>

                {/* Section Title Editor */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A6B5]">Section Title</label>
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
                    title="Bold (**bold**)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("*", "*")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Italic (*italic*)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("## ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Heading 2 (## Title)"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("### ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Heading 3 (### Subtitle)"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("- ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Bullet List (- item)"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("1. ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Numbered List (1. item)"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("```python\n# Code or architecture\n", "\n```")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Code Block (```)"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdown(
                        "\n| Parameter | Value |\n|---|---|\n| Input Resolution | 640x640 |\n| Batch Size | 16 |\n"
                      )
                    }
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Markdown Table"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("> [!NOTE]\n> ")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Technical Callout Note (> [!NOTE])"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("[Link Title](", ")")}
                    className="p-1.5 rounded-lg text-[#A1A6B5] hover:text-[#F1F2F5] hover:bg-[#202432]"
                    title="Web Link [Text](url)"
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
                      title="Ask AI to review this text"
                    >
                      <Sparkles className="w-3 h-3 text-[#A855F7]" />
                      <span>AI Assistant</span>
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
                    placeholder="Write section content using clean Markdown format..."
                    className="w-full p-4 rounded-xl bg-[#181B26] border border-[#282C3A] text-xs font-mono text-[#E2E8F0] leading-relaxed focus:border-[#7790FF] focus:outline-none"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#7D8496]">
                    <span>Format: Markdown &bull; Safe &amp; Sanitized</span>
                    <span>{activeSection.content?.length || 0} chars</span>
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
                  Public Live Preview
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
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewDevice === "mobile" ? "bg-[#7790FF] text-white" : "text-[#7D8496] hover:text-[#F1F2F5]"
                  }`}
                  title="Mobile View"
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
                <span>Preview Mode</span>
              </div>

              {/* Research Header Preview */}
              <div className="p-5 rounded-2xl bg-[#141720] border border-[#232733] flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7790FF]/15 text-[#96A9FF] border border-[#7790FF]/30">
                    {research.publishedStatus || "Thesis Research"}
                  </span>
                  <span className="text-[10px] font-mono text-[#7D8496]">
                    {research.institution || "Universitas Muhammadiyah Purwokerto"}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[#F1F2F5] leading-snug">
                  {research.title || "Research Title"}
                </h2>

                <p className="text-xs text-[#A1A6B5] leading-relaxed">
                  {research.summary || "Executive summary of the research..."}
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
                  Choose Research Writing Template
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
                Select a research module structure to add. These templates serve as a professional guide frame that you can customize.
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
                Confirm Section Deletion
              </h3>
            </div>
            <p className="text-xs text-[#A1A6B5] leading-relaxed">
              Are you sure you want to delete this section? Any written content in this section will be permanently removed upon saving.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn-secondary text-xs py-2 px-3.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = currentSections.findIndex((s) => s.id === deleteConfirmId);
                  if (idx !== -1) handleDeleteSection(idx);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-medium transition-colors"
              >
                Delete Section
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
                    AI Writing Assistant — {activeSection.title}
                  </h3>
                  <p className="text-[11px] text-[#7D8496]">
                    Draft analysis, academic phrasing enhancements, and structural polish safely.
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
                <label className="text-xs font-medium text-[#A1A6B5]">Select AI Action:</label>
                <select
                  value={aiAction}
                  onChange={(e) => setAiAction(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#1B1E29] border border-[#2B3142] text-xs text-[#96A9FF] font-medium focus:outline-none"
                >
                  <option value="academic">Polish Formal Academic Phrasing</option>
                  <option value="grammar">Fix Grammar &amp; Spelling</option>
                  <option value="concise">Make More Concise &amp; Clear</option>
                  <option value="expand">Expand Outline into Detailed Draft</option>
                  <option value="structure">Reorganize for Better Structure</option>
                  <option value="consistency">Check Technical Terminology Consistency</option>
                  <option value="missing_info">Identify Missing Information</option>
                  <option value="check_alignment">Check Alignment with Title &amp; Summary</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleCallAi}
                disabled={aiLoading}
                className="btn-primary text-xs py-2 px-4 shadow-md shadow-[#7790FF]/25 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>{aiLoading ? "Processing AI..." : "Run AI Assistant"}</span>
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
                    <span>Original Draft (Current)</span>
                  </span>
                  <div className="p-4 rounded-2xl bg-[#11131A] border border-[#222532] text-xs font-mono text-[#A1A6B5] h-72 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {activeSection.content || "No content yet."}
                  </div>
                </div>

                {/* AI Suggestion Pane */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#96A9FF] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
                      <span>AI Suggestion (Editable Before Applying)</span>
                    </span>
                    {aiResult && (
                      <span className="text-[10px] font-mono text-[#22C55E]">
                        Completed
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={11}
                    value={aiReviewedSuggestion}
                    onChange={(e) => setAiReviewedSuggestion(e.target.value)}
                    placeholder={
                      aiLoading
                        ? "AI is reviewing and refining the draft..."
                        : "Click 'Run AI Assistant' above to generate suggestions."
                    }
                    className="w-full p-4 rounded-2xl bg-[#181B26] border border-[#2B3142] text-xs font-mono text-[#E2E8F0] h-72 overflow-y-auto leading-relaxed focus:border-[#7790FF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Explanations & Key Improvements Chips */}
              {aiResult && (
                <div className="p-4 rounded-2xl bg-[#161924] border border-[#262B3A] flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-[#F1F2F5]">
                    AI Assistant Notes &amp; Highlights:
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
                AI will not overwrite your text without your review and approval.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!aiReviewedSuggestion || aiLoading}
                  onClick={handleApplyAiSuggestion}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to this Section</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
