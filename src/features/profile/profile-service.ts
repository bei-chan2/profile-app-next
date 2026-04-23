import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles as profilesTable, todos } from "@/db/schema";
import { profiles as staticProfiles, type Profile } from "@/features/profile/profile-data";

function dbRowToProfile(row: typeof profilesTable.$inferSelect): Profile {
  return {
    id: row.id,
    name: row.name,
    imagePath: row.imagePath ?? undefined,
    role: row.role,
    age: row.age,
    catchCopy: row.catchCopy,
    about: row.about,
    tags: row.tags,
    specialties: row.specialties ?? undefined,
    hobbies: row.hobbies ?? undefined,
    credentials: row.credentials ?? undefined,
  };
}

async function ensureProfilesSeeded() {
  const existing = await db.select({ id: profilesTable.id }).from(profilesTable).limit(1);
  if (existing.length > 0) return;

  for (const [index, profile] of staticProfiles.entries()) {
    await db.insert(profilesTable).values({
      id: profile.id,
      name: profile.name,
      imagePath: profile.imagePath,
      role: profile.role,
      age: profile.age,
      catchCopy: profile.catchCopy,
      about: profile.about,
      tags: profile.tags,
      specialties: profile.specialties,
      hobbies: profile.hobbies,
      credentials: profile.credentials,
      sortOrder: index,
    });

    if (profile.todoDefaults) {
      for (const todo of profile.todoDefaults) {
        await db.insert(todos).values({
          profileId: profile.id,
          title: todo.title,
          note: todo.note ?? "",
          completed: todo.completed ?? false,
          createdAt: new Date(`${todo.createdAt}T00:00:00.000Z`),
          updatedAt: new Date(),
        });
      }
    }
  }
}

export async function getProfiles(): Promise<Profile[]> {
  await ensureProfilesSeeded();
  const rows = await db
    .select()
    .from(profilesTable)
    .orderBy(asc(profilesTable.sortOrder), asc(profilesTable.createdAt));
  return rows.map(dbRowToProfile);
}

export async function getProfile(id: string): Promise<Profile | null> {
  await ensureProfilesSeeded();
  const [row] = await db.select().from(profilesTable).where(eq(profilesTable.id, id)).limit(1);
  return row ? dbRowToProfile(row) : null;
}
