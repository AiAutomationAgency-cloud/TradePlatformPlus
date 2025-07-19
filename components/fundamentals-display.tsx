interface FundamentalsDisplayProps {
  data?: any
}

export const FundamentalsDisplay = ({ data }: FundamentalsDisplayProps) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="p-4 border-b border-slate-700">
        <h4 className="font-medium text-slate-100 text-sm mb-3">Fundamentals</h4>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">No fundamental data available</p>
        </div>
      </div>
    )
  }

  const formatValue = (key: string, value: number) => {
    switch (key) {
      case 'Market Cap':
        if (value > 100000) return `₹${(value / 100000).toFixed(1)}L Cr`
        if (value > 1000) return `₹${(value / 1000).toFixed(1)}K Cr`
        return `₹${value.toFixed(1)} Cr`
      
      case 'EPS':
        return `₹${value.toFixed(2)}`
      
      case 'Revenue':
      case 'Profit':
        if (value > 1000) return `₹${(value / 1000).toFixed(1)}K Cr`
        return `₹${value.toFixed(1)} Cr`
      
      case 'P/E':
      case 'Debt/Equity':
      case 'ROE':
        return value.toFixed(2)
      
      case 'Book Value':
        return `₹${value.toFixed(2)}`
      
      default:
        return value.toFixed(2)
    }
  }

  const getValueColor = (key: string, value: number) => {
    switch (key) {
      case 'P/E':
        if (value > 30) return 'text-red-400'
        if (value < 15) return 'text-green-400'
        return 'text-slate-100'
      
      case 'Debt/Equity':
        if (value > 1) return 'text-red-400'
        if (value < 0.3) return 'text-green-400'
        return 'text-slate-100'
      
      case 'ROE':
        if (value > 15) return 'text-green-400'
        if (value < 10) return 'text-red-400'
        return 'text-slate-100'
      
      default:
        return 'text-slate-100'
    }
  }

  const getHealthIndicator = (key: string, value: number) => {
    switch (key) {
      case 'P/E':
        if (value > 30) return '📉'
        if (value < 15) return '📈'
        return '➡️'
      
      case 'Debt/Equity':
        if (value > 1) return '⚠️'
        if (value < 0.3) return '✅'
        return '➡️'
      
      case 'ROE':
        if (value > 15) return '✅'
        if (value < 10) return '⚠️'
        return '➡️'
      
      default:
        return ''
    }
  }

  // Map display names to data keys
  const fundamentalKeys = [
    { display: 'P/E Ratio', key: 'P/E' },
    { display: 'EPS', key: 'EPS' },
    { display: 'Market Cap', key: 'Market Cap' },
    { display: 'Book Value', key: 'Book Value' },
    { display: 'Debt/Equity', key: 'Debt/Equity' },
    { display: 'ROE', key: 'ROE' },
    { display: 'Revenue', key: 'Revenue' },
    { display: 'Profit', key: 'Profit' }
  ]

  const availableData = fundamentalKeys.filter(item => 
    data[item.key] !== undefined && data[item.key] !== null
  )

  return (
    <div className="p-4 border-b border-slate-700">
      <h4 className="font-medium text-slate-100 text-sm mb-3">Fundamentals</h4>
      
      {availableData.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">No fundamental data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {availableData.map((item) => {
            const value = data[item.key]
            const healthIndicator = getHealthIndicator(item.key, value)
            
            return (
              <div key={item.key} className="bg-slate-800 rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-slate-400">{item.display}</div>
                  {healthIndicator && (
                    <span className="text-xs">{healthIndicator}</span>
                  )}
                </div>
                <div className={`text-sm font-mono ${getValueColor(item.key, value)}`}>
                  {formatValue(item.key, value)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Fundamental Analysis Summary */}
      {availableData.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-2">Quick Assessment</div>
          <div className="space-y-1">
            {data['P/E'] && (
              <div className="text-xs">
                <span className="text-slate-400">Valuation:</span>
                <span className={`ml-1 ${getValueColor('P/E', data['P/E'])}`}>
                  {data['P/E'] > 30 ? 'Expensive' : data['P/E'] < 15 ? 'Undervalued' : 'Fair'}
                </span>
              </div>
            )}
            
            {data['Debt/Equity'] && (
              <div className="text-xs">
                <span className="text-slate-400">Debt Level:</span>
                <span className={`ml-1 ${getValueColor('Debt/Equity', data['Debt/Equity'])}`}>
                  {data['Debt/Equity'] > 1 ? 'High' : data['Debt/Equity'] < 0.3 ? 'Low' : 'Moderate'}
                </span>
              </div>
            )}
            
            {data['ROE'] && (
              <div className="text-xs">
                <span className="text-slate-400">Profitability:</span>
                <span className={`ml-1 ${getValueColor('ROE', data['ROE'])}`}>
                  {data['ROE'] > 15 ? 'Excellent' : data['ROE'] < 10 ? 'Poor' : 'Good'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
