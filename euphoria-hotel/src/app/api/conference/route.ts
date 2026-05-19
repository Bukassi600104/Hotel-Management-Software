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
  phone: z.string().min(7).max(30),
  date: z.string().min(1).max(20),
  guests: z.string().min(1).max(20),
  layout: z.string().min(1).max(100),
  message: z.string().min(10).max(3000),
});

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, "conference", { limit: 3, windowSeconds: 3600 });
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

  const { name, email, phone, date, guests, layout, message } = parsed.data;

  const fullMessage = `[Date: ${date} | Guests: ${guests} | Layout: ${layout}]\n\n${message}`;

  if (hasSupabaseAdminEnv()) {
    const admin = createAdminClient();
    const { error } = await admin.from("contact_inquiries").insert({
      name,
      email,
      phone,
      topic: "Conference & events",
      message: fullMessage,
      source: "conference",
      is_read: false,
    });

    if (error) {
      console.error("conference insert error:", error);
      return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
    }
  }

  const adminEmail = process.env.RESEND_FROM_EMAIL ?? siteConfig.contact.email;
  const now = new Date().toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });

  await sendEmail({
    to: adminEmail,
    subject: `New conference enquiry from ${name} — ${date}`,
    react: React.createElement(ContactInquiryAlert, {
      name,
      email,
      phone,
      topic: "Conference & events",
      message: fullMessage,
      source: "conference",
      receivedAt: now,
    }),
  }).catch((err) => console.error("[conference email]", err));

  return NextResponse.json({ success: true, demo: !hasSupabaseAdminEnv() });
}
