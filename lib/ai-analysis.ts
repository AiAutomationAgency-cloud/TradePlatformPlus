import { GoogleGenAI } from "@google/genai"

export class AIAnalysisService {
  private gemini: GoogleGenAI | null = null

  constructor() {
    this.initializeGemini()
  }

  private async initializeGemini() {
    try {
      const apiKey = await chrome.storage.local.get(['geminiApiKey'])
      if (apiKey.geminiApiKey) {
        this.gemini = new GoogleGenAI({ apiKey: apiKey.geminiApiKey })
      }
    } catch (error) {
      console.error("Failed to initialize Gemini:", error)
    }
  }

  async analyzeStock(stockData: any): Promise<any> {
    if (!this.gemini) {
      throw new Error("Gemini API not configured. Please set your API key in the extension settings.")
    }

    try {
      const prompt = `
        Analyze the following stock data and provide trading insights in JSON format:
        
        Stock Data:
        - Symbol: ${stockData.symbol}
        - Current Price: ${stockData.price}
        - Technical Indicators: ${JSON.stringify(stockData.technicals)}
        - Fundamentals: ${JSON.stringify(stockData.fundamentals)}
        - Recent Patterns: ${JSON.stringify(stockData.patterns)}
        
        Provide response in this JSON format:
        {
          "pattern": {
            "name": "pattern name",
            "confidence": 0.85,
            "type": "bullish|bearish|neutral"
          },
          "recommendation": {
            "action": "BUY|SELL|HOLD|WAIT",
            "reasoning": "clear explanation",
            "timeframe": "short|medium|long term",
            "riskLevel": "low|medium|high"
          },
          "insights": "comprehensive analysis combining technical and fundamental factors",
          "keyLevels": {
            "support": price,
            "resistance": price,
            "target": price,
            "stopLoss": price
          }
        }
      `

      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are an expert financial analyst specializing in Indian stock markets. Provide accurate, actionable trading advice based on technical and fundamental analysis.",
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              pattern: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  confidence: { type: "number" },
                  type: { type: "string" }
                }
              },
              recommendation: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  reasoning: { type: "string" },
                  timeframe: { type: "string" },
                  riskLevel: { type: "string" }
                }
              },
              insights: { type: "string" },
              keyLevels: {
                type: "object",
                properties: {
                  support: { type: "number" },
                  resistance: { type: "number" },
                  target: { type: "number" },
                  stopLoss: { type: "number" }
                }
              }
            }
          }
        },
        contents: prompt
      })

      return JSON.parse(response.text)
    } catch (error) {
      console.error("AI Analysis failed:", error)
      throw new Error(`Analysis failed: ${error.message}`)
    }
  }

  async chatAnalysis(message: string, context: any): Promise<any> {
    if (!this.gemini) {
      throw new Error("Gemini API not configured")
    }

    try {
      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are a helpful financial assistant for Indian stock trading. Current context: ${JSON.stringify(context)}. Provide concise, actionable responses.`
        },
        contents: message
      })

      return {
        response: response.text,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error("Chat analysis failed:", error)
      throw new Error(`Chat failed: ${error.message}`)
    }
  }

  async generateInsight(technicalData: any, fundamentalData: any): Promise<string> {
    if (!this.gemini) {
      return "AI insights unavailable. Please configure your Gemini API key."
    }

    try {
      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "Generate a brief, actionable insight combining technical and fundamental analysis."
        },
        contents: `Technical: ${JSON.stringify(technicalData)}. Fundamental: ${JSON.stringify(fundamentalData)}`
      })

      return response.text
    } catch (error) {
      console.error("Insight generation failed:", error)
      return "Unable to generate insights at this time."
    }
  }
}
