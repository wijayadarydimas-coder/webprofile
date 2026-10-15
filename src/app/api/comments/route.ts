import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/security/ratelimit";
import { commentCreateSchema, commentUpdateSchema } from "@/lib/validation/schemas";
import { sanitizeMarkdownText } from "@/lib/security/sanitize";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeHidden = searchParams.get("includeHidden") === "true";

    const user = await getCurrentUser();
    const canSeeHidden = user?.role === "admin" && includeHidden;

    const comments = await db.getComments({ includeHidden: canSeeHidden });
    return NextResponse.json({ comments });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    console.error("GET Comments error:", message);
    return NextResponse.json({ error: "Gagal memuat komentar." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Anda harus masuk terlebih dahulu untuk mengirim komentar atau balasan." },
        { status: 401 }
      );
    }

    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`comment:${user.id}:${ip}`, { limit: 5, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak komentar dalam waktu singkat. Mohon tunggu 1 menit." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = commentCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Konten komentar tidak valid.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const cleanContent = sanitizeMarkdownText(parsed.data.content);

    const newComment = await db.createComment({
      parentId: parsed.data.parentId || null,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: cleanContent,
    });

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    console.error("POST Comment error:", message);
    return NextResponse.json({ error: "Gagal mengirim komentar." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Autentikasi diperlukan." }, { status: 401 });
    }

    const body = await req.json();
    const { id, content, isHidden } = body;

    if (!id) {
      return NextResponse.json({ error: "ID komentar diperlukan." }, { status: 400 });
    }

    // Admin moderation action: toggle isHidden
    if (typeof isHidden === "boolean") {
      if (user.role !== "admin") {
        return NextResponse.json({ error: "Hanya admin yang dapat memoderasi komentar." }, { status: 403 });
      }
      await db.moderateComment(id, isHidden);
      return NextResponse.json({ success: true, message: "Status visibilitas komentar diperbarui." });
    }

    // User editing their own comment
    const parsed = commentUpdateSchema.safeParse({ content });
    if (!parsed.success) {
      return NextResponse.json({ error: "Konten tidak valid.", details: parsed.error.format() }, { status: 400 });
    }

    const cleanContent = sanitizeMarkdownText(parsed.data.content);
    const updated = await db.updateComment(id, cleanContent, user.id);

    if (!updated) {
      return NextResponse.json({ error: "Komentar tidak ditemukan atau Anda bukan pemiliknya." }, { status: 404 });
    }

    return NextResponse.json({ comment: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    console.error("PATCH Comment error:", message);
    return NextResponse.json({ error: "Gagal memperbarui komentar." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Autentikasi diperlukan." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID komentar diperlukan." }, { status: 400 });
    }

    const isAdmin = user.role === "admin";
    const success = await db.deleteComment(id, user.id, isAdmin);

    if (!success) {
      return NextResponse.json({ error: "Komentar tidak ditemukan atau Anda tidak berwenang." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Komentar berhasil dihapus." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    console.error("DELETE Comment error:", message);
    return NextResponse.json({ error: "Gagal menghapus komentar." }, { status: 500 });
  }
}
