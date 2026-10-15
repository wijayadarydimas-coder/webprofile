import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { saveUploadedFile } from "@/lib/storage/storage";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak. Tindakan ini memerlukan hak admin." }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Tidak ada berkas yang diunggah." }, { status: 400 });
    }

    const result = await saveUploadedFile(file, altText);

    return NextResponse.json({
      success: true,
      url: result.url,
      name: result.name,
      mediaItem: result.mediaItem,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload gagal";
    console.error("Upload error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
