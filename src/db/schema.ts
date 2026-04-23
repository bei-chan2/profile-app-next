import { sql } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const appRoleEnum = pgEnum("app_role", ["admin", "member"]);
export const userStatusEnum = pgEnum("user_status", ["active", "suspended", "invited"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: appRoleEnum("role").notNull().default("member"),
  status: userStatusEnum("status").notNull().default("active"),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  suspendedAt: timestamp("suspended_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: text("profile_id").notNull(),
  title: text("title").notNull(),
  note: text("note").notNull().default(""),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  imagePath: text("image_path"),
  role: text("role").notNull(),
  age: text("age").notNull(),
  catchCopy: text("catch_copy").notNull(),
  about: text("about").array().notNull(),
  tags: text("tags").array().notNull(),
  specialties: text("specialties").array(),
  hobbies: text("hobbies").array(),
  credentials: text("credentials").array(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export type DbProfile = typeof profiles.$inferSelect;
export type NewDbProfile = typeof profiles.$inferInsert;
