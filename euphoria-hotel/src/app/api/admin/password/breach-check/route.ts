import { NextResponse } from "next/server";
import { z } from "zod";

import { requireActiveAdmin } from "@/lib/admin/auth";

const schema = z.object({
  sha1Prefix: z.string().regex(/^[A-F0-9]{5}$/),
  sha1Suffix: z.string().regex(/^[A-F0-9]{35}$/),
});

export async function POST(request: Request) {
  const auth = await requireActiveAdmin();
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid password hash format." }, { status: 400 });
  }

  const { sha1Prefix, sha1Suffix } = parsed.data;

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${sha1Prefix}`, {
      headers: {
        "Add-Padding": "true",
        "User-Agent": "Hilton-Euphoria-Admin-Password-Check",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not verify password exposure. Please try again." },
        { status: 502 }
      );
    }

    const text = await response.text();
    const match = text
      .split("\n")
      .map((line) => line.trim().split(":"))
      .find(([suffix]) => suffix === sha1Suffix);

    const count = match?.[1] ? Number.parseInt(match[1], 10) : 0;

    return NextResponse.json({
      compromised: Number.isFinite(count) && count > 0,
      count: Number.isFinite(count) ? count : 0,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not verify password exposure. Please try again." },
      { status: 502 }
    );
  }
}
