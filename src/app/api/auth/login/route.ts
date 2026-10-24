import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { authLoginSchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/security/ratelimit";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { LocalStoreRepository } from "@/lib/db/store";

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`login:${ip}`, { limit: 8, windowMs: 5 * 60 * 1000 });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan masuk. Silakan tunggu 5 menit." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = authLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Format email atau password tidak valid." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Check if user already exists in database
    let dbUser = await db.findUserByEmail(email);

    // 1. Check environment admin credentials (quick setup & override).
    // No hardcoded defaults: this path is disabled unless both env vars are set.
    const envAdminEmail = process.env.ADMIN_EMAIL;
    const envAdminPassword = process.env.ADMIN_PASSWORD;

    if (
      envAdminEmail &&
      envAdminPassword &&
      email.toLowerCase() === envAdminEmail.toLowerCase()
    ) {
      const isPasswordMatch = safeEqual(password, envAdminPassword);
      if (isPasswordMatch) {
        if (!dbUser) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            dbUser = await db.createUser({
              name: process.env.ADMIN_NAME || "Wijaya Dary Dimas",
              email: envAdminEmail,
              role: "admin",
              passwordHash: hash,
            });
          } catch (createErr) {
            console.error("Auto-provision admin error:", createErr);
          }
        }

        const adminId = dbUser?.id || "admin-master-id";
        const adminName = dbUser?.name || "Wijaya Dary Dimas";

        const token = await createSessionToken({
          id: adminId,
          name: adminName,
          email: envAdminEmail,
          role: "admin",
        });
        await setSessionCookie(token);

        return NextResponse.json({
          user: {
            id: adminId,
            name: adminName,
            email: envAdminEmail,
            role: "admin",
          },
        });
      }
    }

    // 2. Check Database users
    const user = dbUser;
    if (!user) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    // Get stored password hash
    const passwordHash = (await db.getUserPasswordHash(email)) || "";

    if (!passwordHash) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Login Error:", message);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses login." },
      { status: 500 }
    );
  }
}
