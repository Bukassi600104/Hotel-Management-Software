"use client";

import * as React from "react";
import { Trash2, Plus, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { formatDateShort } from "@/lib/format";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Room = { id: string; name: string };
type Block = {
  id: string;
  room_id: string;
  blocked_from: string;
  blocked_to: string;
  reason: string | null;
  rooms: { name: string } | null;
};

export function BlocksClient() {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [blocks, setBlocks] = React.useState<Block[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ roomId: "", blockedFrom: "", blockedTo: "", reason: "" });
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    const [roomsRes, blocksRes] = await Promise.all([
      fetch("/api/admin/rooms").then((r) => r.json()),
      fetch("/api/admin/blocks").then((r) => r.json()),
    ]);
    setRooms(Array.isArray(roomsRes) ? roomsRes : []);
    setBlocks(Array.isArray(blocksRes) ? blocksRes : []);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.roomId || !form.blockedFrom || !form.blockedTo) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.blockedFrom > form.blockedTo) {
      setError("End date must be on or after start date.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: form.roomId,
        blockedFrom: form.blockedFrom,
        blockedTo: form.blockedTo,
        reason: form.reason || undefined,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to block dates.");
      return;
    }
    setForm({ roomId: "", blockedFrom: "", blockedTo: "", reason: "" });
    setFromDate(undefined);
    setToDate(undefined);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this block? The dates will become available again.")) return;
    await fetch(`/api/admin/blocks?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-6">
        <h2 className="mb-5 text-sm font-semibold text-white/80">Add a new block</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs text-white/45">Room *</label>
            <select
              value={form.roomId}
              onChange={(e) => setForm({ ...form, roomId: e.target.value })}
              required
              className="w-full rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2.5 text-sm text-white focus:border-[#c9a961]/40 focus:outline-none"
            >
              <option value="">Select a room…</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-white/45">From *</label>
              <Popover>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2.5 text-sm text-white text-left hover:border-white/20 focus:border-[#c9a961]/40 focus:outline-none"
                    >
                      <CalendarDays className="size-4 text-[#c9a961]/60" />
                      {fromDate ? format(fromDate, "MMM d, yyyy") : <span className="text-white/30">Select date</span>}
                    </button>
                  }
                />
                <PopoverContent align="start" className="w-auto p-0 rounded-xl border border-white/10 bg-[#111316]">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(d) => {
                      setFromDate(d ?? undefined);
                      if (d) setForm({ ...form, blockedFrom: format(d, "yyyy-MM-dd") });
                    }}
                    disabled={{ before: new Date() }}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/45">To *</label>
              <Popover>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2.5 text-sm text-white text-left hover:border-white/20 focus:border-[#c9a961]/40 focus:outline-none"
                    >
                      <CalendarDays className="size-4 text-[#c9a961]/60" />
                      {toDate ? format(toDate, "MMM d, yyyy") : <span className="text-white/30">Select date</span>}
                    </button>
                  }
                />
                <PopoverContent align="start" className="w-auto p-0 rounded-xl border border-white/10 bg-[#111316]">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(d) => {
                      setToDate(d ?? undefined);
                      if (d) setForm({ ...form, blockedTo: format(d, "yyyy-MM-dd") });
                    }}
                    disabled={{ before: fromDate || new Date() }}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-white/45">Reason (optional)</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. Maintenance, Private event, Owner use"
              className="w-full rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#c9a961]/40 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c9a961] py-2.5 text-sm font-semibold text-[#17181a] hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="size-4" />
            {saving ? "Saving…" : "Block dates"}
          </button>
        </form>
      </div>

      {/* Existing blocks */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white/80">Current and upcoming blocks</h2>
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-[#c9a961]" />
          </div>
        ) : blocks.length === 0 ? (
          <p className="text-sm text-white/30">No date blocks set.</p>
        ) : (
          <div className="space-y-2">
            {blocks.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80">
                    {b.rooms?.name ?? "Unknown room"}
                  </p>
                  <p className="text-xs text-white/40">
                    {formatDateShort(b.blocked_from)} → {formatDateShort(b.blocked_to)}
                    {b.reason && <span className="ml-2 text-white/30">· {b.reason}</span>}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-white/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
