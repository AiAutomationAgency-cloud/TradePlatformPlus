import { AIAnalysisService } from "~lib/ai-analysis"
import { DataExtractionService } from "~lib/data-extraction" 
import { PatternDetectionService } from "~lib/pattern-detection"

// Using Gemini 2.5 Flash for AI analysis
const aiService = new AIAnalysisService()
const dataExtractor = new DataExtractionService()
const patternDetector = new PatternDetectionService()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.name) {
        case "extractStockData":
          const stockData = await dataExtractor.extractFromUrl(request.body.url)
          sendResponse(stockData)
          break
          
        case "analyzeStock":
          const analysis = await aiService.analyzeStock(request.body.stockData)
          sendResponse(analysis)
          break
          
        case "detectPatterns":
          const patterns = await patternDetector.detectPatterns(request.body.candlestickData)
          sendResponse(patterns)
          break
          
        case "chatWithAI":
          const chatResponse = await aiService.chatAnalysis(request.body.message, request.body.context)
          sendResponse(chatResponse)
          break
          
        default:
          sendResponse({ error: "Unknown request type" })
      }
    } catch (error) {
      console.error("Background script error:", error)
      sendResponse({ error: error.message })
    }
  })()
  
  return true // Keep message channel open for async response
})

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log("StockSense AI Extension installed")
  
  // Auto-configure Gemini API key from environment if available
  try {
    const existingKey = await chrome.storage.local.get(['geminiApiKey'])
    if (!existingKey.geminiApiKey && typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
      await chrome.storage.local.set({ geminiApiKey: process.env.GEMINI_API_KEY })
      console.log("Gemini API key auto-configured from environment")
    }
  } catch (error) {
    console.log("Environment API key not available, user will need to configure manually")
  }
})
