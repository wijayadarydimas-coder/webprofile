"use client";

import { useState, useEffect } from "react";
import { Briefcase, GraduationCap, Plus, Trash2, Save, CheckCircle2, AlertCircle } from "lucide-react";
import type { Experience, Education } from "@/types";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [expRes, eduRes] = await Promise.all([
        fetch("/api/admin/content?entity=experience").then((r) => r.json()),
        fetch("/api/admin/content?entity=education").then((r) => r.json()),
      ]);
      if (expRes.success && Array.isArray(expRes.data)) {
        setExperiences(expRes.data);
      }
      if (eduRes.success && Array.isArray(eduRes.data)) {
        setEducations(eduRes.data);
      }
    } catch (err) {
      console.error("Failed to load experience/education data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveExp = async (exp: Experience) => {
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "experience", action: "save", data: exp }),
      });
      setStatus({ type: "success", message: "Experience saved successfully!" });
      loadData();
    } catch {
      setStatus({ type: "error", message: "Failed to save experience." });
    }
  };

  const handleDeleteExp = async (id: string, index: number) => {
    if (!confirm("Permanently delete this experience?")) return;
    try {
      if (id && !id.startsWith("exp-")) {
        const res = await fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entity: "experience", action: "delete", id }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to delete data.");
      }
      setStatus({ type: "success", message: "Experience deleted successfully." });
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      setStatus({ type: "error", message: msg });
    }
  };

  const handleSaveEdu = async (edu: Education) => {
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "education", action: "save", data: edu }),
      });
      setStatus({ type: "success", message: "Education entry saved successfully!" });
      loadData();
    } catch {
      setStatus({ type: "error", message: "Failed to save education entry." });
    }
  };

  const handleDeleteEdu = async (id: string, index: number) => {
    if (!confirm("Permanently delete this education entry?")) return;
    try {
      if (id && !id.startsWith("edu-")) {
        const res = await fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entity: "education", action: "delete", id }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to delete data.");
      }
      setStatus({ type: "success", message: "Education entry deleted successfully." });
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      setStatus({ type: "error", message: msg });
    }
  };

  const handleAddExp = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      organization: "Institution / Company Name",
      role: "Role / Position",
      period: "Month Year – Month Year",
      description: "Responsibilities and achievements...",
      type: "work",
      orderIndex: experiences.length + 1,
      url: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const handleAddEdu = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: "University / Institution Name",
      degree: "Degree & Major",
      period: "Year – Year",
      description: "Focus of study and milestones...",
      orderIndex: educations.length + 1,
      url: "",
    };
    setEducations([...educations, newEdu]);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 pb-4 border-b border-[#202228]">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#6D8DFF]" />
          <h1 className="text-xl font-bold text-[#F3F4F6]">Work Experience &amp; Education</h1>
        </div>
        <p className="text-xs text-[#A1A1AA]">
          Update work, internship, and formal education history.
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

      {/* Experience Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#6D8DFF]" />
            <span>Work &amp; Internship Experience</span>
          </h2>
          <button onClick={handleAddExp} className="btn-secondary text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71717A]">Institution / Company</label>
                  <input
                    type="text"
                    value={exp.organization}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[index].organization = e.target.value;
                      setExperiences(updated);
                    }}
                    className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71717A]">Position / Role</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[index].role = e.target.value;
                      setExperiences(updated);
                    }}
                    className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71717A]">Period</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[index].period = e.target.value;
                      setExperiences(updated);
                    }}
                    className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#71717A]">Responsibilities &amp; Achievements</label>
                <textarea
                  rows={3}
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...experiences];
                    updated[index].description = e.target.value;
                    setExperiences(updated);
                  }}
                  className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#71717A]">Official Institution URL (Optional — leave empty if no link needed)</label>
                <input
                  type="text"
                  value={exp.url || ""}
                  onChange={(e) => {
                    const updated = [...experiences];
                    updated[index].url = e.target.value;
                    setExperiences(updated);
                  }}
                  placeholder="https://big.go.id"
                  className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#202228]">
                <button
                  onClick={() => handleDeleteExp(exp.id, index)}
                  className="text-xs text-[#EF4444] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => handleSaveExp(exp)}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="flex flex-col gap-4 pt-6 border-t border-[#202228]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#8B9CFF]" />
            <span>Formal Education</span>
          </h2>
          <button onClick={handleAddEdu} className="btn-secondary text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {educations.map((edu, index) => (
            <div key={edu.id} className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71717A]">Institution / University</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...educations];
                      updated[index].institution = e.target.value;
                      setEducations(updated);
                    }}
                    className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71717A]">Degree &amp; Major</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...educations];
                      updated[index].degree = e.target.value;
                      setEducations(updated);
                    }}
                    className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71717A]">Period</label>
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => {
                      const updated = [...educations];
                      updated[index].period = e.target.value;
                      setEducations(updated);
                    }}
                    className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#71717A]">Focus of Study &amp; Highlights</label>
                <textarea
                  rows={2}
                  value={edu.description}
                  onChange={(e) => {
                    const updated = [...educations];
                    updated[index].description = e.target.value;
                    setEducations(updated);
                  }}
                  className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#71717A]">Official Institution URL (Optional — leave empty if no link needed)</label>
                <input
                  type="text"
                  value={edu.url || ""}
                  onChange={(e) => {
                    const updated = [...educations];
                    updated[index].url = e.target.value;
                    setEducations(updated);
                  }}
                  placeholder="https://ump.ac.id"
                  className="p-2 rounded bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6]"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#202228]">
                <button
                  onClick={() => handleDeleteEdu(edu.id, index)}
                  className="text-xs text-[#EF4444] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => handleSaveEdu(edu)}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
