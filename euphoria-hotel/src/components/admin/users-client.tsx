"use client";

import * as React from "react";
import { UserPlus, Power, PowerOff } from "lucide-react";
import { formatDateShort } from "@/lib/format";

type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  is_active: boolean | null;
  last_active_at: string | null;
  created_at: string | null;
};

export function UsersClient() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showInvite, setShowInvite] = React.useState(false);
  const [invite, setInvite] = React.useState({ email: "", fullName: "", role: "staff" });
  const [inviting, setInviting] = React.useState(false);
  const [inviteError, setInviteError] = React.useState<string | null>(null);

  async function load() {
    const data = await fetch("/api/admin/users").then((r) => r.json());
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError(null);
    setInviting(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invite),
    });
    setInviting(false);
    if (!res.ok) {
      const data = await res.json();
      setInviteError(data.error ?? "Failed to invite user.");
      return;
    }
    setShowInvite(false);
    setInvite({ email: "", fullName: "", role: "staff" });
    await load();
  }

  async function updateUser(id: string, updates: { role?: string; isActive?: boolean }) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    await load();
  }

  const ROLES = ["super_admin", "manager", "staff"];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-white/40">{users.length} admin account{users.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 rounded-lg bg-[#c9a961] px-4 py-2 text-xs font-semibold text-[#17181a] hover:opacity-90"
        >
          <UserPlus className="size-4" />
          Invite staff member
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/3 p-5">
          <h3 className="mb-4 text-sm font-semibold text-white/80">Invite a new staff member</h3>
          <form onSubmit={handleInvite} className="space-y-3">
            {inviteError && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {inviteError}
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] text-white/40">Full name</label>
                <input
                  type="text"
                  value={invite.fullName}
                  onChange={(e) => setInvite({ ...invite, fullName: e.target.value })}
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white focus:border-[#c9a961]/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-white/40">Email address</label>
                <input
                  type="email"
                  value={invite.email}
                  onChange={(e) => setInvite({ ...invite, email: e.target.value })}
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white focus:border-[#c9a961]/40 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-white/40">Role</label>
              <select
                value={invite.role}
                onChange={(e) => setInvite({ ...invite, role: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2.5 text-sm text-white focus:border-[#c9a961]/40 focus:outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={inviting}
                className="rounded-lg bg-[#c9a961] px-5 py-2 text-xs font-semibold text-[#17181a] hover:opacity-90 disabled:opacity-50"
              >
                {inviting ? "Sending invite…" : "Send invite email"}
              </button>
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/50 hover:border-white/20"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users table */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-[#c9a961]" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/8">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/8 bg-white/3">
              <tr>
                {["Name", "Email", "Role", "Last active", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/2">
                  <td className="px-4 py-3 font-medium text-white/80">{u.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-white/50">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role ?? "staff"}
                      onChange={(e) => updateUser(u.id, { role: e.target.value })}
                      className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs text-white/60 focus:outline-none capitalize"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r.replace("_", " ")}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-white/35 text-xs">
                    {u.last_active_at ? formatDateShort(u.last_active_at) : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      u.is_active ? "bg-emerald-400/15 text-emerald-400" : "bg-white/8 text-white/35"
                    }`}>
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateUser(u.id, { isActive: !u.is_active })}
                      className={`rounded-lg border px-3 py-1 text-xs transition-colors ${
                        u.is_active
                          ? "border-red-500/20 text-red-400/60 hover:border-red-500/40 hover:text-red-400"
                          : "border-emerald-500/20 text-emerald-400/60 hover:border-emerald-500/40 hover:text-emerald-400"
                      }`}
                    >
                      {u.is_active ? <><PowerOff className="inline size-3 mr-1" />Deactivate</> : <><Power className="inline size-3 mr-1" />Reactivate</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
