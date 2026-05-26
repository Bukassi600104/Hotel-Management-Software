import { Suspense } from "react";
import { RoomsClient } from "@/components/admin/rooms-client";
import { AdminPageShell } from "@/components/admin/page-shell";

export const dynamic = "force-dynamic";

export default function AdminRoomsPage() {
  return (
    <AdminPageShell
      title="Rooms"
      description="Manage room details, pricing, imagery, capacity, and public availability."
    >
      <Suspense>
        <RoomsClient />
      </Suspense>
    </AdminPageShell>
  );
}
