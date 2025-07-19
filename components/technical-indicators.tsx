interface TechnicalIndicatorsProps {
  data?: any
}

export const TechnicalIndicators = ({ data }: TechnicalIndicatorsProps) => {
  if (!data) {
    return (
      <div className="p-4 border-b border-slate-700">
        <h4 className="font-medium text-slate-100 text-sm mb-3">Technical Indicators</h4>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">No technical data available</p>
        </div>
      </div>
    )
  }

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-400'
    if (rsi < 30) return 'text-green-400'
    return 'text-yellow-400'
  }

  const getRSIWidth = (rsi: number) => {
    return `${(rsi / 100) * 100}%`
  }

  const getMASignal = (price: number, ma: number) => {
    if (price > ma) return { color: 'text-green-400', symbol: '↑' }
    if (price < ma) return { color: 'text-red-400', symbol: '↓' }
    return { color: 'text-slate-400', symbol: '→' }
  }

  return (
    <div className="p-4 border-b border-slate-700">
      <h4 className="font-medium text-slate-100 text-sm mb-3">Technical Indicators</h4>
      <div className="space-y-3">
        {/* RSI */}
        {data.rsi !== null && data.rsi !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">RSI (14)</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    data.rsi > 70 ? 'bg-red-400' :
                    data.rsi < 30 ? 'bg-green-400' : 'bg-yellow-400'
                  }`}
                  style={{ width: getRSIWidth(data.rsi) }}
                />
              </div>
              <span className={`text-xs font-mono ${getRSIColor(data.rsi)}`}>
                {data.rsi.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* MACD */}
        {data.macd && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">MACD</span>
            <span className={`text-xs font-mono ${
              data.macd.macd > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {data.macd.macd > 0 ? '+' : ''}{data.macd.macd.toFixed(2)}
            </span>
          </div>
        )}

        {/* Moving Averages */}
        {data.ma20 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">MA (20)</span>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-mono text-slate-100">
                ₹{data.ma20.toFixed(2)}
              </span>
              {data.currentPrice && (
                <span className={`text-xs ${getMASignal(data.currentPrice, data.ma20).color}`}>
                  {getMASignal(data.currentPrice, data.ma20).symbol}
                </span>
              )}
            </div>
          </div>
        )}

        {data.ma50 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">MA (50)</span>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-mono text-slate-100">
                ₹{data.ma50.toFixed(2)}
              </span>
              {data.currentPrice && (
                <span className={`text-xs ${getMASignal(data.currentPrice, data.ma50).color}`}>
                  {getMASignal(data.currentPrice, data.ma50).symbol}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Volume */}
        {data.volume && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Volume</span>
            <span className="text-xs font-mono text-slate-100">
              {data.volume > 1000000 
                ? `${(data.volume / 1000000).toFixed(1)}M`
                : data.volume > 1000
                ? `${(data.volume / 1000).toFixed(1)}K`
                : data.volume.toLocaleString()
              }
            </span>
          </div>
        )}

        {/* Signal Summary */}
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Overall Signal</div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {data.rsi > 70 && (
                <span className="px-1 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Overbought</span>
              )}
              {data.rsi < 30 && (
                <span className="px-1 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">Oversold</span>
              )}
              {data.macd?.macd > 0 && (
                <span className="px-1 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">Bull MACD</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
