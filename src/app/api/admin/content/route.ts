import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  profileUpdateSchema,
  projectSchema,
  experienceSchema,
  educationSchema,
  researchSchema,
  siteSettingsSchema,
} from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak. Memerlukan hak admin." }, { status: 403 });
    }

    const body = await req.json();
    const { action, entity, data, id } = body;

    // 1. Profile update
    if (entity === "profile") {
      const parsed = profileUpdateSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: "Data profil tidak valid.", details: parsed.error.format() }, { status: 400 });
      }
      const updated = await db.updateProfile(parsed.data);
      return NextResponse.json({ success: true, data: updated });
    }

    // 2. Projects CRUD
    if (entity === "project") {
      if (action === "delete") {
        if (!id) return NextResponse.json({ error: "ID proyek diperlukan." }, { status: 400 });
        await db.deleteProject(id);
        return NextResponse.json({ success: true });
      }
      const parsed = projectSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: "Data proyek tidak valid.", details: parsed.error.format() }, { status: 400 });
      }
      const saved = await db.saveProject(parsed.data);
      return NextResponse.json({ success: true, data: saved });
    }

    // 3. Experience CRUD
    if (entity === "experience") {
      if (action === "delete") {
        if (!id) return NextResponse.json({ error: "ID diperlukan." }, { status: 400 });
        await db.deleteExperience(id);
        return NextResponse.json({ success: true });
      }
      const parsed = experienceSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: "Data pengalaman tidak valid.", details: parsed.error.format() }, { status: 400 });
      }
      const saved = await db.saveExperience(parsed.data);
      return NextResponse.json({ success: true, data: saved });
    }

    // 4. Education CRUD
    if (entity === "education") {
      if (action === "delete") {
        if (!id) return NextResponse.json({ error: "ID diperlukan." }, { status: 400 });
        await db.deleteEducation(id);
        return NextResponse.json({ success: true });
      }
      const parsed = educationSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: "Data pendidikan tidak valid.", details: parsed.error.format() }, { status: 400 });
      }
      const saved = await db.saveEducation(parsed.data);
      return NextResponse.json({ success: true, data: saved });
    }

    // 5. Research CRUD
    if (entity === "research") {
      if (action === "delete") {
        if (!id) return NextResponse.json({ error: "ID diperlukan." }, { status: 400 });
        await db.deleteResearch(id);
        return NextResponse.json({ success: true });
      }
      const parsed = researchSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: "Data penelitian tidak valid.", details: parsed.error.format() }, { status: 400 });
      }
      const saved = await db.saveResearch(parsed.data);
      return NextResponse.json({ success: true, data: saved });
    }

    // 6. Site Settings
    if (entity === "settings") {
      const parsed = siteSettingsSchema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json({ error: "Pengaturan tidak valid.", details: parsed.error.format() }, { status: 400 });
      }
      const saved = await db.updateSettings(parsed.data);
      return NextResponse.json({ success: true, data: saved });
    }

    // 7. Media deletion
    if (entity === "media" && action === "delete") {
      if (!id) return NextResponse.json({ error: "ID media diperlukan." }, { status: 400 });
      await db.deleteMediaItem(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Aksi atau entitas tidak dikenali." }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    console.error("Admin content error:", message);
    return NextResponse.json({ error: "Gagal menyimpan perubahan admin." }, { status: 500 });
  }
}
