"use client";

import { useState } from "react";
import { Briefcase, GraduationCap, Plus, Trash2, Save, CheckCircle2, AlertCircle } from "lucide-react";
import type { Experience, Education } from "@/types";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "exp-1",
      organization: "Badan Informasi Geospasial",
      role: "Pranata Komputer",
      period: "November 2025 – Mei 2026",
      description:
        "Bertanggung jawab dalam pengelolaan sistem teknologi informasi dan infrastruktur data spasial, pemeliharaan perangkat lunak layanan internal, serta memberikan dukungan teknis komputasi pada instansi.",
      type: "internship",
      orderIndex: 1,
      url: "https://big.go.id",
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "edu-1",
      institution: "Universitas Muhammadiyah Purwokerto",
      degree: "S1 Teknik Informatika",
      period: "2021 – Sekarang",
      description:
        "Mendalami ilmu rekayasa perangkat lunak, algoritma dan struktur data, kecerdasan buatan, jaringan komputer, serta pengolahan citra digital. Mengembangkan skripsi modifikasi arsitektur YOLOv11 untuk deteksi APD.",
      orderIndex: 1,
      url: "https://ump.ac.id",
    },
  ]);

  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleSaveExp = async (exp: Experience) => {
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "experience", action: "save", data: exp }),
      });
      setStatus({ type: "success", message: "Data pengalaman berhasil disimpan!" });
    } catch {
      setStatus({ type: "error", message: "Gagal menyimpan pengalaman." });
    }
  };

  const handleSaveEdu = async (edu: Education) => {
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "education", action: "save", data: edu }),
      });
      setStatus({ type: "success", message: "Data pendidikan berhasil disimpan!" });
    } catch {
      setStatus({ type: "error", message: "Gagal menyimpan pendidikan." });
    }
  };

  const handleAddExp = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      organization: "Nama Instansi / Perusahaan",
      role: "Posisi Jabatan",
      period: "Bulan Tahun – Bulan Tahun",
      description: "Deskripsi tugas dan tanggung jawab...",
      type: "work",
      orderIndex: experiences.length + 1,
      url: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const handleAddEdu = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: "Nama Universitas / Institusi",
      degree: "Jenjang & Jurusan",
      period: "Tahun – Tahun",
      description: "Fokus studi dan capaian...",
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
          <h1 className="text-xl font-bold text-[#F3F4F6]">Pengalaman Kerja &amp; Pendidikan</h1>
        </div>
        <p className="text-xs text-[#A1A1AA]">
          Perbarui riwayat posisi magang (Badan Informasi Geospasial) dan pendidikan (Universitas Muhammadiyah Purwokerto).
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
            <span>Pengalaman Kerja &amp; Magang</span>
          </h2>
          <button onClick={handleAddExp} className="btn-secondary text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Posisi</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71717A]">Instansi / Perusahaan</label>
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
                  <label className="text-[11px] text-[#71717A]">Posisi Jabatan</label>
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
                  <label className="text-[11px] text-[#71717A]">Periode</label>
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
                <label className="text-[11px] text-[#71717A]">Deskripsi Tugas &amp; Capaian</label>
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

              <div className="flex items-center justify-between pt-2 border-t border-[#202228]">
                <button
                  onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                  className="text-xs text-[#EF4444] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
                <button
                  onClick={() => handleSaveExp(exp)}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
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
            <span>Pendidikan Formal</span>
          </h2>
          <button onClick={handleAddEdu} className="btn-secondary text-xs py-1.5 px-3">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pendidikan</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {educations.map((edu, index) => (
            <div key={edu.id} className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71717A]">Institusi / Universitas</label>
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
                  <label className="text-[11px] text-[#71717A]">Jenjang &amp; Jurusan</label>
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
                  <label className="text-[11px] text-[#71717A]">Periode</label>
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
                <label className="text-[11px] text-[#71717A]">Fokus Studi &amp; Catatan</label>
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

              <div className="flex items-center justify-between pt-2 border-t border-[#202228]">
                <button
                  onClick={() => setEducations(educations.filter((_, i) => i !== index))}
                  className="text-xs text-[#EF4444] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
                <button
                  onClick={() => handleSaveEdu(edu)}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
