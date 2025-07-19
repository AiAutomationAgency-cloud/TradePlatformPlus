import { useState } from "react"
import { Save, Eye, EyeOff } from "lucide-react"

import { useStorage } from "@plasmohq/storage/hook"

const Options = () => {
  const [apiKey, setApiKey] = useStorage("geminiApiKey", "")
  const [model, setModel] = useStorage("geminiModel", "gemini-2.5-flash")
  const [analysisFrequency, setAnalysisFrequency] = useStorage("analysisFrequency", "30")
  const [enabledBrokers, setEnabledBrokers] = useStorage("enabledBrokers", {
    zerodha: true,
    groww: true,
    angelone: true
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleBrokerToggle = (broker: string) => {
    setEnabledBrokers(prev => ({
      ...prev,
      [broker]: !prev[broker]
    }))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">StockSense AI Settings</h1>

        {/* API Configuration */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">AI Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Gemini API Key</label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 pr-10 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-400 hover:underline">Google AI Studio</a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Analysis Frequency (seconds)</label>
              <select
                value={analysisFrequency}
                onChange={(e) => setAnalysisFrequency(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="10">Real-time (10s)</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every minute</option>
                <option value="300">Every 5 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Broker Selection */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Supported Brokers</h2>
          
          <div className="space-y-3">
            {Object.entries(enabledBrokers).map(([broker, enabled]) => (
              <label key={broker} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleBrokerToggle(broker)}
                  className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                <span className="text-sm capitalize">{broker === 'angelone' ? 'Angel One' : broker}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Analysis Settings */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Analysis Settings</h2>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Auto-detect patterns</span>
              <input type="checkbox" defaultChecked className="rounded border-slate-600 bg-slate-700 text-blue-500" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Real-time analysis</span>
              <input type="checkbox" defaultChecked className="rounded border-slate-600 bg-slate-700 text-blue-500" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Show confidence scores</span>
              <input type="checkbox" defaultChecked className="rounded border-slate-600 bg-slate-700 text-blue-500" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Learning mode overlay</span>
              <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-blue-500" />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`flex items-center space-x-2 px-4 py-2 rounded font-medium transition-colors ${
            saved 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  )
}

export default Options
