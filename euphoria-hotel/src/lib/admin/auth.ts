import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type AdminRole = Database["public"]["Enums"]["admin_role"];

export async function requireActiveAdmin(allowedRoles?: AdminRole[]) {
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
      adminUser: null,
    };
  }

  const admin = createAdminClient();
  const { data: adminUser } = await admin
    .from("admin_users")
    .select("id, role, is_active")
    .eq("id", user.id)
    .single();

  if (
    !adminUser?.is_active ||
    (allowedRoles?.length && !allowedRoles.includes(adminUser.role as AdminRole))
  ) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
      adminUser: null,
    };
  }

  return { error: null, user, adminUser };
}
