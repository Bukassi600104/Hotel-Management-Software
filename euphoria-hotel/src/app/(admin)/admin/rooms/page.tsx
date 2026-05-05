import { Suspense } from "react";
import { RoomsClient } from "@/components/admin/rooms-client";

export const dynamic = "force-dynamic";

export default function AdminRoomsPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Rooms</h1>
      <p className="mt-1 text-sm text-white/40">Manage room details, pricing, and availability.</p>
      <Suspense>
        <RoomsClient />
      </Suspense>
    </div>
  );
}
