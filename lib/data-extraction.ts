export class DataExtractionService {
  async extractFromUrl(url: string): Promise<any> {
    try {
      if (url.includes('kite.zerodha.com')) {
        return await this.extractZerodhaData()
      } else if (url.includes('groww.in')) {
        return await this.extractGrowwData()
      } else if (url.includes('web.angelone.in')) {
        return await this.extractAngelOneData()
      }
      
      return null
    } catch (error) {
      console.error('Data extraction failed:', error)
      return null
    }
  }

  private async extractZerodhaData(): Promise<any> {
    try {
      // Extract stock symbol from URL or page
      const symbol = this.extractSymbolFromPage()
      
      // Extract price data
      const priceElement = document.querySelector('.last-price') || 
                          document.querySelector('[data-balloon="LTP"]') ||
                          document.querySelector('.price')
      
      const price = priceElement ? parseFloat(priceElement.textContent?.replace(/[₹,]/g, '') || '0') : 0

      // Extract basic fundamentals from the page
      const fundamentals = this.extractFundamentalsFromPage()
      
      // Get candlestick data from chart (if available)
      const candlestickData = await this.extractCandlestickData()
      
      return {
        platform: 'zerodha',
        symbol,
        price,
        fundamentals,
        candlestickData,
        timestamp: Date.now(),
        news: await this.extractNewsData()
      }
    } catch (error) {
      console.error('Zerodha data extraction failed:', error)
      return null
    }
  }

  private async extractGrowwData(): Promise<any> {
    try {
      const symbol = this.extractSymbolFromPage()
      
      const priceElement = document.querySelector('.cur-price') || 
                          document.querySelector('.current-price') ||
                          document.querySelector('[data-testid="current-price"]')
      
      const price = priceElement ? parseFloat(priceElement.textContent?.replace(/[₹,]/g, '') || '0') : 0

      const fundamentals = this.extractFundamentalsFromPage()
      const candlestickData = await this.extractCandlestickData()
      
      return {
        platform: 'groww',
        symbol,
        price,
        fundamentals,
        candlestickData,
        timestamp: Date.now(),
        news: await this.extractNewsData()
      }
    } catch (error) {
      console.error('Groww data extraction failed:', error)
      return null
    }
  }

  private async extractAngelOneData(): Promise<any> {
    try {
      const symbol = this.extractSymbolFromPage()
      
      const priceElement = document.querySelector('.ltp-price') || 
                          document.querySelector('.current-price') ||
                          document.querySelector('.stock-price')
      
      const price = priceElement ? parseFloat(priceElement.textContent?.replace(/[₹,]/g, '') || '0') : 0

      const fundamentals = this.extractFundamentalsFromPage()
      const candlestickData = await this.extractCandlestickData()
      
      return {
        platform: 'angelone',
        symbol,
        price,
        fundamentals,
        candlestickData,
        timestamp: Date.now(),
        news: await this.extractNewsData()
      }
    } catch (error) {
      console.error('Angel One data extraction failed:', error)
      return null
    }
  }

  private extractSymbolFromPage(): string {
    // Try multiple selectors to find stock symbol
    const selectors = [
      'h1', '.instrument-name', '.stock-name', '[data-testid="stock-name"]',
      '.security-name', '.scrip-name', '.symbol'
    ]
    
    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element?.textContent) {
        // Extract symbol from text (usually first word or in parentheses)
        const text = element.textContent.trim()
        const match = text.match(/([A-Z]+)/g)
        if (match) return match[0]
      }
    }
    
    // Fallback: extract from URL
    const urlMatch = window.location.pathname.match(/([A-Z]+)/g)
    return urlMatch ? urlMatch[urlMatch.length - 1] : 'UNKNOWN'
  }

  private extractFundamentalsFromPage(): any {
    const fundamentals: any = {}
    
    // Common selectors for fundamental data
    const dataMap = {
      'P/E': ['pe-ratio', 'pe', 'price-earnings'],
      'EPS': ['eps', 'earnings-per-share'],
      'Market Cap': ['market-cap', 'mcap'],
      'Book Value': ['book-value', 'bv'],
      'Debt/Equity': ['debt-equity', 'de-ratio'],
      'ROE': ['roe', 'return-on-equity'],
      'Revenue': ['revenue', 'sales'],
      'Profit': ['profit', 'net-income']
    }

    Object.entries(dataMap).forEach(([key, selectors]) => {
      for (const selector of selectors) {
        const element = document.querySelector(`[data-label="${selector}"]`) ||
                       document.querySelector(`[data-testid="${selector}"]`) ||
                       document.querySelector(`.${selector}`) ||
                       document.querySelector(`#${selector}`)
        
        if (element?.textContent) {
          const value = element.textContent.replace(/[₹,]/g, '').trim()
          const numValue = parseFloat(value)
          if (!isNaN(numValue)) {
            fundamentals[key] = numValue
            break
          }
        }
      }
    })

    return fundamentals
  }

  private async extractCandlestickData(): Promise<any[]> {
    try {
      // Try to access chart data from common chart libraries
      const chartData = await this.tryExtractChartData()
      
      if (chartData && chartData.length > 0) {
        return chartData.map(item => ({
          timestamp: item.timestamp || item.time || Date.now(),
          open: parseFloat(item.open || item.o || 0),
          high: parseFloat(item.high || item.h || 0),
          low: parseFloat(item.low || item.l || 0),
          close: parseFloat(item.close || item.c || 0),
          volume: parseFloat(item.volume || item.v || 0)
        }))
      }
      
      return []
    } catch (error) {
      console.error('Candlestick data extraction failed:', error)
      return []
    }
  }

  private async tryExtractChartData(): Promise<any[]> {
    // Try to access data from popular charting libraries
    const chartSources = [
      () => (window as any).chartData,
      () => (window as any).TradingView?.chart?.data,
      () => (window as any).Highcharts?.charts?.[0]?.series?.[0]?.data,
      () => (window as any).Chart?.instances?.[0]?.data?.datasets?.[0]?.data
    ]

    for (const source of chartSources) {
      try {
        const data = source()
        if (data && Array.isArray(data) && data.length > 0) {
          return data
        }
      } catch (e) {
        continue
      }
    }

    return []
  }

  private async extractNewsData(): Promise<any[]> {
    const newsItems: any[] = []
    
    // Common news selectors
    const newsSelectors = [
      '.news-item', '.news-card', '[data-testid="news-item"]',
      '.announcement', '.update', '.headline'
    ]
    
    for (const selector of newsSelectors) {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element, index) => {
        if (index < 5) { // Limit to 5 news items
          const title = element.querySelector('h3, h4, .title, .headline')?.textContent?.trim()
          const source = element.querySelector('.source, .publisher')?.textContent?.trim()
          const timeAgo = element.querySelector('.time, .timestamp, .date')?.textContent?.trim()
          
          if (title) {
            newsItems.push({
              title,
              source: source || 'Unknown',
              timeAgo: timeAgo || 'Recent'
            })
          }
        }
      })
    }
    
    return newsItems
  }
}
