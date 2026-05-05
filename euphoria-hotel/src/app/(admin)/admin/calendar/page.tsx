import { Suspense } from "react";
import { CalendarClient } from "@/components/admin/calendar-client";

export const dynamic = "force-dynamic";

export default function AdminCalendarPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Calendar</h1>
      <p className="mt-1 text-sm text-white/40">Monthly overview of all room occupancy.</p>
      <Suspense>
        <CalendarClient />
      </Suspense>
    </div>
  );
}
