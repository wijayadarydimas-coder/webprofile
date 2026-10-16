import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { assistResearchWriting, type ResearchAIAssistRequest } from "@/lib/ai/adapter";
import { z } from "zod";

const assistSchema = z.object({
  action: z.enum([
    "grammar",
    "academic",
    "concise",
    "expand",
    "structure",
    "consistency",
    "missing_info",
    "check_alignment",
  ]),
  sectionTitle: z.string().trim().min(1),
  sectionType: z.string().trim().default("markdown"),
  currentContent: z.string().default(""),
  researchContext: z
    .object({
      title: z.string().optional(),
      summary: z.string().optional(),
      publishedStatus: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak. Fitur asisten riset hanya untuk administrator." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = assistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Permintaan bantuan AI tidak valid.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const result = await assistResearchWriting(parsed.data as ResearchAIAssistRequest);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    console.error("Research Assistant API error:", message);
    return NextResponse.json(
      { error: "Gagal memproses bantuan penulisan AI." },
      { status: 500 }
    );
  }
}
