import { Suspense } from "react";
import { BookingsClient } from "@/components/admin/bookings-client";
import { AdminPageShell } from "@/components/admin/page-shell";

export const dynamic = "force-dynamic";

export default function AdminBookingsPage() {
  return (
    <AdminPageShell
      title="Bookings"
      description="Search, review, export, and manage every guest booking from one operational list."
    >
      <Suspense>
        <BookingsClient />
      </Suspense>
    </AdminPageShell>
  );
}
