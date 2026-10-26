"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, Trash2, Copy, Check, FileText } from "lucide-react";
import type { MediaItem } from "@/types";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = () => {
    setLoading(true);
    fetch("/api/admin/content?entity=media")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setMediaList(json.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load media:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      let uploadFile = file;
      if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
        const { convertImageToWebP } = await import("@/lib/utils/image-converter");
        const conv = await convertImageToWebP(file);
        uploadFile = conv.file;
      }

      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("altText", file.name);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload file.");

      loadMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed");
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
    if (!confirm("Permanently delete this media file?")) return;
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "media", action: "delete", id }),
      });
      setMediaList(mediaList.filter((m) => m.id !== id));
    } catch {
      alert("Failed to delete media file.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202228]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#22C55E]" />
            <h1 className="text-xl font-bold text-[#F3F4F6]">Media Library &amp; Files</h1>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Manage all image assets, profile photos, and PDF resume documents stored in the system.
          </p>
        </div>

        <label className="btn-primary text-xs py-2 px-4 cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? "Uploading..." : "Upload New File"}</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Tips Hosting Gratis Vercel */}
      <div className="p-4 rounded-xl bg-[#1B1D23] border border-[#2B2D34] flex items-start gap-3 text-xs text-[#A1A1AA]">
        <span className="p-1.5 rounded-lg bg-[#22C55E]/10 text-[#22C55E] shrink-0 mt-0.5">💡</span>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[#F3F4F6]">Optimal File Guidelines (Vercel &amp; Supabase):</span>
          <p>
            • <strong>Photos / Images</strong>: All images (JPG, PNG) are automatically converted to <strong>WebP</strong> (saving up to 80% filesize with crisp quality).<br />
            • <strong>PDF Documents</strong>: Use compressed PDF files (&lt; 5MB) for your CV/resume for fast delivery and quick downloading.
          </p>
        </div>
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
                  title="Copy URL path to use in profile/projects"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span className="text-[#22C55E]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-[#71717A] hover:text-[#EF4444] transition-colors"
                  title="Delete file"
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
