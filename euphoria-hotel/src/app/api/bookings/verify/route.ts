import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { formatDateLong, formatNaira } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import BookingConfirmation from "@emails/BookingConfirmation";
import AdminBookingAlert from "@emails/AdminBookingAlert";
import * as React from "react";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  const trxref = req.nextUrl.searchParams.get("trxref");
  const ref = reference ?? trxref;

  if (!ref) {
    return NextResponse.redirect(new URL("/booking/failed?reason=missing_reference", req.url));
  }

  try {
    const admin = createAdminClient();

    const { data: booking, error: bookingError } = await admin
      .from("bookings")
      .select(
        "id, status, total_amount, guest_email, guest_name, guest_phone, booking_reference, check_in_date, check_out_date, total_nights, rooms(id, name)"
      )
      .eq("booking_reference", ref)
      .single();

    if (bookingError || !booking) {
      return NextResponse.redirect(new URL("/booking/failed?reason=not_found", req.url));
    }

    // Already confirmed (webhook may have fired first)
    if (booking.status === "confirmed") {
      return NextResponse.redirect(new URL(`/booking/success?ref=${ref}`, req.url));
    }

    if (booking.status !== "pending") {
      return NextResponse.redirect(new URL("/booking/failed?reason=invalid_status", req.url));
    }

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || paystackData.data?.status !== "success") {
      return NextResponse.redirect(new URL("/booking/failed?reason=payment_failed", req.url));
    }

    // Amount tamper check — Paystack reports kobo; DB stores Naira
    const expectedKobo = booking.total_amount * 100;
    if (paystackData.data.amount !== expectedKobo) {
      await admin.from("audit_log").insert({
        action: "amount_mismatch",
        entity_type: "booking",
        entity_id: booking.id,
        details: {
          expected_kobo: expectedKobo,
          received_kobo: paystackData.data.amount,
          reference: ref,
        },
      });
      return NextResponse.redirect(new URL("/booking/failed?reason=amount_mismatch", req.url));
    }

    await admin
      .from("bookings")
      .update({
        status: "confirmed",
        paystack_reference: paystackData.data.reference,
        paid_at: new Date().toISOString(),
      })
      .eq("id", booking.id);

    // Send emails (webhook uses idempotency so will skip if it also fires)
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

    return NextResponse.redirect(new URL(`/booking/success?ref=${ref}`, req.url));
  } catch {
    return NextResponse.redirect(new URL("/booking/failed?reason=server_error", req.url));
  }
}
