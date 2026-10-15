"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Save, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import type { SiteProfile } from "@/types";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  useEffect(() => {
    fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "profile", action: "get" }),
    })
      .then((res) => {
        // Fallback: fetch from general public data
        return fetch("/");
      })
      .catch(() => {})
      .finally(() => {
        // Load default/active profile
        setProfile({
          id: "primary",
          fullName: "Wijaya Dary Dimas",
          headline: "Exploring Technology. Building Ideas. Creating Impact.",
          shortBio:
            "Saya memiliki latar belakang Teknik Informatika dan senang mengeksplorasi teknologi melalui proyek, penelitian, dan pengalaman praktik. Website ini menjadi tempat saya mendokumentasikan karya, proses belajar, dan perjalanan profesional.",
          aboutMe:
            "Halo! Saya Wijaya Dary Dimas, mahasiswa Teknik Informatika di Universitas Muhammadiyah Purwokerto dengan fokus minat pada rekayasa perangkat lunak, sistem berbasis machine learning / computer vision, dan komputasi terapan.\n\nMelalui studi dan pengalaman praktik di Badan Informasi Geospasial sebagai Pranata Komputer, saya terbiasa memecahkan masalah teknis dengan pendekatan terstruktur, menguji implementasi secara langsung, dan membangun sistem yang andal serta bermanfaat bagi pengguna.\n\nSaya percaya bahwa teknologi terbaik adalah teknologi yang dibangun dengan rasa ingin tahu tinggi, pemahaman mendalam pada masalah nyata, dan komitmen terhadap kualitas rekayasa.",
          avatarUrl: "/images/profile-placeholder.svg",
          avatarAlt: "Foto Profil Wijaya Dary Dimas",
          cvUrl: "/files/cv-placeholder.pdf",
          githubUrl: "https://github.com/wijayadarydimas-coder",
          linkedinUrl: "",
          email: "",
          location: "Purwokerto, Indonesia",
          statusText: "Pranata Komputer di BIG & Riset Deteksi APD YOLOv11",
          updatedAt: new Date().toISOString(),
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "profile",
          action: "update",
          data: profile,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal memperbarui profil.");
      }

      setStatus({ type: "success", message: "Profil berhasil diperbarui dan telah diterapkan ke website!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setStatus({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, target: "avatar" | "cv") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", target === "avatar" ? "Foto Profil" : "Berkas Resume CV");

    if (target === "avatar") setUploadingAvatar(true);
    else setUploadingCv(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah berkas.");
      }

      if (profile) {
        if (target === "avatar") {
          setProfile({ ...profile, avatarUrl: data.url });
        } else {
          setProfile({ ...profile, cvUrl: data.url });
        }
      }
      setStatus({ type: "success", message: "Berkas berhasil diunggah! Jangan lupa klik 'Simpan Perubahan'." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload gagal";
      setStatus({ type: "error", message: msg });
    } finally {
      setUploadingAvatar(false);
      setUploadingCv(false);
    }
  };

  if (loading || !profile) {
    return <div className="text-xs text-[#71717A]">Memuat data profil...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-[#202228]">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-[#6D8DFF]" />
          <h1 className="text-xl font-bold text-[#F3F4F6]">Pengaturan Profil &amp; Hero</h1>
        </div>
        <p className="text-xs text-[#A1A1AA]">
          Ubah informasi identitas publik, tagline, bio hero, foto profil, dan dokumen resume tanpa menyentuh kode program.
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

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Profile Avatar Card */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#1B1D23] border border-[#2B2D34] shrink-0 flex items-center justify-center">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt="Foto Profil Avatar"
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="font-mono text-xl font-bold text-[#8B9CFF]">WDD</span>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1 text-center sm:text-left">
            <span className="text-sm font-semibold text-[#F3F4F6]">Foto Profil Resmi</span>
            <p className="text-xs text-[#71717A]">
              Unggah foto profil Anda sendiri (JPG, PNG, WebP, SVG). Rasio persegi 1:1 disarankan.
            </p>
            <div className="flex items-center gap-3 pt-1 justify-center sm:justify-start">
              <label className="btn-secondary text-xs py-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingAvatar ? "Mengunggah..." : "Ganti Foto Profil"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "avatar");
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Nama Lengkap</label>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Lokasi</label>
              <input
                type="text"
                required
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A1A1AA]">Tagline Utama</label>
            <input
              type="text"
              required
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A1A1AA]">Status Badge Hero</label>
            <input
              type="text"
              required
              value={profile.statusText}
              onChange={(e) => setProfile({ ...profile, statusText: e.target.value })}
              className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A1A1AA]">Deskripsi Singkat (Hero Section)</label>
            <textarea
              rows={3}
              required
              value={profile.shortBio}
              onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
              className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A1A1AA]">Narasi Lengkap (About Me Section)</label>
            <textarea
              rows={6}
              required
              value={profile.aboutMe}
              onChange={(e) => setProfile({ ...profile, aboutMe: e.target.value })}
              className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
            />
          </div>
        </div>

        {/* Links & Resume */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#F3F4F6]">Tautan Sosial &amp; Dokumen Resume</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">URL GitHub</label>
              <input
                type="text"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">URL LinkedIn</label>
              <input
                type="text"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Email Publik Kontak</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="kontak@email.com"
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Dokumen CV / Resume</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={profile.cvUrl}
                  onChange={(e) => setProfile({ ...profile, cvUrl: e.target.value })}
                  placeholder="/files/cv.pdf"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                />
                <label className="btn-secondary text-xs py-2 px-3 shrink-0 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingCv ? "..." : "Upload PDF"}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "cv");
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 text-xs font-semibold disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan Perubahan..." : "Simpan Seluruh Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
