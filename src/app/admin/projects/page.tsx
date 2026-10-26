"use client";

import { useState, useEffect } from "react";
import { FolderKanban, Plus, Edit, Trash2, ExternalLink, CheckCircle2, AlertCircle, X, Upload } from "lucide-react";
import ExternalLinksEditor from "@/components/admin/ExternalLinksEditor";
import type { Project } from "@/types";

const SUGGESTED_CATEGORIES = [
  "Computer Vision",
  "Deep Learning & AI",
  "Geospatial & GIS",
  "Full-Stack",
  "Web Development",
  "Mobile App",
  "System Architecture",
  "Cloud & DevOps",
  "Data Science & Analytics",
  "Embedded Systems & IoT",
  "Robotics & Automation",
  "Cybersecurity",
  "Open Source Tool",
  "Other",
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProj, setEditingProj] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const loadProjects = () => {
    setLoading(true);
    fetch("/api/admin/content?entity=projects")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProjects(json.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenNew = () => {
    setEditingProj({
      id: "",
      slug: "",
      title: "",
      shortDescription: "",
      fullDescription: "",
      problem: "",
      solution: "",
      results: "",
      category: "Computer Vision",
      technologies: ["Python"],
      coverImage: "/images/project-yolo.svg",
      repoUrl: "",
      liveUrl: "",
      externalLinks: [],
      featured: false,
      published: true,
      orderIndex: projects.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setTechInput("Python");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj) return;
    setSaving(true);
    setStatus({ type: null, message: "" });

    try {
      const cleanExternalLinks = (editingProj.externalLinks || [])
        .filter((link) => link && link.url && link.url.trim() !== "")
        .map((link) => {
          const trimmed = link.url.trim();
          const url = /^https?:\/\//i.test(trimmed) || trimmed.startsWith("/") ? trimmed : `https://${trimmed}`;
          return {
            provider: link.provider,
            url,
            label: link.label?.trim() || undefined,
          };
        });

      const parsedTechs = techInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const rawSlug =
        editingProj.slug?.trim() ||
        editingProj.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const cleanSlug =
        rawSlug
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, "") || `proj-${Date.now()}`;

      const cleanRepoUrl = editingProj.repoUrl?.trim()
        ? /^https?:\/\//i.test(editingProj.repoUrl.trim()) || editingProj.repoUrl.trim().startsWith("/")
          ? editingProj.repoUrl.trim()
          : `https://${editingProj.repoUrl.trim()}`
        : "";

      const cleanLiveUrl = editingProj.liveUrl?.trim()
        ? /^https?:\/\//i.test(editingProj.liveUrl.trim()) || editingProj.liveUrl.trim().startsWith("/")
          ? editingProj.liveUrl.trim()
          : `https://${editingProj.liveUrl.trim()}`
        : "";

      const payload = {
        ...editingProj,
        id: editingProj.id?.trim() ? editingProj.id.trim() : undefined,
        slug: cleanSlug,
        title: editingProj.title.trim(),
        shortDescription: editingProj.shortDescription?.trim() || editingProj.title.trim(),
        fullDescription:
          editingProj.fullDescription?.trim() ||
          editingProj.shortDescription?.trim() ||
          editingProj.title.trim(),
        problem: editingProj.problem?.trim() || "",
        solution: editingProj.solution?.trim() || "",
        results: editingProj.results?.trim() || "",
        category: editingProj.category?.trim() || "Computer Vision",
        coverImage: editingProj.coverImage?.trim() || "/images/project-yolo.svg",
        repoUrl: cleanRepoUrl,
        liveUrl: cleanLiveUrl,
        technologies: parsedTechs.length > 0 ? parsedTechs : [techInput.trim() || "General"],
        externalLinks: cleanExternalLinks,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "project",
          action: "save",
          data: payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save project.");
      }

      setStatus({ type: "success", message: "Project saved successfully!" });
      setIsModalOpen(false);
      loadProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setStatus({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this project?")) return;
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "project", action: "delete", id }),
      });
      setProjects(projects.filter((p) => p.id !== id));
      setStatus({ type: "success", message: "Project deleted successfully." });
    } catch {
      setStatus({ type: "error", message: "Failed to delete project." });
    }
  };

  const handleUploadCover = async (file: File) => {
    setUploadingImage(true);
    try {
      let uploadFile = file;
      if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
        const { convertImageToWebP } = await import("@/lib/utils/image-converter");
        const conv = await convertImageToWebP(file);
        uploadFile = conv.file;
      }

      const fd = new FormData();
      fd.append("file", uploadFile);
      fd.append("altText", "Project Cover");

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image.");

      if (editingProj) {
        setEditingProj({ ...editingProj, coverImage: data.url });
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202228]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#6D8DFF]" />
            <h1 className="text-xl font-bold text-[#F3F4F6]">Portfolio &amp; Project Management</h1>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Add, edit, adjust ordering, and hide/publish project case studies.
          </p>
        </div>

        <button onClick={handleOpenNew} className="btn-primary text-xs py-2 px-3.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Project</span>
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

      {/* Projects Table */}
      <div className="overflow-x-auto rounded-xl border border-[#2B2D34] bg-[#15171C]">
        <table className="w-full text-left text-xs text-[#A1A1AA]">
          <thead className="bg-[#111317] border-b border-[#2B2D34] text-[#F3F4F6] font-medium">
            <tr>
              <th className="p-3.5">Project Title</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Featured</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202228]">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-[#1B1D23]/50 transition-colors">
                <td className="p-3.5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#F3F4F6]">{proj.title}</span>
                    <span className="text-[10px] text-[#71717A] font-mono">/{proj.slug}</span>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className="badge-tech">{proj.category}</span>
                </td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    proj.published ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-[#71717A]/20 text-[#A1A1AA]"
                  }`}>
                    {proj.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    proj.featured ? "bg-[#6D8DFF]/15 text-[#8B9CFF]" : "text-[#71717A]"
                  }`}>
                    {proj.featured ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingProj({
                          ...proj,
                          externalLinks: proj.externalLinks || [],
                        });
                        setTechInput(Array.isArray(proj.technologies) ? proj.technologies.join(", ") : "");
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded hover:bg-[#1B1D23] text-[#8B9CFF]"
                      title="Edit Project"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 rounded hover:bg-[#1B1D23] text-[#EF4444]"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && editingProj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#15171C] border border-[#2B2D34] rounded-2xl p-6 overflow-y-auto flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#202228]">
              <h2 className="text-base font-bold text-[#F3F4F6]">
                {editingProj.id ? "Edit Project" : "Add New Project"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#71717A] hover:text-[#F3F4F6]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#A1A1AA]">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProj.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const autoSlug = title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                      setEditingProj((prev) => {
                        if (!prev) return null;
                        const isNew = !prev.id;
                        const prevAutoSlug = prev.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                        const shouldUpdateSlug = isNew || !prev.slug || prev.slug === prevAutoSlug;
                        return {
                          ...prev,
                          title,
                          slug: shouldUpdateSlug ? autoSlug : prev.slug,
                        };
                      });
                    }}
                    placeholder="e.g. Real-Time PPE Detection with YOLOv11"
                    className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#A1A1AA]">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingProj.slug}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                      setEditingProj({ ...editingProj, slug: val });
                    }}
                    placeholder="e.g. real-time-ppe-detection"
                    className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[#A1A1AA]">Project Category</label>
                    <span className="text-[10px] text-[#71717A]">Quick select or enter custom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      list="project-categories-list"
                      required
                      value={editingProj.category}
                      onChange={(e) => setEditingProj({ ...editingProj, category: e.target.value })}
                      placeholder="Select or type category..."
                      className="flex-1 p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                    />
                    <select
                      value={SUGGESTED_CATEGORIES.includes(editingProj.category) ? editingProj.category : "manual"}
                      onChange={(e) => {
                        if (e.target.value !== "manual") {
                          setEditingProj({ ...editingProj, category: e.target.value });
                        }
                      }}
                      className="w-36 p-2.5 rounded-lg bg-[#15171C] border border-[#2B2D34] text-xs text-[#A1A6B5] focus:border-[#6D8DFF] focus:outline-none cursor-pointer"
                    >
                      <option value="manual">-- Dropdown --</option>
                      {SUGGESTED_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <datalist id="project-categories-list">
                    {SUGGESTED_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[#A1A1AA]">Technologies (comma-separated)</label>
                    <span className="text-[10px] text-[#71717A]">Comma-separated list</span>
                  </div>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTechInput(val);
                      const parsed = val.split(",").map((s) => s.trim()).filter(Boolean);
                      setEditingProj({
                        ...editingProj,
                        technologies: parsed.length > 0 ? parsed : [val.trim()],
                      });
                    }}
                    placeholder="e.g. Python, PyTorch, YOLOv11, OpenCV, FastAPI"
                    className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#A1A1AA]">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingProj.shortDescription}
                  onChange={(e) => setEditingProj({ ...editingProj, shortDescription: e.target.value })}
                  className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#A1A1AA]">Full Description / Approach</label>
                <textarea
                  rows={4}
                  required
                  value={editingProj.fullDescription}
                  onChange={(e) => setEditingProj({ ...editingProj, fullDescription: e.target.value })}
                  className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[#A1A1AA]">Problem Statement</label>
                  <textarea
                    rows={2}
                    value={editingProj.problem || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, problem: e.target.value })}
                    className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#A1A1AA]">Solution / Approach</label>
                  <textarea
                    rows={2}
                    value={editingProj.solution || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, solution: e.target.value })}
                    className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#A1A1AA]">Key Results</label>
                  <textarea
                    rows={2}
                    value={editingProj.results || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, results: e.target.value })}
                    className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#A1A1AA]">GitHub Repo URL</label>
                  <input
                    type="text"
                    value={editingProj.repoUrl || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, repoUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#A1A1AA]">Live Demo URL</label>
                  <input
                    type="text"
                    value={editingProj.liveUrl || ""}
                    onChange={(e) => setEditingProj({ ...editingProj, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                  />
                </div>
              </div>

              {/* Dynamic External Platform / Provider Links */}
              <ExternalLinksEditor
                links={editingProj.externalLinks || []}
                onChange={(updatedLinks) =>
                  setEditingProj({ ...editingProj, externalLinks: updatedLinks })
                }
                title="Project Ecosystem & Platform Links (Roboflow, Hugging Face, Kaggle, GitHub, etc.)"
                description="Connect this project to Roboflow Universe, Hugging Face Hub, Kaggle Notebooks, model weights, API docs, etc."
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[#A1A1AA]">Cover Image URL / Upload</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={editingProj.coverImage}
                    onChange={(e) => setEditingProj({ ...editingProj, coverImage: e.target.value })}
                    className="flex-1 p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
                  />
                  <label className="btn-secondary py-2 px-3 shrink-0 cursor-pointer text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleUploadCover(e.target.files[0]);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProj.featured}
                    onChange={(e) => setEditingProj({ ...editingProj, featured: e.target.checked })}
                    className="rounded bg-[#1B1D23] border-[#2B2D34]"
                  />
                  <span className="text-[#F3F4F6]">Feature as Highlighted Project</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProj.published}
                    onChange={(e) => setEditingProj({ ...editingProj, published: e.target.checked })}
                    className="rounded bg-[#1B1D23] border-[#2B2D34]"
                  />
                  <span className="text-[#F3F4F6]">Publish Immediately</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202228]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-2 px-5 font-semibold"
                >
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
