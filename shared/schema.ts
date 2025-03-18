import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
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

// Game schemas
export const gameSaves = pgTable("game_saves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  saveData: jsonb("save_data").notNull(),
  createdAt: text("created_at").notNull(),
  name: text("name").notNull(),
});

export const insertGameSaveSchema = createInsertSchema(gameSaves).pick({
  userId: true,
  saveData: true,
  createdAt: true,
  name: true,
});

export type InsertGameSave = z.infer<typeof insertGameSaveSchema>;
export type GameSave = typeof gameSaves.$inferSelect;

// Game state schema for validating save data
export const playerSchema = z.object({
  name: z.string(),
  origin: z.string(),
  attributes: z.object({
    quantum: z.number().min(10).max(100),
    temporal: z.number().min(10).max(100),
    pattern: z.number().min(10).max(100),
  }),
  energy: z.number().min(0).max(100),
  knowledge: z.number().min(0).max(100),
  paradox: z.number().min(0).max(100),
});

export const inventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  description: z.string().optional(),
});

export const codexEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  discovered: z.string(),
  excerpt: z.string(),
  content: z.string(),
});

export const narrativeSceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  prompt: z.string(),
});

export const narrativeChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  description: z.string(),
  nextSceneId: z.string(),
  requiredItems: z.array(z.string()).optional(),
  requiredAttributes: z.record(z.string(), z.number()).optional(),
  effects: z.record(z.string(), z.number()).optional(),
});

export const gameStateSchema = z.object({
  currentScreen: z.string(),
  player: playerSchema,
  inventory: z.array(inventoryItemSchema),
  codexEntries: z.array(codexEntrySchema),
  narrative: z.object({
    currentScene: narrativeSceneSchema,
    visitedScenes: z.array(z.string()),
    unlockedChoices: z.array(z.string()),
  }),
  location: z.object({
    name: z.string(),
  }),
  game: z.object({
    cycle: z.string(),
    audioEnabled: z.boolean(),
  }),
});

export type GameState = z.infer<typeof gameStateSchema>;
