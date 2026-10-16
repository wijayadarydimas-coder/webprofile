import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const research = await db.getResearchById(id);

    if (!research || !research.pdfUrl?.trim()) {
      return new NextResponse("Naskah PDF penelitian tidak ditemukan.", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const pdfUrl = research.pdfUrl.trim();
    const safeTitle = research.title
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);

    // 1. Base64 Data URL
    if (pdfUrl.startsWith("data:application/pdf;base64,")) {
      const base64Data = pdfUrl.replace("data:application/pdf;base64,", "");
      const buffer = Buffer.from(base64Data, "base64");

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="Naskah_${safeTitle}.pdf"`,
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 2. Cloud / Remote URL (Supabase Storage, Google Drive, dsb.)
    if (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://")) {
      return NextResponse.redirect(pdfUrl, 307);
    }

    // 3. Local file path
    if (pdfUrl.startsWith("/")) {
      const cleanPath = pdfUrl.replace(/^\/+/, "");
      const filePath = path.join(process.cwd(), "public", cleanPath);

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="Naskah_${safeTitle}.pdf"`,
            "Content-Length": fileBuffer.length.toString(),
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      }
    }

    return NextResponse.redirect(pdfUrl, 307);
  } catch (error) {
    console.error("Gagal menyajikan PDF penelitian:", error);
    return new NextResponse("Terjadi kesalahan saat memuat PDF penelitian.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
