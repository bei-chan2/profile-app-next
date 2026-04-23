import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { profiles } from "@/db/schema";

const updateProfileSchema = z
  .object({
    name: z.string().min(1).optional(),
    imagePath: z.string().optional(),
    role: z.string().optional(),
    age: z.string().optional(),
    catchCopy: z.string().optional(),
    about: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    specialties: z.array(z.string()).optional(),
    hobbies: z.array(z.string()).optional(),
    credentials: z.array(z.string()).optional(),
  })
  .refine((v) => Object.values(v).some((val) => val !== undefined), {
    message: "at least one field is required",
  });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const [updated] = await db
    .update(profiles)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(profiles.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    imagePath: updated.imagePath ?? undefined,
    role: updated.role,
    age: updated.age,
    catchCopy: updated.catchCopy,
    about: updated.about,
    tags: updated.tags,
    specialties: updated.specialties ?? undefined,
    hobbies: updated.hobbies ?? undefined,
    credentials: updated.credentials ?? undefined,
  });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [deleted] = await db.delete(profiles).where(eq(profiles.id, id)).returning({ id: profiles.id });

  if (!deleted) {
    return NextResponse.json({ error: "profile not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
