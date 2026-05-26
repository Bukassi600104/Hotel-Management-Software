import { Suspense } from "react";
import { BlocksClient } from "@/components/admin/blocks-client";
import { AdminPageShell } from "@/components/admin/page-shell";

export const dynamic = "force-dynamic";

export default function AdminBlocksPage() {
  return (
    <AdminPageShell
      title="Block Dates"
      description="Close rooms for maintenance, private events, owner use, or any temporary availability hold."
    >
      <Suspense>
        <BlocksClient />
      </Suspense>
    </AdminPageShell>
  );
}
