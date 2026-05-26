import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { hasSupabasePublicEnv } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabasePublicEnv()) {
    return (
      <AdminShell adminName="Hotel Manager" adminRole="super_admin" unreadCount={0}>
        {children}
      </AdminShell>
    );
  }

  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();

  // Middleware already redirects unauthenticated requests to /admin/login.
  // When this layout wraps /admin/login itself, there is no user — just
  // render children bare so the login form displays without a sidebar.
  if (!user) {
    return <>{children}</>;
  }

  const admin = createAdminClient();

  const [{ data: adminUser }, { count: unreadCount }] = await Promise.all([
    admin.from("admin_users").select("full_name, role, is_active").eq("id", user.id).single(),
    admin.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);

  // Authenticated but not in admin_users (or deactivated) — sign out and
  // send back to login. Middleware catches this on the next request.
  if (!adminUser || !adminUser.is_active) {
    // Can't call browser methods from a server component — return children
    // and let the client-side session expiry / middleware handle it.
    return <>{children}</>;
  }

  return (
    <AdminShell
      adminName={adminUser.full_name ?? user.email ?? "Admin"}
      adminRole={adminUser.role ?? "staff"}
      unreadCount={unreadCount ?? 0}
    >
      {children}
    </AdminShell>
  );
}
