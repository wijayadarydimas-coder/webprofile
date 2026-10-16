import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security/ratelimit";
import { generateAIChatResponse, type ChatMessage } from "@/lib/ai/adapter";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().trim().min(1).max(1000),
      })
    )
    .min(1)
    .max(50),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`ai:${ip}`, { limit: 15, windowMs: 60 * 1000 });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan ke Asisten AI. Mohon tunggu beberapa saat sebelum mencoba lagi.",
          resetMs: rateCheck.resetMs,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Format pesan tidak valid atau melebihi batas panjang karakter.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const messages = parsed.data.messages as ChatMessage[];
    const response = await generateAIChatResponse(messages);

    // Cek apakah ada sesi user (visitor terdaftar atau admin)
    const currentUser = await getCurrentUser();
    if (currentUser?.id) {
      try {
        const lastUserMsg = messages[messages.length - 1];
        if (lastUserMsg && lastUserMsg.role === "user") {
          await db.saveAIChatMemory(currentUser.id, "user", lastUserMsg.content);
        }
        if (response.message) {
          await db.saveAIChatMemory(currentUser.id, "assistant", response.message);
        }
      } catch (saveErr) {
        console.error("Gagal menyimpan memori chat AI:", saveErr);
      }
    }

    return NextResponse.json({
      reply: response.message,
      message: response.message,
      provider: response.provider,
      model: response.model,
      savedToMemory: Boolean(currentUser),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("AI Route Error:", message);
    return NextResponse.json(
      { error: "Gagal memproses pesan asisten AI saat ini." },
      { status: 500 }
    );
  }
}
