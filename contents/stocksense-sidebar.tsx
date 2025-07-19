import type { PlasmoCSConfig } from "plasmo"
import { useState, useEffect } from "react"
import { Brain, Minus, X, Trash2, Send, Settings } from "lucide-react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import { AnalysisCard } from "~components/analysis-card"
import { ChatInterface } from "~components/chat-interface" 
import { TechnicalIndicators } from "~components/technical-indicators"
import { FundamentalsDisplay } from "~components/fundamentals-display"

export const config: PlasmoCSConfig = {
  matches: [
    "https://kite.zerodha.com/*",
    "https://groww.in/*",
    "https://web.angelone.in/*"
  ],
  all_frames: false
}

const StockSenseSidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [learningMode, setLearningMode] = useStorage("learningMode", false)
  const [analysisData, setAnalysisData] = useState(null)
  const [stockData, setStockData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initializeExtension = async () => {
      try {
        setIsLoading(true)
        
        // Extract stock data from current page
        const extractedData = await sendToBackground({
          name: "extractStockData",
          body: { url: window.location.href }
        })
        
        if (extractedData) {
          setStockData(extractedData)
          
          // Get AI analysis
          const analysis = await sendToBackground({
            name: "analyzeStock",
            body: { stockData: extractedData }
          })
          
          setAnalysisData(analysis)
        }
      } catch (error) {
        console.error("Failed to initialize StockSense:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeExtension()
    
    // Set up real-time updates
    const interval = setInterval(initializeExtension, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Toggle learning mode overlay
    if (learningMode) {
      document.body.classList.add('stocksense-learning-mode')
    } else {
      document.body.classList.remove('stocksense-learning-mode')
    }
  }, [learningMode])

  if (!isVisible) return null

  return (
    <div 
      className={`
        fixed top-4 right-4 w-80 bg-slate-900 rounded-xl shadow-2xl 
        border border-slate-700 z-[10000] transition-transform duration-300
        ${isMinimized ? 'translate-x-72' : 'translate-x-0'}
      `}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <div className="bg-slate-800 rounded-t-xl px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <Brain className="text-white w-3 h-3" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">StockSense AI</h3>
          </div>
          <div className="flex items-center space-x-2">
            {/* Learning Mode Toggle */}
            <button
              onClick={() => setLearningMode(!learningMode)}
              className={`
                relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                focus:ring-offset-slate-900 ${learningMode ? 'bg-blue-500' : 'bg-slate-600'}
              `}
            >
              <span 
                className={`
                  inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                  ${learningMode ? 'translate-x-5' : 'translate-x-1'}
                `}
              />
            </button>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-slate-400 hover:text-slate-100"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-slate-100"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Live Analysis */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-100 text-sm">Live Analysis</h4>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-slate-800 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          ) : analysisData ? (
            <AnalysisCard analysis={analysisData} />
          ) : (
            <div className="bg-slate-800 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-400">No analysis data available</p>
            </div>
          )}
        </div>

        {/* Technical Indicators */}
        <TechnicalIndicators data={stockData?.technicals} />

        {/* Fundamentals */}
        <FundamentalsDisplay data={stockData?.fundamentals} />

        {/* Recent News */}
        <div className="p-4 border-b border-slate-700">
          <h4 className="font-medium text-slate-100 text-sm mb-3">Latest News</h4>
          <div className="space-y-2">
            {stockData?.news?.length > 0 ? (
              stockData.news.slice(0, 3).map((item, index) => (
                <div key={index} className="text-xs">
                  <div className="text-slate-100 font-medium mb-1">{item.title}</div>
                  <div className="text-slate-400">{item.source} • {item.timeAgo}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">No recent news available</div>
            )}
          </div>
        </div>

        {/* AI Chat Interface */}
        <ChatInterface stockSymbol={stockData?.symbol} />
      </div>
    </div>
  )
}

export default StockSenseSidebar
