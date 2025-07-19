export interface CandlestickPattern {
  name: string
  type: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  description: string
  action: 'BUY' | 'SELL' | 'HOLD' | 'WAIT'
}

export class PatternDetectionService {
  detectPatterns(candlestickData: any[]): CandlestickPattern[] {
    if (!candlestickData || candlestickData.length < 2) {
      return []
    }

    const patterns: CandlestickPattern[] = []
    
    // Detect various candlestick patterns
    patterns.push(...this.detectDoji(candlestickData))
    patterns.push(...this.detectHammer(candlestickData))
    patterns.push(...this.detectEngulfing(candlestickData))
    patterns.push(...this.detectShootingStar(candlestickData))
    patterns.push(...this.detectMorningStar(candlestickData))
    patterns.push(...this.detectEveningStar(candlestickData))

    return patterns.filter(p => p.confidence > 0.6) // Only return high confidence patterns
  }

  private detectDoji(data: any[]): CandlestickPattern[] {
    const patterns: CandlestickPattern[] = []
    const current = data[data.length - 1]
    
    if (!current) return patterns

    const bodySize = Math.abs(current.close - current.open)
    const totalRange = current.high - current.low
    
    // Doji: body is very small compared to the total range
    if (bodySize / totalRange < 0.1 && totalRange > 0) {
      patterns.push({
        name: 'Doji',
        type: 'neutral',
        confidence: 0.8,
        description: 'Indecision pattern suggesting potential reversal. Market showing uncertainty.',
        action: 'WAIT'
      })
    }

    return patterns
  }

  private detectHammer(data: any[]): CandlestickPattern[] {
    const patterns: CandlestickPattern[] = []
    const current = data[data.length - 1]
    
    if (!current) return patterns

    const bodySize = Math.abs(current.close - current.open)
    const lowerShadow = Math.min(current.open, current.close) - current.low
    const upperShadow = current.high - Math.max(current.open, current.close)
    const totalRange = current.high - current.low

    // Hammer: small body, long lower shadow, small upper shadow
    if (bodySize / totalRange < 0.3 && 
        lowerShadow > bodySize * 2 && 
        upperShadow < bodySize * 0.5) {
      
      const isUptrend = data.length > 5 ? 
        data.slice(-5).every((candle, i, arr) => i === 0 || candle.close > arr[i-1].close) : false

      patterns.push({
        name: 'Hammer',
        type: isUptrend ? 'neutral' : 'bullish',
        confidence: 0.75,
        description: 'Potential reversal signal. Buyers stepping in at lower levels.',
        action: isUptrend ? 'WAIT' : 'BUY'
      })
    }

    return patterns
  }

  private detectEngulfing(data: any[]): CandlestickPattern[] {
    const patterns: CandlestickPattern[] = []
    
    if (data.length < 2) return patterns

    const current = data[data.length - 1]
    const previous = data[data.length - 2]

    const currentBody = Math.abs(current.close - current.open)
    const previousBody = Math.abs(previous.close - previous.open)

    // Bullish Engulfing
    if (previous.close < previous.open && // Previous red candle
        current.close > current.open && // Current green candle
        current.open < previous.close && // Current opens below previous close
        current.close > previous.open && // Current closes above previous open
        currentBody > previousBody * 1.2) { // Current body engulfs previous

      patterns.push({
        name: 'Bullish Engulfing',
        type: 'bullish',
        confidence: 0.85,
        description: 'Strong reversal signal. Bulls taking control after bearish move.',
        action: 'BUY'
      })
    }

    // Bearish Engulfing
    if (previous.close > previous.open && // Previous green candle
        current.close < current.open && // Current red candle
        current.open > previous.close && // Current opens above previous close
        current.close < previous.open && // Current closes below previous open
        currentBody > previousBody * 1.2) { // Current body engulfs previous

      patterns.push({
        name: 'Bearish Engulfing',
        type: 'bearish',
        confidence: 0.85,
        description: 'Strong reversal signal. Bears taking control after bullish move.',
        action: 'SELL'
      })
    }

    return patterns
  }

  private detectShootingStar(data: any[]): CandlestickPattern[] {
    const patterns: CandlestickPattern[] = []
    const current = data[data.length - 1]
    
    if (!current) return patterns

    const bodySize = Math.abs(current.close - current.open)
    const upperShadow = current.high - Math.max(current.open, current.close)
    const lowerShadow = Math.min(current.open, current.close) - current.low

    // Shooting Star: small body, long upper shadow, small lower shadow
    if (bodySize < (current.high - current.low) * 0.3 &&
        upperShadow > bodySize * 2 &&
        lowerShadow < bodySize * 0.5) {

      patterns.push({
        name: 'Shooting Star',
        type: 'bearish',
        confidence: 0.7,
        description: 'Potential top reversal. Selling pressure at higher levels.',
        action: 'SELL'
      })
    }

    return patterns
  }

  private detectMorningStar(data: any[]): CandlestickPattern[] {
    const patterns: CandlestickPattern[] = []
    
    if (data.length < 3) return patterns

    const [first, second, third] = data.slice(-3)
    
    // Morning Star: bearish + small body + bullish
    if (first.close < first.open && // First candle is bearish
        Math.abs(second.close - second.open) < (second.high - second.low) * 0.3 && // Second is small body
        third.close > third.open && // Third is bullish
        third.close > (first.open + first.close) / 2) { // Third closes above midpoint of first

      patterns.push({
        name: 'Morning Star',
        type: 'bullish',
        confidence: 0.8,
        description: 'Three-candle reversal pattern. Strong bullish signal.',
        action: 'BUY'
      })
    }

    return patterns
  }

  private detectEveningStar(data: any[]): CandlestickPattern[] {
    const patterns: CandlestickPattern[] = []
    
    if (data.length < 3) return patterns

    const [first, second, third] = data.slice(-3)
    
    // Evening Star: bullish + small body + bearish
    if (first.close > first.open && // First candle is bullish
        Math.abs(second.close - second.open) < (second.high - second.low) * 0.3 && // Second is small body
        third.close < third.open && // Third is bearish
        third.close < (first.open + first.close) / 2) { // Third closes below midpoint of first

      patterns.push({
        name: 'Evening Star',
        type: 'bearish',
        confidence: 0.8,
        description: 'Three-candle reversal pattern. Strong bearish signal.',
        action: 'SELL'
      })
    }

    return patterns
  }

  calculateTechnicalIndicators(data: any[]): any {
    if (!data || data.length < 20) {
      return {
        rsi: null,
        macd: null,
        ma20: null,
        ma50: null
      }
    }

    return {
      rsi: this.calculateRSI(data, 14),
      macd: this.calculateMACD(data),
      ma20: this.calculateMA(data, 20),
      ma50: this.calculateMA(data, 50)
    }
  }

  private calculateRSI(data: any[], period: number): number | null {
    if (data.length < period + 1) return null

    const gains: number[] = []
    const losses: number[] = []

    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)
    }

    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period

    if (avgLoss === 0) return 100
    
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }

  private calculateMA(data: any[], period: number): number | null {
    if (data.length < period) return null
    
    const sum = data.slice(-period).reduce((acc, candle) => acc + candle.close, 0)
    return sum / period
  }

  private calculateMACD(data: any[]): any {
    if (data.length < 26) return null

    const ema12 = this.calculateEMA(data, 12)
    const ema26 = this.calculateEMA(data, 26)
    
    if (!ema12 || !ema26) return null

    return {
      macd: ema12 - ema26,
      signal: this.calculateEMA(data, 9), // Simplified
      histogram: ema12 - ema26 - this.calculateEMA(data, 9)
    }
  }

  private calculateEMA(data: any[], period: number): number | null {
    if (data.length < period) return null

    const k = 2 / (period + 1)
    let ema = data[0].close

    for (let i = 1; i < data.length; i++) {
      ema = data[i].close * k + ema * (1 - k)
    }

    return ema
  }
}
