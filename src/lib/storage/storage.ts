import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { db } from "../db";
import type { MediaItem } from "@/types";
import { isSafeSvg, matchesMagicBytes } from "../security/sanitize";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export interface UploadResult {
  url: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  mediaItem: MediaItem;
}

export async function saveUploadedFile(file: File, customAlt = ""): Promise<UploadResult> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(`Format berkas tidak diizinkan (${file.type}). Format yang didukung: JPEG, PNG, WebP, SVG, PDF.`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran berkas melebihi batas maksimum 10MB (ukuran: ${(file.size / 1024 / 1024).toFixed(2)}MB).`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // SVG is active content: refuse anything with scripts, event handlers, or external refs.
  if (file.type === "image/svg+xml") {
    if (!isSafeSvg(buffer.toString("utf8"))) {
      throw new Error("Berkas SVG terdeteksi memiliki konten aktif (script/event handler/referensi eksternal) yang tidak diizinkan.");
    }
  } else if (!matchesMagicBytes(buffer, file.type)) {
    throw new Error("Isi berkas tidak sesuai dengan format yang dideklarasikan.");
  }

  // Generate safe unique filename
  const ext = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : file.type === "image/webp" ? ".webp" : ".png");
  const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  const uniqueName = `${cleanBase}_${crypto.randomBytes(6).toString("hex")}${ext.toLowerCase()}`;

  let publicUrl = "";

  // Strategy 1: Supabase Storage (Jika Supabase URL & Key tersedia)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  const bucketName = process.env.STORAGE_BUCKET || "media";

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(uniqueName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadError) {
        const { data: pubData } = supabase.storage.from(bucketName).getPublicUrl(uniqueName);
        if (pubData?.publicUrl) {
          publicUrl = pubData.publicUrl;
        }
      } else {
        console.warn("Supabase Storage upload warning:", uploadError.message);
      }
    } catch (sErr) {
      console.warn("Supabase Storage error:", sErr);
    }
  }

  // Strategy 2: Local Filesystem (Jika belum di Supabase & disk lokal writable)
  if (!publicUrl) {
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const destination = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(destination, buffer);
      publicUrl = `/uploads/${uniqueName}`;
    } catch {
      // Strategy 3: Vercel Read-Only Fallback -> Base64 Data URL
      // Pada serverless Vercel gratisan tanpa disk writable, gunakan Data URI yang disimpan di DB
      const base64 = buffer.toString("base64");
      publicUrl = `data:${file.type};base64,${base64}`;
    }
  }

  // Save metadata to database (Supabase PostgreSQL / LocalStore)
  const mediaItem = await db.saveMediaItem({
    name: uniqueName,
    url: publicUrl,
    mimeType: file.type,
    sizeBytes: file.size,
    altText: customAlt || file.name,
  });

  return {
    url: publicUrl,
    name: uniqueName,
    mimeType: file.type,
    sizeBytes: file.size,
    mediaItem,
  };
}
