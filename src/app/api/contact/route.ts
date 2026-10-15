import { NextResponse } from "next/server";
import { contactMessageSchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/security/ratelimit";
import { sanitizeMarkdownText } from "@/lib/security/sanitize";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`contact:${ip}`, { limit: 4, windowMs: 15 * 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak pengiriman pesan. Silakan coba lagi setelah beberapa menit." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = contactMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Mohon isi formulir kontak dengan benar.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Honeypot check for bots
    if (parsed.data.hp && parsed.data.hp.length > 0) {
      // Quietly succeed for bots without storing spam
      return NextResponse.json({ success: true, message: "Pesan Anda telah terkirim." });
    }

    const cleanName = sanitizeMarkdownText(parsed.data.name);
    const cleanMessage = sanitizeMarkdownText(parsed.data.message);

    await db.saveContactMessage(cleanName, parsed.data.email, cleanMessage);

    return NextResponse.json({
      success: true,
      message: "Terima kasih! Pesan Anda telah berhasil dikirimkan kepada Wijaya Dary Dimas.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    console.error("Contact form error:", message);
    return NextResponse.json({ error: "Gagal mengirimkan pesan saat ini." }, { status: 500 });
  }
}
