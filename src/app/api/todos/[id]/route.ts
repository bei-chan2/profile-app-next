import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { todos } from "@/db/schema";

const updateTodoSchema = z
  .object({
    title: z.string().min(1).optional(),
    note: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .refine((value) => value.title !== undefined || value.note !== undefined || value.completed !== undefined, {
    message: "at least one field is required",
  });

function toDateString(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return new Date(value).toISOString().slice(0, 10);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateTodoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const [updated] = await db
    .update(todos)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(todos.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "todo not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: updated.id,
    title: updated.title,
    note: updated.note,
    completed: updated.completed,
    createdAt: toDateString(updated.createdAt),
  });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [deleted] = await db.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id });

  if (!deleted) {
    return NextResponse.json({ error: "todo not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
