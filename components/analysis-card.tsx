import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react"

interface AnalysisCardProps {
  analysis: any
}

export const AnalysisCard = ({ analysis }: AnalysisCardProps) => {
  if (!analysis) {
    return (
      <div className="bg-slate-800 rounded-lg p-3 text-center">
        <p className="text-xs text-slate-400">No analysis available</p>
      </div>
    )
  }

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'bullish':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'bearish':
        return <TrendingDown className="w-3 h-3 text-red-500" />
      default:
        return <Minus className="w-3 h-3 text-yellow-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'text-green-500'
      case 'SELL':
        return 'text-red-500'
      case 'WAIT':
        return 'text-yellow-500'
      default:
        return 'text-slate-400'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500'
    if (confidence >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-3">
      {/* Pattern Detection */}
      {analysis.pattern && (
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getPatternIcon(analysis.pattern.type)}
              <span className="text-xs font-medium text-yellow-400 uppercase">
                {analysis.pattern.name}
              </span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(analysis.pattern.confidence)} text-slate-900`}>
              {Math.round(analysis.pattern.confidence * 100)}% Confidence
            </div>
          </div>
          
          {analysis.recommendation && (
            <>
              <div className="text-xs text-slate-300 mb-2">
                {analysis.recommendation.reasoning}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400">Suggestion:</span>
                  <span className={`font-medium ml-1 ${getActionColor(analysis.recommendation.action)}`}>
                    {analysis.recommendation.action}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {analysis.recommendation.timeframe} term
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* AI Insights */}
      {analysis.insights && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-3 h-3 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">AI Insight</span>
          </div>
          <p className="text-xs text-slate-100 leading-relaxed">
            {analysis.insights}
          </p>
        </div>
      )}

      {/* Key Levels */}
      {analysis.keyLevels && (
        <div className="bg-slate-800 rounded-lg p-3">
          <h5 className="text-xs font-medium text-slate-200 mb-2">Key Levels</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {analysis.keyLevels.support && (
              <div>
                <span className="text-slate-400">Support:</span>
                <span className="ml-1 font-mono text-green-400">₹{analysis.keyLevels.support}</span>
              </div>
            )}
            {analysis.keyLevels.resistance && (
              <div>
                <span className="text-slate-400">Resistance:</span>
                <span className="ml-1 font-mono text-red-400">₹{analysis.keyLevels.resistance}</span>
              </div>
            )}
            {analysis.keyLevels.target && (
              <div>
                <span className="text-slate-400">Target:</span>
                <span className="ml-1 font-mono text-blue-400">₹{analysis.keyLevels.target}</span>
              </div>
            )}
            {analysis.keyLevels.stopLoss && (
              <div>
                <span className="text-slate-400">Stop Loss:</span>
                <span className="ml-1 font-mono text-yellow-400">₹{analysis.keyLevels.stopLoss}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
