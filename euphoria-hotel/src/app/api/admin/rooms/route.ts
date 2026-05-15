import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";
import { rooms } from "@/lib/data/rooms";

const createRoomSchema = z.object({
  name: z.string().min(2),
  shortName: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  pricePerNight: z.number().positive(),
  maxGuests: z.number().int().min(1),
  bedType: z.string().optional(),
  roomSizeSqm: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  badge: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

export async function GET() {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      rooms.map((room) => ({
        id: room.slug,
        name: room.name,
        slug: room.slug,
        short_name: room.shortName,
        description: room.description,
        short_description: room.tagline,
        price_per_night: room.pricePerNight,
        max_guests: room.maxGuests,
        bed_type: room.bedType,
        room_size_sqm: room.roomSizeSqm,
        thumbnail_url: room.thumbnail,
        gallery_urls: room.gallery,
        amenities: room.amenities,
        badge: room.badge ?? null,
        is_active: true,
        display_order: room.displayOrder,
      }))
    );
  }

  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("rooms")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      { error: "Demo mode uses the seeded room catalogue. Connect Supabase to persist new rooms." },
      { status: 503 }
    );
  }

  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = createRoomSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const d = parsed.data;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("rooms")
    .insert({
      name: d.name,
      short_name: d.shortName,
      slug: d.slug,
      description: d.description,
      price_per_night: d.pricePerNight,
      max_guests: d.maxGuests,
      bed_type: d.bedType,
      room_size_sqm: d.roomSizeSqm,
      amenities: d.amenities,
      badge: d.badge,
      display_order: d.displayOrder,
      is_active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
