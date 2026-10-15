interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    // Keep timestamps from the last 15 minutes
    record.timestamps = record.timestamps.filter((t) => now - t < 15 * 60 * 1000);
    if (record.timestamps.length === 0) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

/**
 * Checks whether an action from a given key exceeds the rate limit.
 * Returns { allowed: boolean, remaining: number, resetMs: number }
 */
export function checkRateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  const record = store.get(key) || { timestamps: [] };

  // Remove timestamps outside current window
  record.timestamps = record.timestamps.filter((t) => now - t < options.windowMs);

  if (record.timestamps.length >= options.limit) {
    const oldest = record.timestamps[0];
    const resetMs = options.windowMs - (now - oldest);
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  record.timestamps.push(now);
  store.set(key, record);

  return {
    allowed: true,
    remaining: options.limit - record.timestamps.length,
    resetMs: options.windowMs,
  };
}

/**
 * Extracts client IP or fallback identifier from Next.js request headers.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
