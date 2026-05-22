type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const now = Date.now();
  const key = `${scope}:${getClientIp(request)}`;
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    return { limited: false, remaining: limit - 1, resetAt: now + windowMs };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return { limited: true, remaining: 0, resetAt: existing.resetAt };
  }

  return { limited: false, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function rateLimitResponse(resetAt: number) {
  return Response.json(
    { error: "Too many submissions. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)).toString()
      }
    }
  );
}
