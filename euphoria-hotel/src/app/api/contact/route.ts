import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as React from "react";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";
import { sendEmail } from "@/lib/email/send";
import { siteConfig } from "@/lib/site";
import ContactInquiryAlert from "@emails/ContactInquiryAlert";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  topic: z.string().min(1).max(100),
  message: z.string().min(10).max(3000),
});

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, "contact", { limit: 3, windowSeconds: 3600 });
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, phone, topic, message } = parsed.data;

  if (hasSupabaseAdminEnv()) {
    const admin = createAdminClient();
    const { error } = await admin.from("contact_inquiries").insert({
      name,
      email,
      phone: phone || null,
      topic,
      message,
      source: "contact",
      is_read: false,
    });

    if (error) {
      console.error("contact insert error:", error);
      return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? siteConfig.contact.email;
  const now = new Date().toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });

  await sendEmail({
    to: adminEmail,
    subject: `New enquiry from ${name} — ${topic}`,
    react: React.createElement(ContactInquiryAlert, {
      name,
      email,
      phone,
      topic,
      message,
      source: "contact",
      receivedAt: now,
    }),
  }).catch((err) => console.error("[contact email]", err));

  return NextResponse.json({ success: true, demo: !hasSupabaseAdminEnv() });
}
