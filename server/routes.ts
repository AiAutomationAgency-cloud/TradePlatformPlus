import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { 
  insertUserSchema, 
  loginSchema, 
  insertChatConversationSchema, 
  insertChatMessageSchema, 
  insertStockAnalysisSchema,
  insertPatternDetectionSchema,
  insertUserPreferencesSchema 
} from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Initialize Gemini AI with proper error handling
let model: any = null;
try {
  const genAI = new GoogleGenAI(process.env.GOOGLE_GEMINI_API_KEY!);
  model = genAI.generativeModel({ model: "gemini-2.0-flash-exp" });
} catch (error) {
  console.log("Gemini AI initialization failed, using fallback responses");
}

// Session configuration
const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
const pgStore = connectPg(session);

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Premium middleware
const requirePremium = async (req: any, res: any, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user?.isPremium || (user.premiumUntil && new Date() > user.premiumUntil)) {
    return res.status(403).json({ message: "Premium subscription required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || 'stocksense-secret-key-2025',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  }));

  // Serve the test page for extension testing
  app.get("/test-page.html", (req, res) => {
    res.sendFile(path.resolve("test-page.html"));
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      if (validatedData.email) {
        const existingEmail = await storage.getUserByEmail(validatedData.email);
        if (existingEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Create session
      (req.session as any).userId = user.id;
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      (req.session as any).userId = user.id;
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser((req.session as any).userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Chat routes
  app.post("/api/chat/send", requireAuth, async (req, res) => {
    try {
      const { message, symbol, context } = req.body;
      const userId = (req.session as any).userId;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Check usage limits for non-premium users
      const user = await storage.getUser(userId);
      if (!user?.isPremium && user && user.apiUsageCount >= user.dailyUsageLimit) {
        return res.status(429).json({ 
          message: "Daily usage limit reached. Upgrade to Premium for unlimited access.",
          upgradeRequired: true 
        });
      }

      // Generate AI response
      let aiResponse = "I'm here to help with your trading questions! However, I need access to the Gemini AI service to provide detailed analysis.";
      let metadata = {
        type: "general",
        confidence: 0.5
      };

      if (model) {
        try {
          const prompt = `You are StockSense AI, an expert stock market analyst. 
          
          User message: "${message}"
          Stock symbol: ${symbol || "General"}
          Context: ${context || "web_app"}
          
          Provide helpful, accurate trading insights. Focus on:
          - Technical analysis and pattern recognition
          - Risk management advice  
          - Market trends and indicators
          - Educational content about trading
          
          Format your response as helpful advice. Always include appropriate risk disclaimers.
          
          If the message is about specific patterns, mention confidence levels.
          If it's about recommendations, be clear about timeframes and risk levels.`;

          const result = await model.generateContent(prompt);
          aiResponse = result.response.text();
          
          // Determine response type based on content
          if (message.toLowerCase().includes('pattern')) metadata.type = 'pattern';
          else if (message.toLowerCase().includes('buy') || message.toLowerCase().includes('sell')) metadata.type = 'recommendation';  
          else if (message.toLowerCase().includes('analysis')) metadata.type = 'analysis';
          else if (message.toLowerCase().includes('learn') || message.toLowerCase().includes('explain')) metadata.type = 'explanation';
          
          metadata.confidence = 0.85;
        } catch (error) {
          console.error("Gemini API error:", error);
          aiResponse = `I understand you're asking about ${symbol || 'trading'}. While I can't access live AI analysis right now, here are some general insights:

For pattern analysis: Look for confirmation signals and volume patterns.
For recommendations: Always consider your risk tolerance and diversification.
For learning: Start with basic chart patterns like support/resistance levels.

Please ensure you have proper API access configured for detailed AI analysis.`;
        }
      }

      // Update user API usage
      if (user && !user.isPremium) {
        await storage.updateUser(userId, { 
          apiUsageCount: user.apiUsageCount + 1 
        });
      }

      res.json({ 
        response: aiResponse,
        metadata,
        usage: user ? {
          current: user.apiUsageCount + 1,
          limit: user.dailyUsageLimit,
          isPremium: user.isPremium
        } : null
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/chat/conversations", requireAuth, async (req, res) => {
    try {
      const validatedData = insertChatConversationSchema.parse({
        ...req.body,
        userId: (req.session as any).userId,
      });
      
      const conversation = await storage.createChatConversation(validatedData);
      res.status(201).json({ conversation });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/chat/conversations", requireAuth, async (req, res) => {
    try {
      const conversations = await storage.getChatConversationsByUser((req.session as any).userId);
      res.json({ conversations });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/chat/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      // Save user message
      const userMessage = await storage.createChatMessage({
        conversationId,
        role: "user",
        content,
      });

      // Generate AI response
      try {
        const prompt = `You are StockSense AI, an expert stock market analyst. The user is asking: "${content}". 
        
        Provide helpful, accurate trading insights. Focus on:
        - Technical analysis and pattern recognition
        - Risk management advice
        - Market trends and indicators
        - Educational content about trading

        Keep responses concise but informative. Always include risk disclaimers for trading advice.`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        // Save AI response
        const assistantMessage = await storage.createChatMessage({
          conversationId,
          role: "assistant",
          content: aiResponse,
        });

        res.json({ userMessage, assistantMessage });
      } catch (aiError) {
        console.error("AI Error:", aiError);
        
        // Fallback response if AI fails
        const fallbackMessage = await storage.createChatMessage({
          conversationId,
          role: "assistant",
          content: "I'm currently experiencing technical difficulties. Please try again in a moment. In the meantime, remember to always do your own research before making investment decisions.",
        });

        res.json({ userMessage, assistantMessage: fallbackMessage });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/chat/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getChatMessagesByConversation(conversationId);
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stock analysis routes
  app.post("/api/analysis/stock", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser((req.session as any).userId);
      
      // Check usage limits for non-premium users
      if (!user?.isPremium) {
        if (user && user.apiUsageCount >= user.dailyUsageLimit) {
          return res.status(429).json({ 
            message: "Daily usage limit reached. Upgrade to premium for unlimited analysis.",
            requiresPremium: true 
          });
        }
      }

      const validatedData = insertStockAnalysisSchema.parse({
        ...req.body,
        userId: (req.session as any).userId,
      });

      // Perform AI analysis
      const stockData = validatedData.data;
      const analysisPrompt = `Analyze this stock data for ${validatedData.symbol} on ${validatedData.platform}:
      
      Data: ${JSON.stringify(stockData)}
      
      Provide analysis including:
      1. Technical indicators interpretation
      2. Pattern recognition results
      3. Risk assessment
      4. Trading recommendation (Buy/Hold/Sell)
      5. Confidence score (1-100)
      
      Return response in JSON format with fields: analysis, recommendation, confidence, riskLevel, keyPoints.`;

      try {
        const result = await model.generateContent(analysisPrompt);
        const aiAnalysis = result.response.text();
        
        // Try to parse AI response as JSON, fallback to text
        let parsedAnalysis;
        try {
          parsedAnalysis = JSON.parse(aiAnalysis);
        } catch {
          parsedAnalysis = {
            analysis: aiAnalysis,
            recommendation: "HOLD",
            confidence: 75,
            riskLevel: "Medium",
            keyPoints: ["Analysis completed", "Review detailed insights"]
          };
        }

        const analysis = await storage.createStockAnalysis({
          ...validatedData,
          data: { ...stockData, aiAnalysis: parsedAnalysis },
          confidence: parsedAnalysis.confidence || 75,
          recommendation: parsedAnalysis.recommendation || "HOLD",
        });

        // Update usage count for non-premium users
        if (!user?.isPremium && user) {
          await storage.updateUser(user.id, {
            apiUsageCount: user.apiUsageCount + 1,
          });
        }

        res.status(201).json({ analysis });
      } catch (aiError) {
        console.error("AI Analysis Error:", aiError);
        
        // Fallback analysis
        const analysis = await storage.createStockAnalysis({
          ...validatedData,
          confidence: 50,
          recommendation: "HOLD",
        });

        res.status(201).json({ 
          analysis,
          warning: "AI analysis temporarily unavailable. Basic analysis saved."
        });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/analysis/stock", requireAuth, async (req, res) => {
    try {
      const analyses = await storage.getStockAnalysisByUser((req.session as any).userId);
      res.json({ analyses });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analysis/stock/:symbol", requireAuth, async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const analyses = await storage.getStockAnalysisBySymbol(symbol, (req.session as any).userId);
      res.json({ analyses });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pattern detection routes
  app.post("/api/patterns/detect", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPatternDetectionSchema.parse({
        ...req.body,
        userId: (req.session as any).userId,
      });

      const detection = await storage.createPatternDetection(validatedData);
      res.status(201).json({ detection });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/patterns", requireAuth, async (req, res) => {
    try {
      const patterns = await storage.getPatternDetectionsByUser((req.session as any).userId);
      res.json({ patterns });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User preferences routes
  app.get("/api/preferences", requireAuth, async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences((req.session as any).userId);
      res.json({ preferences });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/preferences", requireAuth, async (req, res) => {
    try {
      const validatedData = insertUserPreferencesSchema.parse({
        ...req.body,
        userId: (req.session as any).userId,
      });

      const preferences = await storage.createOrUpdateUserPreferences(validatedData);
      res.json({ preferences });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Premium upgrade route
  app.post("/api/premium/upgrade", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const premiumUntil = new Date();
      premiumUntil.setFullYear(premiumUntil.getFullYear() + 1); // 1 year premium

      const user = await storage.updateUser(userId, {
        isPremium: true,
        premiumUntil,
        dailyUsageLimit: 1000, // High limit for premium users
      });

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Extension status and installation
  app.get("/api/extension/status", (req, res) => {
    res.json({ 
      status: "ready", 
      features: [
        "AI-Powered Stock Analysis",
        "Real-time Pattern Detection", 
        "Multi-Platform Support (Zerodha, Groww, AngelOne)",
        "Interactive Chat Assistant",
        "Technical Indicators",
        "Premium Analytics"
      ],
      version: "2.0.0",
      supportedPlatforms: ["zerodha", "groww", "angelone"]
    });
  });

  app.post("/api/extension/install", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const user = await storage.updateUser(userId, {
        extensionInstalled: true,
      });

      res.json({ message: "Extension installation recorded", installed: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Demo data for testing
  app.get("/api/demo/stock-data", (req, res) => {
    const demoData = {
      symbol: "RELIANCE",
      price: 2456.75,
      change: 23.45,
      changePercent: 0.96,
      volume: 1234567,
      high: 2467.80,
      low: 2445.20,
      open: 2450.00,
      close: 2456.75,
      technicalIndicators: {
        rsi: 65.4,
        macd: 12.3,
        sma20: 2445.6,
        sma50: 2423.8,
        bollinger: {
          upper: 2478.9,
          middle: 2445.6,
          lower: 2412.3
        }
      },
      patterns: [
        { type: "Hammer", confidence: 85, timeframe: "1D" },
        { type: "Bullish Engulfing", confidence: 78, timeframe: "4H" }
      ],
      recommendation: "BUY",
      confidence: 82,
      timestamp: new Date().toISOString()
    };
    
    res.json({ data: demoData });
  });

  return app;
}
