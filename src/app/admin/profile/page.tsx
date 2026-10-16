"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Save, Upload, AlertCircle, CheckCircle2, Globe, Shield, Sparkles, GraduationCap, Briefcase, Cpu } from "lucide-react";
import type { SiteProfile, Education, Experience, ResearchItem } from "@/types";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [educationsList, setEducationsList] = useState<Education[]>([]);
  const [experiencesList, setExperiencesList] = useState<Experience[]>([]);
  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/content?entity=profile").then((res) => res.json()),
      fetch("/api/admin/content?entity=education").then((res) => res.json()).catch(() => ({ success: false })),
      fetch("/api/admin/content?entity=experience").then((res) => res.json()).catch(() => ({ success: false })),
      fetch("/api/admin/content?entity=research").then((res) => res.json()).catch(() => ({ success: false })),
    ])
      .then(([profileJson, eduJson, expJson, resJson]) => {
        if (profileJson.success && profileJson.data) {
          setProfile({
            ...profileJson.data,
            aboutTitle: profileJson.data.aboutTitle || "Profil, Prinsip Belajar & Fokus Teknis",
            aboutEducationId: profileJson.data.aboutEducationId || "",
            aboutExperienceId: profileJson.data.aboutExperienceId || "",
            aboutResearchId: profileJson.data.aboutResearchId || "",
            roleTitle: profileJson.data.roleTitle || "Informatics & CV Engineer",
            brandName: profileJson.data.brandName || "Wijaya Dary Dimas",
            logoUrl: profileJson.data.logoUrl || "",
            instagramUrl: profileJson.data.instagramUrl || "",
            tiktokUrl: profileJson.data.tiktokUrl || "",
          });
        }
        if (eduJson.success && Array.isArray(eduJson.data)) {
          setEducationsList(eduJson.data);
        }
        if (expJson.success && Array.isArray(expJson.data)) {
          setExperiencesList(expJson.data);
        }
        if (resJson.success && Array.isArray(resJson.data)) {
          setResearchList(resJson.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat profil dan konten:", err);
      })
      .finally(() => {
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

      setProfile(json.data);
      setStatus({ type: "success", message: "Profil dan branding berhasil diperbarui serta diterapkan langsung ke website!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setStatus({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, target: "avatar" | "cv" | "logo") => {
    if (target === "avatar") setUploadingAvatar(true);
    else if (target === "cv") setUploadingCv(true);
    else setUploadingLogo(true);

    try {
      let uploadFile = file;
      let conversionNotice = "";

      // Otomatis konversi foto/logo ke WebP jika target adalah gambar
      if ((target === "avatar" || target === "logo") && file.type.startsWith("image/") && file.type !== "image/svg+xml") {
        const { convertImageToWebP } = await import("@/lib/utils/image-converter");
        const conv = await convertImageToWebP(file);
        uploadFile = conv.file;
        if (conv.wasConverted) {
          const beforeKb = (conv.originalSize / 1024).toFixed(0);
          const afterKb = (conv.convertedSize / 1024).toFixed(0);
          conversionNotice = ` (Dikompresi WebP: ${beforeKb}KB ➡️ ${afterKb}KB)`;
        }
      }

      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append(
        "altText",
        target === "avatar" ? "Foto Profil" : target === "logo" ? "Logo Website" : "Berkas Resume CV"
      );

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
        } else if (target === "cv") {
          setProfile({ ...profile, cvUrl: data.url });
        } else {
          setProfile({ ...profile, logoUrl: data.url });
        }
      }
      setStatus({
        type: "success",
        message: `Berkas berhasil diunggah${conversionNotice}! Jangan lupa klik tombol 'Simpan Seluruh Perubahan' di bawah.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload gagal";
      setStatus({ type: "error", message: msg });
    } finally {
      setUploadingAvatar(false);
      setUploadingCv(false);
      setUploadingLogo(false);
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
          <h1 className="text-xl font-bold text-[#F3F4F6]">Pengaturan Profil &amp; Branding</h1>
        </div>
        <p className="text-xs text-[#A1A1AA]">
          Ubah nama brand, teks profesi sub-title, logo website, foto profil, dan media sosial tanpa menyentuh kode program.
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
        {/* Section: Header & Branding (Logo, Nama Brand, Sub-title) */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-[#202228] pb-3">
            <Globe className="w-4 h-4 text-[#6D8DFF]" />
            <h2 className="text-sm font-semibold text-[#F3F4F6]">Identitas Logo &amp; Navbar Header</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Box & Upload */}
            <div className="p-4 rounded-xl bg-[#1B1D23] border border-[#2B2D34] flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-xl bg-[#15171C] border border-[#2B2D34] flex items-center justify-center overflow-hidden shrink-0">
                {profile.logoUrl ? (
                  <Image
                    src={profile.logoUrl}
                    alt="Logo Website"
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="font-mono text-xl font-bold text-[#F3F4F6]">
                    {(profile.brandName || "W")[0]?.toUpperCase() || "W"}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <span className="text-xs font-semibold text-[#F3F4F6]">Logo Website</span>
                <p className="text-[11px] text-[#71717A]">
                  {profile.logoUrl ? "Logo kustom terpasang" : "Memakai inisial teks default"}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <label className="btn-secondary text-[11px] py-1 px-2.5 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>{uploadingLogo ? "Mengunggah..." : "Ganti Logo"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "logo");
                      }}
                      className="hidden"
                    />
                  </label>
                  {profile.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, logoUrl: "" })}
                      className="text-[11px] text-[#EF4444] hover:underline"
                    >
                      Hapus Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Name & Sub-Title inputs */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#A1A1AA]">
                  Nama Brand di Navbar / Header
                </label>
                <input
                  type="text"
                  required
                  value={profile.brandName || ""}
                  onChange={(e) => setProfile({ ...profile, brandName: e.target.value })}
                  placeholder="Wijaya Dary Dimas"
                  className="px-3.5 py-2 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#A1A1AA]">
                  Sub-Title / Profesi di Navbar (Sebelumnya: [Informatics &amp; CV Engineer])
                </label>
                <input
                  type="text"
                  required
                  value={profile.roleTitle || ""}
                  onChange={(e) => setProfile({ ...profile, roleTitle: e.target.value })}
                  placeholder="Informatics & CV Engineer"
                  className="px-3.5 py-2 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Foto Profil & Bio Hero */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-2xl bg-[#1B1D23] border border-[#2B2D34] flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
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

        {/* Section: Form Fields Biodata */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Nama Lengkap Resmi</label>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">Lokasi Domisili</label>
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
            <label className="text-xs font-medium text-[#A1A1AA]">Tagline Utama (Hero)</label>
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
            <label className="text-xs font-medium text-[#A1A1AA]">Judul Seksi Tentang (About Section Heading)</label>
            <input
              type="text"
              value={profile.aboutTitle || ""}
              onChange={(e) => setProfile({ ...profile, aboutTitle: e.target.value })}
              placeholder="Profil, Prinsip Belajar & Fokus Teknis"
              className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
            />
            <span className="text-[11px] text-[#71717A]">
              Mengubah teks judul utama pada seksi Tentang Pemilik di halaman depan.
            </span>
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

        {/* Section: Kartu Sorotan Tentang Saya (Pendidikan, Pengalaman, dan Riset Unggulan) */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#7790FF]" />
            <h2 className="text-sm font-semibold text-[#F3F4F6]">
              Pilihan Kartu Sorotan Tentang Saya (Pendidikan, Pengalaman, &amp; Riset)
            </h2>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Atur data spesifik yang ingin ditampilkan pada 3 kartu ringkasan di bawah foto profil seksi Tentang Saya (About Me) pada halaman depan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Pilihan Sekolah / Pendidikan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#7790FF]" />
                <span>Pendidikan yang Ditampilkan</span>
              </label>
              <select
                value={profile.aboutEducationId || ""}
                onChange={(e) => setProfile({ ...profile, aboutEducationId: e.target.value || null })}
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              >
                <option value="">Otomatis (Item Teratas / Pertama)</option>
                {educationsList.map((edu) => (
                  <option key={edu.id} value={edu.id}>
                    {edu.institution} — {edu.degree} ({edu.period})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[#71717A]">
                {profile.aboutEducationId
                  ? `Terpilih: ${educationsList.find((e) => e.id === profile.aboutEducationId)?.institution || "Kustom"}`
                  : "Default: Mengikuti urutan pertama"}
              </span>
            </div>

            {/* Pilihan Pengalaman Kerja */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#96A9FF]" />
                <span>Pengalaman yang Ditampilkan</span>
              </label>
              <select
                value={profile.aboutExperienceId || ""}
                onChange={(e) => setProfile({ ...profile, aboutExperienceId: e.target.value || null })}
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              >
                <option value="">Otomatis (Item Teratas / Pertama)</option>
                {experiencesList.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.organization} — {exp.role} ({exp.period})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[#71717A]">
                {profile.aboutExperienceId
                  ? `Terpilih: ${experiencesList.find((e) => e.id === profile.aboutExperienceId)?.organization || "Kustom"}`
                  : "Default: Mengikuti urutan pertama"}
              </span>
            </div>

            {/* Pilihan Riset / Skripsi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Penelitian yang Ditampilkan</span>
              </label>
              <select
                value={profile.aboutResearchId || ""}
                onChange={(e) => setProfile({ ...profile, aboutResearchId: e.target.value || null })}
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              >
                <option value="">Otomatis (Item Teratas / Pertama)</option>
                {researchList.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.title} ({res.publishedStatus || "Penelitian"})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[#71717A]">
                {profile.aboutResearchId
                  ? `Terpilih: ${researchList.find((r) => r.id === profile.aboutResearchId)?.title?.slice(0, 32) || "Kustom"}...`
                  : "Default: Mengikuti urutan pertama"}
              </span>
            </div>
          </div>
        </div>

        {/* Section: Kontak & Media Sosial */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[#F3F4F6]">Kontak, Media Sosial &amp; Dokumen Resume</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">1. Email Publik Kontak</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="kontak@email.com"
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">2. URL GitHub</label>
              <input
                type="text"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">3. URL LinkedIn</label>
              <input
                type="text"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">4. URL Instagram</label>
              <input
                type="text"
                value={profile.instagramUrl || ""}
                onChange={(e) => setProfile({ ...profile, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/username"
                className="px-3.5 py-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#A1A1AA]">5. URL TikTok</label>
              <input
                type="text"
                value={profile.tiktokUrl || ""}
                onChange={(e) => setProfile({ ...profile, tiktokUrl: e.target.value })}
                placeholder="https://tiktok.com/@username"
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
