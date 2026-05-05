import { Resend } from "resend";
import type * as React from "react";

type SendOptions = {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
};

export async function sendEmail({ to, subject, react }: SendOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "bookings@hiltoneuphoriahotel.com";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping send:", subject);
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, subject, react });

  if (error) {
    console.error("[email] Resend error:", error);
    throw new Error(`Email send failed: ${error.message}`);
  }
}
