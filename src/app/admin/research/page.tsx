"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";
import ResearchHybridEditor from "@/components/admin/ResearchHybridEditor";
import type { ResearchItem } from "@/types";

export default function AdminResearchPage() {
  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
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
        console.error("Failed to load thesis research:", err);
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
      institution: "Universitas Muhammadiyah Purwokerto",
      studyProgram: "S1 Teknik Informatika",
      technologies: ["YOLOv11", "PyTorch", "Computer Vision"],
      publishedStatus: "Thesis Research",
      repoUrl: "",
      pdfUrl: "",
      externalLinks: [],
      orderIndex: researchList.length + 1,
      updatedAt: new Date().toISOString(),
      sections: [],
    });
  };

  const handleEdit = (item: ResearchItem) => {
    setEditingItem({
      ...item,
      externalLinks: item.externalLinks || [],
      technologies: item.technologies || [],
      sections: item.sections || [],
    });
  };

  const handleSaveHybrid = async (itemToSave: ResearchItem) => {
    setSaving(true);
    setStatus({ type: null, message: "" });

    try {
      const cleanExternalLinks = (itemToSave.externalLinks || [])
        .filter((link) => link && link.url && link.url.trim() !== "")
        .map((link) => {
          const trimmed = link.url.trim();
          const url =
            /^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")
              ? trimmed
              : `https://${trimmed}`;
          return {
            provider: link.provider,
            url,
            label: link.label?.trim() || undefined,
          };
        });

      const payload: ResearchItem = {
        ...itemToSave,
        externalLinks: cleanExternalLinks,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "research",
          action: "save",
          data: payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save research details.");
      }

      setStatus({
        type: "success",
        message:
          "Research documentation saved and synced to database successfully!",
      });
      setEditingItem(null);
      loadResearch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setStatus({ type: "error", message: msg });
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this research/thesis from the database?"))
      return;
    try {
      if (id && !id.startsWith("res-")) {
        const res = await fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entity: "research", action: "delete", id }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to delete data.");
      }
      setStatus({
        type: "success",
        message: "Research entry deleted successfully.",
      });
      loadResearch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      setStatus({ type: "error", message: msg });
    }
  };

  // If currently editing, show dedicated Hybrid Research Editor
  if (editingItem) {
    return (
      <ResearchHybridEditor
        initialItem={editingItem}
        onSave={handleSaveHybrid}
        onCancel={() => setEditingItem(null)}
        isSaving={saving}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202228]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#7790FF]" />
            <h1 className="text-xl font-bold text-[#F3F4F6]">
              Research &amp; Thesis Management (Dark Matter)
            </h1>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Manage technical thesis documentation, journal publications, architecture modules, and AI writing assistance.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="btn-primary text-xs py-2 px-3.5 shadow-lg shadow-[#7790FF]/25 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Research</span>
        </button>
      </div>

      {status.type && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs ${
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
        <div className="text-xs text-[#71717A] py-8 text-center">
          Loading research &amp; thesis data...
        </div>
      ) : researchList.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#141720] border border-[#232733] text-center flex flex-col items-center gap-3">
          <Cpu className="w-8 h-8 text-[#71717A]" />
          <span className="text-sm text-[#F3F4F6] font-medium">
            No research documentation saved yet
          </span>
          <p className="text-xs text-[#71717A] max-w-sm">
            Click &quot;Add New Research&quot; to begin documenting your thesis research using the Hybrid Research Editor.
          </p>
          <button
            onClick={handleOpenNew}
            className="btn-primary text-xs py-2 px-4 mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {researchList.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#141720] border border-[#232733] flex flex-col gap-4 hover:border-[#7790FF]/40 transition-colors shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#7790FF]/15 text-[#96A9FF] border border-[#7790FF]/30">
                      {item.publishedStatus || "Thesis Research"}
                    </span>
                    <span className="text-[11px] text-[#7D8496] font-mono">
                      {item.institution || "Universitas Muhammadiyah Purwokerto"} &bull; {item.studyProgram || "Teknik Informatika"}
                    </span>
                    <span className="text-[11px] text-[#7D8496] font-mono ml-auto">
                      Order: {item.orderIndex}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#F1F2F5] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#A1A6B5] line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Technologies tags */}
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1B1E29] text-[#A1A6B5] border border-[#272B38]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2.5 rounded-xl bg-[#1B1E29] border border-[#282C3A] hover:border-[#7790FF] text-xs text-[#F1F2F5] flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#7790FF]" />
                    <span className="font-medium">Open Hybrid Editor</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 rounded-xl bg-[#1B1E29] border border-[#282C3A] hover:border-[#EF4444] text-xs text-[#EF4444] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="Delete this document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Summary of Sections */}
              <div className="pt-3 border-t border-[#1E222E] flex items-center justify-between text-[11px] text-[#7D8496] flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#7790FF]" />
                  <span>
                    Document Structure:{" "}
                    <strong className="text-[#A1A6B5]">
                      {item.sections?.length || 6} Sections
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {item.repoUrl && (
                    <span className="text-[#96A9FF] font-mono">GitHub &bull; OK</span>
                  )}
                  {item.pdfUrl && (
                    <span className="text-[#96A9FF] font-mono">PDF &bull; OK</span>
                  )}
                  {item.externalLinks && item.externalLinks.length > 0 && (
                    <span className="text-[#96A9FF] font-mono">
                      {item.externalLinks.length} Providers Connected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
