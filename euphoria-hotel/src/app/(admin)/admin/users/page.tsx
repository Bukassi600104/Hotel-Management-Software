import { Suspense } from "react";
import { redirect } from "next/navigation";
import { UsersClient } from "@/components/admin/users-client";
import { AdminPageShell, adminPanelClass } from "@/components/admin/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  if (!hasSupabaseAdminEnv()) {
    return (
      <AdminPageShell title="Users" description="Manage admin accounts, roles, and staff access.">
        <Suspense>
          <UsersClient />
        </Suspense>
      </AdminPageShell>
    );
  }

  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = createAdminClient();
  const { data: adminUser } = await admin
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminUser?.role !== "super_admin") {
    return (
      <AdminPageShell title="Users" description="Manage admin accounts, roles, and staff access.">
        <div className={`${adminPanelClass} p-6`}>
          <p className="text-sm text-white/52">
            Only super admins can manage user accounts. Contact your administrator.
          </p>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell title="Users" description="Manage admin accounts, roles, and staff access.">
      <Suspense>
        <UsersClient />
      </Suspense>
    </AdminPageShell>
  );
}
