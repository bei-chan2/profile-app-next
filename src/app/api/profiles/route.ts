import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getProfiles } from "@/features/profile/profile-service";

export async function GET() {
  const items = await getProfiles();
  return NextResponse.json(items);
}

const createProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  imagePath: z.string().optional(),
  role: z.string().min(1),
  age: z.string().min(1),
  catchCopy: z.string().min(1),
  about: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  specialties: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  credentials: z.array(z.string()).optional(),
});

function makeProfileId(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || `profile-${Date.now()}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const { id, name, ...rest } = parsed.data;
  const profileId = id?.trim() || makeProfileId(name);

  const existing = await db
    .select({ sortOrder: profiles.sortOrder })
    .from(profiles)
    .orderBy(asc(profiles.sortOrder));
  const nextSortOrder =
    existing.length > 0 ? Math.max(...existing.map((p) => p.sortOrder)) + 1 : 0;

  const [inserted] = await db
    .insert(profiles)
    .values({ id: profileId, name, ...rest, sortOrder: nextSortOrder })
    .returning();

  return NextResponse.json(
    {
      id: inserted.id,
      name: inserted.name,
      imagePath: inserted.imagePath ?? undefined,
      role: inserted.role,
      age: inserted.age,
      catchCopy: inserted.catchCopy,
      about: inserted.about,
      tags: inserted.tags,
      specialties: inserted.specialties ?? undefined,
      hobbies: inserted.hobbies ?? undefined,
      credentials: inserted.credentials ?? undefined,
    },
    { status: 201 },
  );
}
