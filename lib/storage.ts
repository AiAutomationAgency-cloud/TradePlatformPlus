import { Storage } from "@plasmohq/storage"

export const storage = new Storage()

export interface ExtensionSettings {
  geminiApiKey: string
  geminiModel: string
  analysisFrequency: number
  enabledBrokers: {
    zerodha: boolean
    groww: boolean
    angelone: boolean
  }
  learningMode: boolean
  autoDetectPatterns: boolean
  showConfidenceScores: boolean
}

export interface AnalysisData {
  symbol: string
  timestamp: number
  pattern: any
  recommendation: any
  insights: string
  keyLevels: any
}

export interface ChatMessage {
  id: string
  message: string
  response: string
  timestamp: number
  symbol?: string
}

export class ExtensionStorage {
  static async getSettings(): Promise<ExtensionSettings> {
    const defaults: ExtensionSettings = {
      geminiApiKey: '',
      geminiModel: 'gemini-2.5-flash',
      analysisFrequency: 30,
      enabledBrokers: {
        zerodha: true,
        groww: true,
        angelone: true
      },
      learningMode: false,
      autoDetectPatterns: true,
      showConfidenceScores: true
    }

    const stored = await storage.get('settings')
    return { ...defaults, ...stored }
  }

  static async saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
    const current = await this.getSettings()
    await storage.set('settings', { ...current, ...settings })
  }

  static async saveAnalysis(analysis: AnalysisData): Promise<void> {
    const key = `analysis_${analysis.symbol}_${Date.now()}`
    await storage.set(key, analysis)
    
    // Keep only last 100 analyses per symbol
    const allKeys = await storage.getAll()
    const analysisKeys = Object.keys(allKeys)
      .filter(k => k.startsWith(`analysis_${analysis.symbol}_`))
      .sort()
    
    if (analysisKeys.length > 100) {
      const toDelete = analysisKeys.slice(0, analysisKeys.length - 100)
      for (const key of toDelete) {
        await storage.remove(key)
      }
    }
  }

  static async getRecentAnalyses(symbol: string, limit: number = 10): Promise<AnalysisData[]> {
    const allData = await storage.getAll()
    const analyses = Object.entries(allData)
      .filter(([key]) => key.startsWith(`analysis_${symbol}_`))
      .map(([, value]) => value as AnalysisData)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
    
    return analyses
  }

  static async saveChatMessage(message: ChatMessage): Promise<void> {
    const key = `chat_${message.id}`
    await storage.set(key, message)
  }

  static async getChatHistory(symbol?: string, limit: number = 50): Promise<ChatMessage[]> {
    const allData = await storage.getAll()
    let messages = Object.entries(allData)
      .filter(([key]) => key.startsWith('chat_'))
      .map(([, value]) => value as ChatMessage)
      .sort((a, b) => b.timestamp - a.timestamp)
    
    if (symbol) {
      messages = messages.filter(m => m.symbol === symbol)
    }
    
    return messages.slice(0, limit)
  }

  static async clearChatHistory(): Promise<void> {
    const allKeys = await storage.getAll()
    const chatKeys = Object.keys(allKeys).filter(k => k.startsWith('chat_'))
    
    for (const key of chatKeys) {
      await storage.remove(key)
    }
  }

  static async incrementUsageCount(): Promise<number> {
    const today = new Date().toDateString()
    const key = `usage_${today}`
    const current = await storage.get(key) || 0
    const newCount = current + 1
    await storage.set(key, newCount)
    return newCount
  }

  static async getTodayUsage(): Promise<number> {
    const today = new Date().toDateString()
    const key = `usage_${today}`
    return await storage.get(key) || 0
  }
}
