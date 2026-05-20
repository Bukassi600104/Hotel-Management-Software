import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CmsShell } from "@/components/cms/cms-shell";
import { hasSupabaseAdminEnv, hasSupabasePublicEnv } from "@/lib/supabase/config";

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabasePublicEnv() || !hasSupabaseAdminEnv()) {
    return (
      <CmsShell adminName="Demo Manager" adminRole="super_admin">
        {children}
      </CmsShell>
    );
  }

  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();

  if (!user) return <>{children}</>;

  const admin = createAdminClient();
  const { data: adminUser } = await admin
    .from("admin_users")
    .select("full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!adminUser || !adminUser.is_active) return <>{children}</>;

  return (
    <CmsShell adminName={adminUser.full_name ?? user.email ?? "Admin"} adminRole={adminUser.role ?? "staff"}>
      {children}
    </CmsShell>
  );
}
