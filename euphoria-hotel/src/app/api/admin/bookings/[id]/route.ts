import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { formatDateLong } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import BookingCancellation from "@emails/BookingCancellation";
import * as React from "react";

const updateSchema = z.object({
  action: z.enum(["check_in", "check_out", "cancel", "update_notes"]),
  cancellationReason: z.string().optional(),
  internalNotes: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("bookings")
    .select("*, rooms(name, slug, thumbnail_url)")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: booking, error: fetchErr } = await admin
    .from("bookings")
    .select("*, rooms(name)")
    .eq("id", id)
    .single();

  if (fetchErr || !booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const { action, cancellationReason, internalNotes } = parsed.data;

  if (action === "check_in") {
    if (booking.status !== "confirmed") {
      return NextResponse.json({ error: "Can only check in confirmed bookings." }, { status: 409 });
    }
    await admin.from("bookings").update({ status: "checked_in" }).eq("id", id);
    await admin.from("audit_log").insert({
      action: "check_in",
      admin_user_id: user.id,
      entity_type: "booking",
      entity_id: id,
      details: { booking_reference: booking.booking_reference },
    });
  } else if (action === "check_out") {
    if (booking.status !== "checked_in") {
      return NextResponse.json({ error: "Can only check out checked-in bookings." }, { status: 409 });
    }
    await admin.from("bookings").update({ status: "checked_out" }).eq("id", id);
    await admin.from("audit_log").insert({
      action: "check_out",
      admin_user_id: user.id,
      entity_type: "booking",
      entity_id: id,
      details: { booking_reference: booking.booking_reference },
    });
  } else if (action === "cancel") {
    if (["cancelled", "refunded", "expired"].includes(booking.status ?? "")) {
      return NextResponse.json({ error: "Booking is already cancelled." }, { status: 409 });
    }
    await admin
      .from("bookings")
      .update({
        status: "cancelled",
        cancellation_reason: cancellationReason ?? null,
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", id);
    await admin.from("audit_log").insert({
      action: "cancel",
      admin_user_id: user.id,
      entity_type: "booking",
      entity_id: id,
      details: { reason: cancellationReason, booking_reference: booking.booking_reference },
    });

    // Send cancellation email to guest
    const roomName = (booking.rooms as { name: string } | null)?.name ?? "your room";
    const adminEmail = process.env.RESEND_FROM_EMAIL ?? siteConfig.contact.email;
    await sendEmail({
      to: booking.guest_email,
      subject: `Your booking ${booking.booking_reference} has been cancelled`,
      react: React.createElement(BookingCancellation, {
        guestName: booking.guest_name,
        bookingReference: booking.booking_reference,
        roomName,
        checkInDate: formatDateLong(booking.check_in_date),
        checkOutDate: formatDateLong(booking.check_out_date),
        cancellationReason,
      }),
    }).catch((err) => console.error("[cancel email]", err));

    // Notify admin of the cancellation
    await sendEmail({
      to: adminEmail,
      subject: `Booking cancelled — ${booking.booking_reference} · ${booking.guest_name}`,
      react: React.createElement(BookingCancellation, {
        guestName: booking.guest_name,
        bookingReference: booking.booking_reference,
        roomName,
        checkInDate: formatDateLong(booking.check_in_date),
        checkOutDate: formatDateLong(booking.check_out_date),
        cancellationReason,
      }),
    }).catch((err) => console.error("[cancel admin email]", err));
  } else if (action === "update_notes") {
    await admin
      .from("bookings")
      .update({ internal_notes: internalNotes ?? null })
      .eq("id", id);
  }

  return NextResponse.json({ success: true });
}
