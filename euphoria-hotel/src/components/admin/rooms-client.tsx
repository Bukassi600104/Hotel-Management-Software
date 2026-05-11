"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Power, PowerOff, X, Save, Plus, Trash2, AlertTriangle } from "lucide-react";
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

type NewRoomForm = {
  name: string;
  short_name: string;
  description: string;
  price_per_night: string;
  max_guests: string;
  bed_type: string;
  room_size_sqm: string;
  amenities: string;
  badge: string;
  display_order: string;
};

const emptyNewRoom: NewRoomForm = {
  name: "",
  short_name: "",
  description: "",
  price_per_night: "",
  max_guests: "",
  bed_type: "",
  room_size_sqm: "",
  amenities: "",
  badge: "",
  display_order: "",
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function RoomsClient() {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<Room>>({});
  const [saving, setSaving] = React.useState(false);

  // Create room
  const [showCreate, setShowCreate] = React.useState(false);
  const [newRoom, setNewRoom] = React.useState<NewRoomForm>(emptyNewRoom);
  const [creating, setCreating] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);

  // Delete room
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

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
    const newState = currentlyActive === false ? true : false;
    await fetch(`/api/admin/rooms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: newState }),
    });
    await load();
  }

  async function createRoom() {
    setCreateError(null);
    if (!newRoom.name || !newRoom.price_per_night || !newRoom.max_guests) {
      setCreateError("Name, price per night, and max guests are required.");
      return;
    }
    setCreating(true);
    const res = await fetch("/api/admin/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newRoom.name,
        shortName: newRoom.short_name || newRoom.name,
        slug: slugify(newRoom.name),
        description: newRoom.description || undefined,
        pricePerNight: Number(newRoom.price_per_night),
        maxGuests: Number(newRoom.max_guests),
        bedType: newRoom.bed_type || undefined,
        roomSizeSqm: newRoom.room_size_sqm ? Number(newRoom.room_size_sqm) : undefined,
        amenities: newRoom.amenities ? newRoom.amenities.split("\n").filter(Boolean) : [],
        badge: newRoom.badge || undefined,
        displayOrder: newRoom.display_order ? Number(newRoom.display_order) : undefined,
      }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setCreateError(data.error ?? "Failed to create room.");
    } else {
      setShowCreate(false);
      setNewRoom(emptyNewRoom);
      await load();
    }
  }

  async function deleteRoom() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/rooms/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
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
    <>
      {/* Header with Add Room button */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-white/40">{rooms.length} room{rooms.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-[#c9a961] px-4 py-2 text-xs font-semibold text-[#17181a] hover:opacity-90 transition-opacity"
        >
          <Plus className="size-3.5" />
          Add room
        </button>
      </div>

      {/* Create room modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111316] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Add new room</h3>
              <button onClick={() => { setShowCreate(false); setCreateError(null); setNewRoom(emptyNewRoom); }} className="text-white/40 hover:text-white/80">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              <CreateField label="Room name *" value={newRoom.name} onChange={(v) => setNewRoom({ ...newRoom, name: v })} placeholder="e.g. Executive Suite" />
              <CreateField label="Short name *" value={newRoom.short_name} onChange={(v) => setNewRoom({ ...newRoom, short_name: v })} placeholder="e.g. Executive" />
              <CreateField label="Price per night (₦) *" type="number" value={newRoom.price_per_night} onChange={(v) => setNewRoom({ ...newRoom, price_per_night: v })} placeholder="e.g. 80000" />
              <CreateField label="Max guests *" type="number" value={newRoom.max_guests} onChange={(v) => setNewRoom({ ...newRoom, max_guests: v })} placeholder="e.g. 2" />
              <CreateField label="Bed type" value={newRoom.bed_type} onChange={(v) => setNewRoom({ ...newRoom, bed_type: v })} placeholder="e.g. King Bed" />
              <CreateField label="Room size (sqm)" type="number" value={newRoom.room_size_sqm} onChange={(v) => setNewRoom({ ...newRoom, room_size_sqm: v })} placeholder="e.g. 45" />
              <CreateField label="Badge" value={newRoom.badge} onChange={(v) => setNewRoom({ ...newRoom, badge: v })} placeholder="e.g. Most Popular" />
              <CreateField label="Display order" type="number" value={newRoom.display_order} onChange={(v) => setNewRoom({ ...newRoom, display_order: v })} placeholder="e.g. 1" />
              <div>
                <label className="mb-1 block text-[10px] text-white/40">Description</label>
                <textarea
                  rows={3}
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                  placeholder="Room description…"
                  className="w-full resize-none rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white focus:border-[#c9a961]/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-white/40">Amenities (one per line)</label>
                <textarea
                  rows={4}
                  value={newRoom.amenities}
                  onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                  placeholder={"Free Wi-Fi\nAir conditioning\nFlat-screen TV\nMini bar"}
                  className="w-full resize-none rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white focus:border-[#c9a961]/40 focus:outline-none"
                />
              </div>
            </div>

            {createError && (
              <div className="mt-3 flex gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                {createError}
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={createRoom}
                disabled={creating}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#c9a961] py-2.5 text-xs font-semibold text-[#17181a] hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="size-3.5" />
                {creating ? "Creating…" : "Create room"}
              </button>
              <button
                onClick={() => { setShowCreate(false); setCreateError(null); setNewRoom(emptyNewRoom); }}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-white/50 hover:border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#111316] border border-white/10 p-6">
            <div className="mx-auto mb-4 inline-grid size-12 place-items-center rounded-full bg-red-500/15 text-red-400">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-base font-semibold text-white text-center">Deactivate room?</h3>
            <p className="mt-2 text-sm text-white/50 text-center">
              This room will be hidden from guests and marked inactive. Existing bookings are not affected. You can reactivate it anytime.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={deleteRoom}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? "Deactivating…" : "Yes, deactivate"}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-white/50 hover:border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit room modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111316] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Edit room</h3>
              <button onClick={cancelEdit} className="text-white/40 hover:text-white/80">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
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
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#c9a961] py-2.5 text-xs font-semibold text-[#17181a] hover:opacity-90 disabled:opacity-50"
              >
                <Save className="size-3.5" />
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                onClick={cancelEdit}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-white/50 hover:border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room cards */}
      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`rounded-xl border bg-white/3 overflow-hidden ${
              room.is_active ? "border-white/8" : "border-white/4 opacity-60"
            }`}
          >
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
                    room.is_active !== false
                      ? "border-amber-500/20 text-amber-400/60 hover:border-amber-500/40 hover:text-amber-400"
                      : "border-emerald-500/20 text-emerald-400/60 hover:border-emerald-500/40 hover:text-emerald-400"
                  }`}
                >
                  {room.is_active !== false ? <PowerOff className="size-3.5" /> : <Power className="size-3.5" />}
                  {room.is_active !== false ? "Deactivate" : "Reactivate"}
                </button>
                <button
                  onClick={() => setDeleteId(room.id)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400/60 hover:border-red-500/40 hover:text-red-400 transition-colors"
                  title="Remove room"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {rooms.length === 0 && (
          <div className="col-span-full rounded-xl border border-white/8 bg-white/3 p-12 text-center">
            <p className="text-sm text-white/30">No rooms yet. Click &quot;Add room&quot; to create the first one.</p>
          </div>
        )}
      </div>
    </>
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

function CreateField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] text-white/40">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-[#c9a961]/40 focus:outline-none"
      />
    </div>
  );
}
