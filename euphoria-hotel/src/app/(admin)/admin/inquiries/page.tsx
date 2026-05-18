import { Suspense } from "react";
import { InquiriesClient } from "@/components/admin/inquiries-client";
import { AdminPageShell } from "@/components/admin/page-shell";

export const dynamic = "force-dynamic";

export default function AdminInquiriesPage() {
  return (
    <AdminPageShell
      title="Inquiries"
      description="Read, respond to, mark, and clear guest contact and conference messages."
    >
      <Suspense>
        <InquiriesClient />
      </Suspense>
    </AdminPageShell>
  );
}
