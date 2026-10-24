import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await db.getProfile();
    const cvUrl = profile?.cvUrl?.trim();

    if (!cvUrl) {
      return new NextResponse(
        "Dokumen CV belum diunggah di profil. Silakan unggah CV melalui Admin Dashboard.",
        {
          status: 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }
      );
    }

    // 1. Jika URL berupa Data URL Base64 (misal: data:application/pdf;base64,JVBERi0x...)
    // Browser modern memblokir navigasi langsung ke data: URL.
    // Endpoint ini mendecode base64 dan menyajikannya sebagai binary application/pdf murni.
    if (cvUrl.startsWith("data:application/pdf;base64,")) {
      const base64Data = cvUrl.replace("data:application/pdf;base64,", "");
      const buffer = Buffer.from(base64Data, "base64");

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="CV_Wijaya_Dary_Dimas.pdf"',
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 2. Jika URL berupa tautan Cloud / Storage eksternal (Supabase Storage, AWS S3, Cloudinary, dll.)
    if (cvUrl.startsWith("http://") || cvUrl.startsWith("https://")) {
      return NextResponse.redirect(cvUrl, 307);
    }

    // 3. Jika URL berupa path file lokal (/uploads/... atau /files/...)
    if (cvUrl.startsWith("/")) {
      const cleanPath = cvUrl.replace(/^\/+/, "");
      const publicDir = path.resolve(process.cwd(), "public");
      const filePath = path.resolve(publicDir, cleanPath);
      const isAllowed =
        !cleanPath.includes("..") &&
        !cleanPath.includes("\0") &&
        ["uploads", "files"].some((dir) =>
          filePath.startsWith(path.join(publicDir, dir) + path.sep)
        );

      if (isAllowed && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="CV_Wijaya_Dary_Dimas.pdf"',
            "Content-Length": fileBuffer.length.toString(),
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      }

      return new NextResponse("Dokumen CV tidak ditemukan.", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Fallback: Redirect
    return NextResponse.redirect(cvUrl, 307);
  } catch (error) {
    console.error("Gagal menyajikan dokumen CV:", error);
    return new NextResponse("Terjadi kesalahan saat memuat dokumen CV.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
