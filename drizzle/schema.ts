import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Pipeline Table ──────────────────────────────────────────────────────────
export const pipeline = mysqlTable("pipeline", {
  id: int("id").autoincrement().primaryKey(),
  address: varchar("address", { length: 255 }).notNull(),
  hamlet: varchar("hamlet", { length: 64 }).notNull(),
  type: varchar("type", { length: 64 }).notNull().default('Listing'),
  status: varchar("status", { length: 64 }).notNull().default('Prospect'),
  askPrice: varchar("askPrice", { length: 32 }).default(''),
  dom: int("dom").default(0),
  notes: text("notes").default(''),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineEntry = typeof pipeline.$inferSelect;
export type InsertPipelineEntry = typeof pipeline.$inferInsert;

// ─── Listings Table (MAPS tab — Sprint 41 DB persistence) ───────────────────
// NOTE: Column names match the existing DB table (camelCase, from prior migration)
export const listings = mysqlTable('listings', {
  id:           int('id').autoincrement().primaryKey(),
  address:      varchar('address', { length: 255 }).notNull(),
  price:        varchar('price', { length: 64 }).notNull().default(''),
  hamlet:       varchar('hamlet', { length: 64 }).notNull().default('East Hampton North'),
  url:          text('url').notNull(),
  imageUrl:     text('imageUrl'),
  beds:         varchar('beds', { length: 16 }),
  baths:        varchar('baths', { length: 16 }),
  sqft:         varchar('sqft', { length: 32 }),
  status:       varchar('status', { length: 32 }).notNull().default('Active'),
  syncedAt:     timestamp('syncedAt').defaultNow().notNull(),
  createdAt:    timestamp('createdAt').defaultNow().notNull(),
  updatedAt:    timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof listings.$inferInsert;