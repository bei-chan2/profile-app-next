import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { todos } from "@/db/schema";

const createTodoSchema = z.object({
  profileId: z.string().min(1),
  title: z.string().min(1),
  note: z.string().optional().default(""),
  completed: z.boolean().optional().default(false),
  createdAt: z.string().optional(),
});

function toDateString(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return new Date(value).toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get("profileId");
  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  const items = await db
    .select()
    .from(todos)
    .where(eq(todos.profileId, profileId))
    .orderBy(asc(todos.createdAt), asc(todos.id));

  return NextResponse.json(
    items.map((item) => ({
      id: item.id,
      title: item.title,
      note: item.note,
      completed: item.completed,
      createdAt: toDateString(item.createdAt),
    })),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createTodoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const { profileId, title, note, completed, createdAt } = parsed.data;
  const createdAtDate = createdAt ? new Date(`${createdAt}T00:00:00.000Z`) : new Date();

  const [inserted] = await db
    .insert(todos)
    .values({
      profileId,
      title,
      note,
      completed,
      createdAt: createdAtDate,
      updatedAt: new Date(),
    })
    .returning();

  return NextResponse.json(
    {
      id: inserted.id,
      title: inserted.title,
      note: inserted.note,
      completed: inserted.completed,
      createdAt: toDateString(inserted.createdAt),
    },
    { status: 201 },
  );
}
