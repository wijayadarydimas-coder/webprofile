import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security/ratelimit";
import { generateAIChatResponse, type ChatMessage } from "@/lib/ai/adapter";
import { z } from "zod";

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().trim().min(1).max(500),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`ai:${ip}`, { limit: 12, windowMs: 60 * 1000 });

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

    const response = await generateAIChatResponse(parsed.data.messages as ChatMessage[]);

    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("AI Route Error:", message);
    return NextResponse.json(
      { error: "Gagal memproses pesan asisten AI saat ini." },
      { status: 500 }
    );
  }
}
