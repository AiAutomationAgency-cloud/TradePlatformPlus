import { 
  users, 
  stockAnalysis, 
  chatConversations, 
  chatMessages, 
  patternDetections, 
  userPreferences,
  type User, 
  type InsertUser,
  type StockAnalysis,
  type InsertStockAnalysis,
  type ChatConversation,
  type InsertChatConversation,
  type ChatMessage,
  type InsertChatMessage,
  type PatternDetection,
  type InsertPatternDetection,
  type UserPreferences,
  type InsertUserPreferences
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Stock analysis operations
  createStockAnalysis(analysis: InsertStockAnalysis): Promise<StockAnalysis>;
  getStockAnalysisByUser(userId: number): Promise<StockAnalysis[]>;
  getStockAnalysisBySymbol(symbol: string, userId: number): Promise<StockAnalysis[]>;
  
  // Chat operations
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatConversationsByUser(userId: number): Promise<ChatConversation[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByConversation(conversationId: number): Promise<ChatMessage[]>;
  
  // Pattern detection operations
  createPatternDetection(detection: InsertPatternDetection): Promise<PatternDetection>;
  getPatternDetectionsByUser(userId: number): Promise<PatternDetection[]>;
  
  // User preferences operations
  createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Stock analysis operations
  async createStockAnalysis(analysis: InsertStockAnalysis): Promise<StockAnalysis> {
    const [result] = await db
      .insert(stockAnalysis)
      .values(analysis)
      .returning();
    return result;
  }

  async getStockAnalysisByUser(userId: number): Promise<StockAnalysis[]> {
    return await db
      .select()
      .from(stockAnalysis)
      .where(eq(stockAnalysis.userId, userId))
      .orderBy(desc(stockAnalysis.createdAt));
  }

  async getStockAnalysisBySymbol(symbol: string, userId: number): Promise<StockAnalysis[]> {
    return await db
      .select()
      .from(stockAnalysis)
      .where(and(eq(stockAnalysis.symbol, symbol), eq(stockAnalysis.userId, userId)))
      .orderBy(desc(stockAnalysis.createdAt));
  }

  // Chat operations
  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const [result] = await db
      .insert(chatConversations)
      .values(conversation)
      .returning();
    return result;
  }

  async getChatConversationsByUser(userId: number): Promise<ChatConversation[]> {
    return await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.updatedAt));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [result] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return result;
  }

  async getChatMessagesByConversation(conversationId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);
  }

  // Pattern detection operations
  async createPatternDetection(detection: InsertPatternDetection): Promise<PatternDetection> {
    const [result] = await db
      .insert(patternDetections)
      .values(detection)
      .returning();
    return result;
  }

  async getPatternDetectionsByUser(userId: number): Promise<PatternDetection[]> {
    return await db
      .select()
      .from(patternDetections)
      .where(eq(patternDetections.userId, userId))
      .orderBy(desc(patternDetections.createdAt));
  }

  // User preferences operations
  async createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(preferences.userId!);
    
    if (existing) {
      const [result] = await db
        .update(userPreferences)
        .set({ ...preferences, updatedAt: new Date() })
        .where(eq(userPreferences.userId, preferences.userId!))
        .returning();
      return result;
    } else {
      const [result] = await db
        .insert(userPreferences)
        .values(preferences)
        .returning();
      return result;
    }
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return prefs || undefined;
  }
}

export const storage = new DatabaseStorage();
