import { NextRequest, NextResponse } from "next/server";

type RateLimitConfig = {
  limit: number;
  windowSeconds: number;
};

export async function checkRateLimit(
  req: NextRequest,
  identifier: string,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Skip rate limiting if Upstash is not configured
  if (!url || !token) return null;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const key = `rl:${identifier}:${ip}`;

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({ url, token });
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.limit, `${config.windowSeconds} s`),
      prefix: "euphoria",
    });

    const { success, reset } = await ratelimit.limit(key);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }
  } catch (err) {
    console.warn("[rate-limit] Upstash error, skipping:", err);
  }

  return null;
}
