import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@/types";

const COOKIE_NAME = "wdd_session_token";
const MIN_SECRET_LENGTH = 32;

let cachedSecretKey: Uint8Array | null = null;

/**
 * Returns the JWT signing key. Fails closed (throws) if AUTH_SECRET is
 * missing or too short — there is intentionally no hardcoded fallback.
 */
function getSecretKey(): Uint8Array {
  if (cachedSecretKey) return cachedSecretKey;
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `AUTH_SECRET is not configured or shorter than ${MIN_SECRET_LENGTH} characters.`
    );
  }
  cachedSecretKey = new TextEncoder().encode(secret);
  return cachedSecretKey;
}

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  [key: string]: unknown;
}

/**
 * Creates and signs a secure JWT session token.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

/**
 * Verifies a JWT session token.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Sets the session cookie on the incoming response context.
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Retrieves and validates the current user session from cookies.
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Asserts admin role or throws/returns null.
 */
export async function checkIsAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}
