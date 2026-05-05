import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

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
