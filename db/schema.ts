// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const savedGuides = sqliteTable("oauth_guides", {
 id: text("id").primaryKey(),
 content: text("content").notNull(),
 createdAt: text("created_at").notNull(),
});
export const researchLimits = sqliteTable("research_limits", {
 key: text("key").primaryKey(),
 count: integer("count").notNull().default(0),
});
