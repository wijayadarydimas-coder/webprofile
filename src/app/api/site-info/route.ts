import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [profile, settings] = await Promise.all([
      db.getProfile(),
      db.getSettings(),
    ]);

    return NextResponse.json({
      brandName: profile.brandName || profile.fullName || "Wijaya Dary Dimas",
      fullName: profile.fullName || "Wijaya Dary Dimas",
      roleTitle: profile.roleTitle || "Informatics & CV Engineer",
      logoUrl: profile.logoUrl || "",
      aiAssistantName: settings.aiAssistantName || "Asisten AI — Wijaya Dary Dimas",
      enableAiAssistant: settings.enableAiAssistant !== false,
      instagramUrl: profile.instagramUrl || "",
      tiktokUrl: profile.tiktokUrl || "",
      githubUrl: profile.githubUrl || "",
      linkedinUrl: profile.linkedinUrl || "",
      email: profile.email || "",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        brandName: "Wijaya Dary Dimas",
        fullName: "Wijaya Dary Dimas",
        roleTitle: "Informatics & CV Engineer",
        logoUrl: "",
        aiAssistantName: "Asisten AI — Wijaya Dary Dimas",
        enableAiAssistant: true,
      },
      { status: 200 }
    );
  }
}
