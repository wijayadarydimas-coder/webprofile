import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ loggedIn: false, messages: [] }, { headers });
    }

    const memories = await db.getAIChatMemories(user.id);
    return NextResponse.json(
      {
        loggedIn: true,
        user: { id: user.id, name: user.name, role: user.role },
        messages: memories.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      },
      { headers }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message, messages: [] }, { status: 500, headers });
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Anda belum masuk." }, { status: 401, headers });
    }

    await db.clearAIChatMemories(user.id);
    return NextResponse.json(
      { success: true, message: "Riwayat percakapan berhasil dihapus." },
      { headers }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 500, headers });
  }
}
