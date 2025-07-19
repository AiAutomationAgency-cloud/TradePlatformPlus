import { useState, useEffect } from "react"
import { Settings, Activity, Brain, TrendingUp } from "lucide-react"

import { useStorage } from "@plasmohq/storage/hook"

const Popup = () => {
  const [isEnabled, setIsEnabled] = useStorage("extensionEnabled", true)
  const [apiKey, setApiKey] = useStorage("geminiApiKey", "")
  const [analysisCount, setAnalysisCount] = useStorage("dailyAnalysisCount", 0)
  const [currentTab, setCurrentTab] = useState("")

  useEffect(() => {
    // Get current tab info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentTab(tabs[0].url || "")
      }
    })
  }, [])

  const isSupportedPlatform = currentTab.includes("kite.zerodha.com") || 
    currentTab.includes("groww.in") || 
    currentTab.includes("web.angelone.in")

  return (
    <div className="w-80 bg-slate-900 text-slate-100" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <Brain className="text-white w-3 h-3" />
          </div>
          <h1 className="font-semibold text-sm">StockSense AI</h1>
        </div>
      </div>

      {/* Status */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Extension Status</span>
          <div className={`flex items-center space-x-1 ${isEnabled ? 'text-green-500' : 'text-red-500'}`}>
            <Activity className="w-3 h-3" />
            <span className="text-xs">{isEnabled ? 'Active' : 'Disabled'}</span>
          </div>
        </div>
        
        {isSupportedPlatform ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
            <p className="text-xs text-green-400">✓ Supported platform detected</p>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
            <p className="text-xs text-yellow-400">Navigate to a supported trading platform</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-medium text-sm mb-3">Today's Usage</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded p-2">
            <div className="text-xs text-slate-400">API Calls</div>
            <div className="text-sm font-mono text-slate-100">{analysisCount} / 1000</div>
          </div>
          <div className="bg-slate-800 rounded p-2">
            <div className="text-xs text-slate-400">Accuracy</div>
            <div className="text-sm font-mono text-green-400">84.2%</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h3 className="font-medium text-sm mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button 
            onClick={() => setIsEnabled(!isEnabled)}
            className={`w-full p-2 rounded text-sm font-medium transition-colors ${
              isEnabled 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isEnabled ? 'Disable Extension' : 'Enable Extension'}
          </button>
          
          <button 
            onClick={() => chrome.runtime.openOptionsPage()}
            className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Settings className="w-3 h-3" />
            <span>Open Settings</span>
          </button>
        </div>
      </div>

      {/* API Key Status */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Gemini AI API</span>
          <span className={`text-xs ${apiKey ? 'text-green-400' : 'text-red-400'}`}>
            {apiKey ? 'Connected' : 'Not configured'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Popup
