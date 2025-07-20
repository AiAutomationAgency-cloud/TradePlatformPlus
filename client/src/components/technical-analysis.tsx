import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Eye,
  BookOpen
} from "lucide-react";

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  description: string;
  confidence: number;
}

interface PatternDetection {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  description: string;
  action: 'BUY' | 'SELL' | 'HOLD' | 'WAIT';
  timeframe: string;
}

interface SupportResistance {
  support: number[];
  resistance: number[];
  current: number;
}

export default function TechnicalAnalysis({ symbol = "RELIANCE" }: { symbol?: string }) {
  const [learningMode, setLearningMode] = useState(false);
  
  // Fetch technical analysis data
  const { data: technicalData, isLoading } = useQuery({
    queryKey: ["/api/analysis/technical", symbol],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch pattern recognition data
  const { data: patternData } = useQuery({
    queryKey: ["/api/patterns"],
    refetchInterval: 30000,
  });

  // Fetch fundamental analysis data
  const { data: fundamentalData } = useQuery({
    queryKey: ["/api/fundamentals", symbol],
    refetchInterval: 60000, // Refresh every minute
  });

  const indicators: TechnicalIndicator[] = technicalData?.indicators || [
    {
      name: "RSI (14)",
      value: 68.5,
      signal: "bullish",
      description: "Relative Strength Index indicates momentum",
      confidence: 0.82
    },
    {
      name: "MACD",
      value: 12.3,
      signal: "bullish", 
      description: "Moving Average Convergence Divergence shows trend strength",
      confidence: 0.75
    },
    {
      name: "SMA (20)",
      value: 2847.5,
      signal: "bullish",
      description: "20-day Simple Moving Average trend line",
      confidence: 0.71
    },
    {
      name: "Bollinger Bands",
      value: 0.65,
      signal: "neutral",
      description: "Price volatility and momentum indicator",
      confidence: 0.58
    }
  ];

  const patterns: PatternDetection[] = patternData?.patterns || technicalData?.patterns || [];

  const supportResistance: SupportResistance = technicalData?.levels || {
    support: [2820, 2790, 2745],
    resistance: [2890, 2925, 2965],
    current: 2856
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return 'bg-green-100 text-green-800';
      case 'bearish':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'bg-green-100 text-green-800';
      case 'SELL':
        return 'bg-red-100 text-red-800';
      case 'HOLD':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Learning Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Technical Analysis</h2>
          <p className="text-gray-600 mt-1">Comprehensive analysis for {symbol}</p>
        </div>
        <Button
          variant={learningMode ? "default" : "outline"}
          onClick={() => setLearningMode(!learningMode)}
          className="flex items-center space-x-2"
        >
          {learningMode ? <Eye className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
          <span>{learningMode ? "Exit Learning" : "Learning Mode"}</span>
        </Button>
      </div>

      <Tabs defaultValue="indicators" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
          <TabsTrigger value="patterns">Candlestick Patterns</TabsTrigger>
          <TabsTrigger value="fundamentals">Fundamental Analysis</TabsTrigger>
          <TabsTrigger value="levels">Support & Resistance</TabsTrigger>
          <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="indicators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicators.map((indicator, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{indicator.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getSignalIcon(indicator.signal)}
                      <Badge className={getSignalColor(indicator.signal)}>
                        {indicator.signal.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  {learningMode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                      <p className="text-sm text-blue-800">{indicator.description}</p>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {indicator.value.toFixed(2)}
                      </span>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Confidence</div>
                        <div className="font-semibold text-gray-900">
                          {(indicator.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <Progress value={indicator.confidence * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          {patterns.map((pattern, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{pattern.name}</CardTitle>
                    <CardDescription>{pattern.timeframe} • Confidence: {pattern.confidence}%</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getActionColor(pattern.action)}>
                      {pattern.action}
                    </Badge>
                    <Badge variant="outline" className={`${pattern.type === 'bullish' ? 'border-green-500 text-green-700' : 
                      pattern.type === 'bearish' ? 'border-red-500 text-red-700' : 'border-gray-500 text-gray-700'}`}>
                      {pattern.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                {learningMode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                    <div className="flex items-start space-x-2">
                      <BookOpen className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <p className="text-sm text-yellow-800">{pattern.description}</p>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Progress value={pattern.confidence * 100} className="h-3" />
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {(pattern.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="levels" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-red-800 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Resistance Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {supportResistance.resistance.map((level, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="text-sm text-gray-600">R{index + 1}</span>
                      <span className="font-semibold text-gray-900">₹{level.toFixed(2)}</span>
                      <span className="text-xs text-red-600">
                        +{((level - supportResistance.current) / supportResistance.current * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Current Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    ₹{supportResistance.current.toFixed(2)}
                  </div>
                  <div className="text-sm text-blue-600">
                    Live market price
                  </div>
                  {learningMode && (
                    <div className="mt-3 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                      Price relative to support/resistance levels helps identify potential reversal points
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Support Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {supportResistance.support.map((level, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="text-sm text-gray-600">S{index + 1}</span>
                      <span className="font-semibold text-gray-900">₹{level.toFixed(2)}</span>
                      <span className="text-xs text-green-600">
                        {((level - supportResistance.current) / supportResistance.current * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fundamentals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fundamentalData?.fundamentals && Object.entries(fundamentalData.fundamentals).map(([key, value]) => {
              const formatValue = (key: string, val: any) => {
                if (key.includes('Market Cap') || key.includes('Revenue') || key.includes('Profit')) {
                  if (val > 100000) return `₹${(val / 100000).toFixed(1)}L Cr`;
                  if (val > 1000) return `₹${(val / 1000).toFixed(1)}K Cr`;
                  return `₹${val.toFixed(1)} Cr`;
                } else if (key.includes('EPS') || key.includes('Book Value')) {
                  return `₹${val.toFixed(2)}`;
                } else if (key.includes('52W')) {
                  return `₹${val.toFixed(2)}`;
                } else if (key.includes('Dividend Yield') || key.includes('ROE')) {
                  return `${val.toFixed(2)}%`;
                } else {
                  return val.toFixed(2);
                }
              };

              const getHealthColor = (key: string, val: any) => {
                if (key.includes('P/E')) {
                  if (val > 30) return 'text-red-600';
                  if (val < 15) return 'text-green-600';
                  return 'text-blue-600';
                } else if (key.includes('Debt/Equity')) {
                  if (val > 1) return 'text-red-600';
                  if (val < 0.3) return 'text-green-600';
                  return 'text-blue-600';
                } else if (key.includes('ROE')) {
                  if (val > 15) return 'text-green-600';
                  if (val < 10) return 'text-red-600';
                  return 'text-blue-600';
                } else {
                  return 'text-gray-800';
                }
              };

              return (
                <Card key={key} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{key}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getHealthColor(key, value)}`}>
                      {formatValue(key, value)}
                    </div>
                    {learningMode && (
                      <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        {key.includes('P/E') && 'Price-to-Earnings ratio measures valuation'}
                        {key.includes('EPS') && 'Earnings per Share shows profitability per share'}
                        {key.includes('Market Cap') && 'Total market value of company shares'}
                        {key.includes('ROE') && 'Return on Equity measures profitability efficiency'}
                        {key.includes('Debt/Equity') && 'Company debt relative to shareholder equity'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Volume Analysis
              </CardTitle>
              <CardDescription>
                Volume trends and patterns for {symbol}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Volume (20D)</span>
                    <span className="font-semibold">2.4M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Volume</span>
                    <span className="font-semibold text-green-600">3.1M (+29%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Volume Trend</span>
                    <Badge className="bg-green-100 text-green-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Increasing
                    </Badge>
                  </div>
                </div>
                
                {learningMode && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Volume Insights</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• High volume confirms price movements</li>
                      <li>• Above-average volume indicates strong interest</li>
                      <li>• Volume spikes often precede major moves</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}