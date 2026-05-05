import { Suspense } from "react";
import { BookingsClient } from "@/components/admin/bookings-client";

export const dynamic = "force-dynamic";

export default function AdminBookingsPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Bookings</h1>
      <Suspense>
        <BookingsClient />
      </Suspense>
    </div>
  );
}
