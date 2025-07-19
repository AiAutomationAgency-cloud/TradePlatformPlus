import type { PlasmoCSConfig } from "plasmo"
import { useState, useEffect } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

export const config: PlasmoCSConfig = {
  matches: [
    "https://kite.zerodha.com/*",
    "https://groww.in/*", 
    "https://web.angelone.in/*"
  ],
  all_frames: false
}

const PatternOverlay = () => {
  const [learningMode] = useStorage("learningMode", false)
  const [detectedPatterns, setDetectedPatterns] = useState<any[]>([])

  useEffect(() => {
    if (!learningMode) {
      // Remove all existing overlays
      document.querySelectorAll('.stocksense-pattern-overlay').forEach(el => el.remove())
      return
    }

    const detectAndShowPatterns = async () => {
      try {
        // Extract candlestick data
        const stockData = await sendToBackground({
          name: "extractStockData",
          body: { url: window.location.href }
        })

        if (stockData?.candlestickData) {
          // Detect patterns
          const patterns = await sendToBackground({
            name: "detectPatterns",
            body: { candlestickData: stockData.candlestickData }
          })

          setDetectedPatterns(patterns || [])
          
          // Show pattern overlays on chart
          showPatternOverlays(patterns || [])
        }
      } catch (error) {
        console.error("Pattern detection failed:", error)
      }
    }

    detectAndShowPatterns()
    
    // Update patterns every 30 seconds in learning mode
    const interval = setInterval(detectAndShowPatterns, 30000)
    
    return () => {
      clearInterval(interval)
      document.querySelectorAll('.stocksense-pattern-overlay').forEach(el => el.remove())
    }
  }, [learningMode])

  const showPatternOverlays = (patterns: any[]) => {
    // Remove existing overlays
    document.querySelectorAll('.stocksense-pattern-overlay').forEach(el => el.remove())

    if (!patterns || patterns.length === 0) return

    // Try to find chart container
    const chartSelectors = [
      '.chart-container',
      '.tv-lightweight-charts',
      '[data-name="chart-container"]',
      '.highcharts-container',
      '.tradingview-widget-container'
    ]

    let chartContainer = null
    for (const selector of chartSelectors) {
      chartContainer = document.querySelector(selector)
      if (chartContainer) break
    }

    if (!chartContainer) {
      console.log("Chart container not found for pattern overlay")
      return
    }

    patterns.forEach((pattern, index) => {
      if (pattern.confidence > 0.7) {
        const overlay = document.createElement('div')
        overlay.className = `stocksense-pattern-overlay stocksense-pattern-${pattern.type}`
        overlay.textContent = `${pattern.name} (${Math.round(pattern.confidence * 100)}%)`
        
        // Position the overlay (simplified positioning)
        overlay.style.position = 'absolute'
        overlay.style.top = `${20 + index * 30}px`
        overlay.style.right = '20px'
        overlay.style.zIndex = '9999'
        overlay.style.background = pattern.type === 'bullish' ? '#10b981' : 
                                 pattern.type === 'bearish' ? '#ef4444' : '#f59e0b'
        overlay.style.color = 'white'
        overlay.style.padding = '4px 8px'
        overlay.style.borderRadius = '4px'
        overlay.style.fontSize = '12px'
        overlay.style.fontWeight = '500'
        overlay.style.pointerEvents = 'none'

        chartContainer.style.position = 'relative'
        chartContainer.appendChild(overlay)
      }
    })
  }

  return null // This component only manages overlays, no UI
}

export default PatternOverlay