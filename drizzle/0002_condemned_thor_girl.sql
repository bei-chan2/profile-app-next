CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_path" text,
	"role" text NOT NULL,
	"age" text NOT NULL,
	"catch_copy" text NOT NULL,
	"about" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"specialties" text[],
	"hobbies" text[],
	"credentials" text[],
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
