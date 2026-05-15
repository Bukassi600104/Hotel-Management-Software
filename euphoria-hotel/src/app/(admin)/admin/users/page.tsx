import { Suspense } from "react";
import { UsersClient } from "@/components/admin/users-client";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  if (!hasSupabaseAdminEnv()) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Users</h1>
        <p className="mt-1 text-sm text-white/40">Manage admin accounts and roles.</p>
        <Suspense>
          <UsersClient />
        </Suspense>
      </div>
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
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Users</h1>
        <p className="mt-4 text-sm text-white/40">
          Only super admins can manage user accounts. Contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Users</h1>
      <p className="mt-1 text-sm text-white/40">Manage admin accounts and roles.</p>
      <Suspense>
        <UsersClient />
      </Suspense>
    </div>
  );
}
