import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { db } from "../db";
import type { MediaItem } from "@/types";

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

  // Additional sanity check for SVG: strip dangerous script tags
  if (file.type === "image/svg+xml") {
    const text = buffer.toString("utf8");
    if (/<script[\s\S]*?>/i.test(text) || /javascript:/i.test(text)) {
      throw new Error("Berkas SVG terdeteksi memiliki script yang tidak diizinkan.");
    }
  }

  // Generate safe unique filename
  const ext = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".png");
  const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  const uniqueName = `${cleanBase}_${crypto.randomBytes(6).toString("hex")}${ext.toLowerCase()}`;

  // Ensure public/uploads exists
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const destination = path.join(uploadsDir, uniqueName);
  fs.writeFileSync(destination, buffer);

  const publicUrl = `/uploads/${uniqueName}`;

  // Save metadata to media library
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
