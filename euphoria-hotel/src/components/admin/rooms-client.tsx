"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Power, PowerOff, X, Save } from "lucide-react";
import { formatNaira } from "@/lib/format";

type Room = {
  id: string;
  name: string;
  short_name: string | null;
  slug: string;
  description: string | null;
  price_per_night: number;
  max_guests: number;
  bed_type: string | null;
  room_size_sqm: number | null;
  amenities: string[] | null;
  badge: string | null;
  display_order: number | null;
  is_active: boolean | null;
  thumbnail_url: string | null;
};

export function RoomsClient() {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<Room>>({});
  const [saving, setSaving] = React.useState(false);

  async function load() {
    const data = await fetch("/api/admin/rooms").then((r) => r.json());
    setRooms(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  function startEdit(room: Room) {
    setEditingId(room.id);
    setEditForm({ ...room });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    await fetch(`/api/admin/rooms/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        short_name: editForm.short_name,
        description: editForm.description,
        price_per_night: Number(editForm.price_per_night),
        max_guests: Number(editForm.max_guests),
        bed_type: editForm.bed_type,
        room_size_sqm: editForm.room_size_sqm ? Number(editForm.room_size_sqm) : undefined,
        amenities: editForm.amenities,
        badge: editForm.badge || null,
        display_order: editForm.display_order ? Number(editForm.display_order) : undefined,
      }),
    });
    setSaving(false);
    setEditingId(null);
    await load();
  }

  async function toggleActive(id: string, currentlyActive: boolean | null) {
    await fetch(`/api/admin/rooms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !currentlyActive }),
    });
    await load();
  }

  if (loading) {
    return (
      <div className="mt-10 flex justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c9a961]" />
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room) => (
        <div
          key={room.id}
          className={`rounded-xl border bg-white/3 overflow-hidden ${
            room.is_active ? "border-white/8" : "border-white/4 opacity-60"
          }`}
        >
          {/* Thumbnail */}
          {room.thumbnail_url && (
            <div className="relative h-36 overflow-hidden">
              <Image
                src={room.thumbnail_url}
                alt={room.name}
                fill
                className="object-cover"
                sizes="400px"
              />
              {!room.is_active && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/60">Inactive</span>
                </div>
              )}
            </div>
          )}

          {editingId === room.id ? (
            <div className="p-4 space-y-3">
              <EditField label="Name" value={editForm.name ?? ""} onChange={(v) => setEditForm({ ...editForm, name: v })} />
              <EditField label="Short name" value={editForm.short_name ?? ""} onChange={(v) => setEditForm({ ...editForm, short_name: v })} />
              <EditField label="Price per night (₦)" type="number" value={String(editForm.price_per_night ?? "")} onChange={(v) => setEditForm({ ...editForm, price_per_night: Number(v) })} />
              <EditField label="Max guests" type="number" value={String(editForm.max_guests ?? "")} onChange={(v) => setEditForm({ ...editForm, max_guests: Number(v) })} />
              <EditField label="Bed type" value={editForm.bed_type ?? ""} onChange={(v) => setEditForm({ ...editForm, bed_type: v })} />
              <EditField label="Size (sqm)" type="number" value={String(editForm.room_size_sqm ?? "")} onChange={(v) => setEditForm({ ...editForm, room_size_sqm: Number(v) })} />
              <EditField label="Badge" value={editForm.badge ?? ""} onChange={(v) => setEditForm({ ...editForm, badge: v })} />
              <div>
                <label className="mb-1 block text-[10px] text-white/40">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description ?? ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full resize-none rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white focus:border-[#c9a961]/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-white/40">Amenities (one per line)</label>
                <textarea
                  rows={4}
                  value={(editForm.amenities ?? []).join("\n")}
                  onChange={(e) => setEditForm({ ...editForm, amenities: e.target.value.split("\n").filter(Boolean) })}
                  className="w-full resize-none rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white focus:border-[#c9a961]/40 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#c9a961] py-2 text-xs font-semibold text-[#17181a] hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="size-3.5" />
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button onClick={cancelEdit} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 hover:border-white/20">
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white/85">{room.name}</p>
                  <p className="mt-0.5 text-sm text-[#c9a961]">{formatNaira(room.price_per_night)} / night</p>
                </div>
                {room.badge && (
                  <span className="shrink-0 rounded-full bg-[#c9a961]/15 px-2 py-0.5 text-[10px] font-medium text-[#c9a961]">
                    {room.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-white/35">
                {room.max_guests} guest{room.max_guests !== 1 ? "s" : ""} · {room.bed_type}
                {room.room_size_sqm ? ` · ${room.room_size_sqm} m²` : ""}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => startEdit(room)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs text-white/55 hover:border-white/20 hover:text-white/80 transition-colors"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(room.id, room.is_active)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors ${
                    room.is_active
                      ? "border-red-500/20 text-red-400/60 hover:border-red-500/40 hover:text-red-400"
                      : "border-emerald-500/20 text-emerald-400/60 hover:border-emerald-500/40 hover:text-emerald-400"
                  }`}
                >
                  {room.is_active ? <PowerOff className="size-3.5" /> : <Power className="size-3.5" />}
                  {room.is_active ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] text-white/40">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white focus:border-[#c9a961]/40 focus:outline-none"
      />
    </div>
  );
}
