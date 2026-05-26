import { Suspense } from "react";
import { CalendarClient } from "@/components/admin/calendar-client";
import { AdminPageShell } from "@/components/admin/page-shell";

export const dynamic = "force-dynamic";

export default function AdminCalendarPage() {
  return (
    <AdminPageShell
      title="Calendar"
      description="Monthly room occupancy, blocked dates, and guest stays in one visual schedule."
    >
      <Suspense>
        <CalendarClient />
      </Suspense>
    </AdminPageShell>
  );
}
