import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { formatDateLong, formatNaira } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import BookingConfirmation from "@emails/BookingConfirmation";
import AdminBookingAlert from "@emails/AdminBookingAlert";
import * as React from "react";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-paystack-signature");
  if (!signature) return NextResponse.json({}, { status: 401 });

  const rawBody = await req.text();

  const expected = createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({}, { status: 401 });
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({}, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const data = event.data;
  const reference = data.reference as string;
  if (!reference) return NextResponse.json({ received: true });

  const admin = createAdminClient();

  const { data: booking } = await admin
    .from("bookings")
    .select(
      "id, status, total_amount, guest_email, guest_name, guest_phone, booking_reference, check_in_date, check_out_date, total_nights, rooms(name)"
    )
    .eq("booking_reference", reference)
    .single();

  if (!booking) return NextResponse.json({ received: true });

  // Idempotency — verify route already confirmed this booking and sent emails
  if (booking.status === "confirmed") return NextResponse.json({ received: true });

  if (booking.status !== "pending") return NextResponse.json({ received: true });

  // Amount check — Paystack reports kobo; DB stores Naira
  const receivedKobo = data.amount as number;
  const expectedKobo = booking.total_amount * 100;
  if (receivedKobo !== expectedKobo) {
    await admin.from("audit_log").insert({
      action: "webhook_amount_mismatch",
      entity_type: "booking",
      entity_id: booking.id,
      details: { expected_kobo: expectedKobo, received_kobo: receivedKobo, reference },
    });
    return NextResponse.json({ received: true });
  }

  await admin
    .from("bookings")
    .update({
      status: "confirmed",
      paystack_reference: reference,
      paid_at: new Date().toISOString(),
    })
    .eq("id", booking.id);

  // Guest closed browser before redirect — this is the fallback confirmation path, send emails now
  const roomName = (booking.rooms as { name: string } | null)?.name ?? "Your room";
  const checkInLong = formatDateLong(booking.check_in_date);
  const checkOutLong = formatDateLong(booking.check_out_date);
  const totalFormatted = formatNaira(booking.total_amount);
  const adminEmail = process.env.RESEND_FROM_EMAIL ?? siteConfig.contact.email;

  await Promise.allSettled([
    sendEmail({
      to: booking.guest_email,
      subject: `Booking confirmed — ${booking.booking_reference}`,
      react: React.createElement(BookingConfirmation, {
        guestName: booking.guest_name,
        bookingReference: booking.booking_reference,
        roomName,
        checkInDate: checkInLong,
        checkOutDate: checkOutLong,
        totalNights: booking.total_nights,
        totalAmountNaira: totalFormatted,
        checkInTime: siteConfig.hours.checkIn,
      }),
    }),
    sendEmail({
      to: adminEmail,
      subject: `New booking — ${booking.booking_reference} · ${booking.guest_name}`,
      react: React.createElement(AdminBookingAlert, {
        guestName: booking.guest_name,
        guestEmail: booking.guest_email,
        guestPhone: booking.guest_phone,
        bookingReference: booking.booking_reference,
        roomName,
        checkInDate: checkInLong,
        checkOutDate: checkOutLong,
        totalNights: booking.total_nights,
        totalAmountNaira: totalFormatted,
        bookingId: booking.id,
      }),
    }),
  ]);

  return NextResponse.json({ received: true });
}
