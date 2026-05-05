import { Suspense } from "react";
import { InquiriesClient } from "@/components/admin/inquiries-client";

export const dynamic = "force-dynamic";

export default function AdminInquiriesPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Inquiries</h1>
      <p className="mt-1 text-sm text-white/40">Contact form and conference enquiries from guests.</p>
      <Suspense>
        <InquiriesClient />
      </Suspense>
    </div>
  );
}
