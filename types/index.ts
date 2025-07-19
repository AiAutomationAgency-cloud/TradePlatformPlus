export interface StockData {
  platform: 'zerodha' | 'groww' | 'angelone'
  symbol: string
  price: number
  change?: number
  changePercent?: number
  fundamentals: {
    pe?: number
    eps?: number
    marketCap?: number
    bookValue?: number
    debtEquity?: number
    roe?: number
    revenue?: number
    profit?: number
  }
  technicals: {
    rsi?: number
    macd?: {
      macd: number
      signal: number
      histogram: number
    }
    ma20?: number
    ma50?: number
    ma200?: number
    volume?: number
  }
  candlestickData: CandlestickData[]
  patterns?: PatternResult[]
  news: NewsItem[]
  timestamp: number
}

export interface CandlestickData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface PatternResult {
  name: string
  type: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  description: string
  action: 'BUY' | 'SELL' | 'HOLD' | 'WAIT'
  timeframe?: string
}

export interface AIAnalysis {
  pattern: {
    name: string
    confidence: number
    type: 'bullish' | 'bearish' | 'neutral'
  }
  recommendation: {
    action: 'BUY' | 'SELL' | 'HOLD' | 'WAIT'
    reasoning: string
    timeframe: 'short' | 'medium' | 'long'
    riskLevel: 'low' | 'medium' | 'high'
  }
  insights: string
  keyLevels: {
    support: number
    resistance: number
    target: number
    stopLoss: number
  }
}

export interface NewsItem {
  title: string
  source: string
  timeAgo: string
  url?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
}

export interface TechnicalIndicator {
  name: string
  value: number | string
  signal: 'buy' | 'sell' | 'neutral'
  description: string
}

export interface ChatContext {
  symbol: string
  currentPrice: number
  analysis: AIAnalysis
  recentPatterns: PatternResult[]
}

export interface BrokerConfig {
  name: string
  enabled: boolean
  domains: string[]
  selectors: {
    symbol: string[]
    price: string[]
    fundamentals: Record<string, string[]>
  }
}
