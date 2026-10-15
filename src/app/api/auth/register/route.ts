import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authRegisterSchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/security/ratelimit";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`register:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak pendaftaran dari perangkat ini. Silakan coba lagi nanti." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = authRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data pendaftaran tidak valid.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check existing
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.createUser({
      name,
      email,
      role: "visitor",
      passwordHash,
    } as Parameters<typeof db.createUser>[0]);

    const token = await createSessionToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Register Error:", message);
    return NextResponse.json(
      { error: "Terjadi kegagalan saat mendaftarkan akun." },
      { status: 500 }
    );
  }
}
