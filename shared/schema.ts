import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table with premium features
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isPremium: boolean("is_premium").default(false),
  premiumUntil: timestamp("premium_until"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  apiUsageCount: integer("api_usage_count").default(0),
  dailyUsageLimit: integer("daily_usage_limit").default(10),
  lastUsageReset: timestamp("last_usage_reset").defaultNow(),
  extensionInstalled: boolean("extension_installed").default(false),
  preferredBroker: text("preferred_broker"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stock analysis results
export const stockAnalysis = pgTable("stock_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  symbol: text("symbol").notNull(),
  platform: text("platform").notNull(), // zerodha, groww, angelone
  analysisType: text("analysis_type").notNull(), // pattern, technical, ai
  data: jsonb("data").notNull(),
  confidence: integer("confidence"),
  recommendation: text("recommendation"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat conversations
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => chatConversations.id),
  role: text("role").notNull(), // user, assistant
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pattern detection results
export const patternDetections = pgTable("pattern_detections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  symbol: text("symbol").notNull(),
  patternType: text("pattern_type").notNull(),
  confidence: integer("confidence").notNull(),
  data: jsonb("data").notNull(),
  timeframe: text("timeframe"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  theme: text("theme").default("dark"),
  notifications: boolean("notifications").default(true),
  alertThreshold: integer("alert_threshold").default(80),
  preferredTimeframe: text("preferred_timeframe").default("1d"),
  autoAnalysis: boolean("auto_analysis").default(true),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  stockAnalysis: many(stockAnalysis),
  chatConversations: many(chatConversations),
  patternDetections: many(patternDetections),
  preferences: one(userPreferences),
}));

export const stockAnalysisRelations = relations(stockAnalysis, ({ one }) => ({
  user: one(users, { fields: [stockAnalysis.userId], references: [users.id] }),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  user: one(users, { fields: [chatConversations.userId], references: [users.id] }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, { fields: [chatMessages.conversationId], references: [chatConversations.id] }),
}));

export const patternDetectionsRelations = relations(patternDetections, ({ one }) => ({
  user: one(users, { fields: [patternDetections.userId], references: [users.id] }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, { fields: [userPreferences.userId], references: [users.id] }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const loginSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStockAnalysisSchema = createInsertSchema(stockAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertPatternDetectionSchema = createInsertSchema(patternDetections).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type StockAnalysis = typeof stockAnalysis.$inferSelect;
export type InsertStockAnalysis = z.infer<typeof insertStockAnalysisSchema>;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type PatternDetection = typeof patternDetections.$inferSelect;
export type InsertPatternDetection = z.infer<typeof insertPatternDetectionSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
