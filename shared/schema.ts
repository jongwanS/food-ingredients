import { pgTable, text, serial, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base tables for the User schema (keep for reference)
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

// Food Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameKorean: text("name_korean").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  nameKorean: true,
  imageUrl: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Franchises
export const franchises = pgTable("franchises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull(),
  logoUrl: text("logo_url").notNull(),
});

export const insertFranchiseSchema = createInsertSchema(franchises).pick({
  name: true,
  categoryId: true,
  logoUrl: true,
});

export type InsertFranchise = z.infer<typeof insertFranchiseSchema>;
export type Franchise = typeof franchises.$inferSelect;

// Allergens
export const allergens = pgTable("allergens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameKorean: text("name_korean").notNull(),
});

export const insertAllergenSchema = createInsertSchema(allergens).pick({
  name: true,
  nameKorean: true,
});

export type InsertAllergen = z.infer<typeof insertAllergenSchema>;
export type Allergen = typeof allergens.$inferSelect;

// Food Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  franchiseId: integer("franchise_id").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(),
  carbs: integer("carbs").notNull(),
  fat: integer("fat").notNull(),
  saturatedFat: integer("saturated_fat"),
  transFat: integer("trans_fat"),
  cholesterol: integer("cholesterol"),
  sodium: integer("sodium"),
  fiber: integer("fiber"),
  sugar: integer("sugar"),
  calcium: integer("calcium"),
  iron: integer("iron"),
  vitaminD: integer("vitamin_d"),
  allergens: json("allergens").$type<number[]>().default([]),
  featuredProduct: boolean("featured_product").default(false),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  franchiseId: true,
  description: true,
  imageUrl: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  saturatedFat: true,
  transFat: true,
  cholesterol: true,
  sodium: true,
  fiber: true,
  sugar: true,
  calcium: true,
  iron: true,
  vitaminD: true,
  allergens: true,
  featuredProduct: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Product search schema for API requests
export const productSearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.number().optional(),
  franchiseId: z.number().optional(),
  minCalories: z.number().optional(),
  maxCalories: z.number().optional(),
  minProtein: z.number().optional(),
  maxProtein: z.number().optional(),
  minCarbs: z.number().optional(),
  maxCarbs: z.number().optional(),
  minFat: z.number().optional(),
  maxFat: z.number().optional(),
});

export type ProductSearchParams = z.infer<typeof productSearchSchema>;
