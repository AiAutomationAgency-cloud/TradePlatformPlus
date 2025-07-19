import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve the test page for extension testing
  app.get("/test-page.html", (req, res) => {
    res.sendFile(path.resolve("test-page.html"));
  });

  // API routes
  app.get("/api/extension/status", (req, res) => {
    res.json({ 
      status: "ready", 
      features: ["AI Analysis", "Pattern Detection", "Multi-Platform Support", "Interactive Chat"],
      version: "1.0.0"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
