import { Suspense } from "react";
import { BlocksClient } from "@/components/admin/blocks-client";

export const dynamic = "force-dynamic";

export default function AdminBlocksPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Block Dates</h1>
      <p className="mt-1 text-sm text-white/40">Close a room for specific dates — maintenance, private events, owner use.</p>
      <Suspense>
        <BlocksClient />
      </Suspense>
    </div>
  );
}
