"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, Trash2, Copy, Check, FileText } from "lucide-react";
import type { MediaItem } from "@/types";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([
    {
      id: "media-1",
      name: "profile-placeholder.svg",
      url: "/images/profile-placeholder.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 1024,
      altText: "Avatar Wijaya Dary Dimas",
      createdAt: new Date().toISOString(),
    },
    {
      id: "media-2",
      name: "project-yolo.svg",
      url: "/images/project-yolo.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 2048,
      altText: "YOLO APD Diagram",
      createdAt: new Date().toISOString(),
    },
    {
      id: "media-3",
      name: "project-geo.svg",
      url: "/images/project-geo.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 1800,
      altText: "Geospatial Data Pipeline",
      createdAt: new Date().toISOString(),
    },
    {
      id: "media-4",
      name: "project-web.svg",
      url: "/images/project-web.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 1600,
      altText: "Personal Hub Architecture",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", file.name);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah berkas.");

      setMediaList([data.mediaItem, ...mediaList]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus file media ini?")) return;
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "media", action: "delete", id }),
      });
      setMediaList(mediaList.filter((m) => m.id !== id));
    } catch {
      alert("Gagal menghapus media.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202228]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#22C55E]" />
            <h1 className="text-xl font-bold text-[#F3F4F6]">Media Library &amp; Berkas</h1>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Kelola seluruh aset gambar, foto profil, dan dokumen resume PDF yang tersimpan di sistem.
          </p>
        </div>

        <label className="btn-primary text-xs py-2 px-4 cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? "Mengunggah..." : "Unggah Berkas Baru"}</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Grid of Media Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaList.map((item) => {
          const isPdf = item.mimeType === "application/pdf";
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col justify-between gap-3 group"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-36 rounded-lg bg-[#111317] border border-[#202228] overflow-hidden flex items-center justify-center">
                {isPdf ? (
                  <div className="flex flex-col items-center gap-1 text-[#EF4444]">
                    <FileText className="w-10 h-10" />
                    <span className="text-[10px] font-mono text-[#A1A1AA]">PDF Document</span>
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.altText || item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-contain p-2"
                  />
                )}
              </div>

              {/* Meta details */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#F3F4F6] truncate" title={item.name}>
                  {item.name}
                </span>
                <div className="flex items-center justify-between text-[10px] text-[#71717A] font-mono">
                  <span>{(item.sizeBytes / 1024).toFixed(1)} KB</span>
                  <span className="truncate max-w-[100px]">{item.mimeType}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#202228] text-xs">
                <button
                  onClick={() => handleCopyUrl(item.id, item.url)}
                  className="flex items-center gap-1 text-[#8B9CFF] hover:text-[#F3F4F6] transition-colors"
                  title="Salin path URL untuk digunakan di profil/proyek"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span className="text-[#22C55E]">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-[#71717A] hover:text-[#EF4444] transition-colors"
                  title="Hapus berkas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
