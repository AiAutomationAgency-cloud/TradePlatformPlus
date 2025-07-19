import { defineConfig } from "plasmo"

export default defineConfig({
  manifest: {
    name: "StockSense AI - Intelligent Trading Assistant",
    description: "AI-powered stock analysis and trading recommendations for Indian markets",
    version: "1.0.0",
    permissions: ["storage", "activeTab", "scripting"],
    host_permissions: [
      "https://kite.zerodha.com/*",
      "https://groww.in/*", 
      "https://web.angelone.in/*"
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';"
    }
  }
})
