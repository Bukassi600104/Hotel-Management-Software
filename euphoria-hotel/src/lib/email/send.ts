import { Resend } from "resend";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import type * as React from "react";

type SendOptions = {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
};

export async function sendEmail({ to, subject, react }: SendOptions): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const fallbackFrom = process.env.RESEND_FROM_EMAIL ?? "bookings@hiltoneuphoriahotel.com";
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL ?? fallbackFrom,
      to,
      subject,
      html: await render(react),
    });
    return;
  }

  if (!resendKey) {
    console.warn("[email] SMTP_* and RESEND_API_KEY not set - skipping send:", subject);
    return;
  }

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: fallbackFrom,
    to,
    subject,
    react,
  });

  if (error) {
    console.error("[email] Resend error:", error);
    throw new Error(`Email send failed: ${error.message}`);
  }
}

