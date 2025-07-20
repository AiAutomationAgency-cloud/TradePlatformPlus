import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Eye, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Lightbulb,
  Award,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface PatternTutorial {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  description: string;
  characteristics: string[];
  significance: string;
  exampleImage?: string;
  confidence: number;
  examples: {
    stock: string;
    date: string;
    outcome: 'success' | 'failure';
    gain: number;
  }[];
}

interface LearningProgress {
  totalPatterns: number;
  learnedPatterns: number;
  practiceScore: number;
  streakDays: number;
  achievements: string[];
}

export default function LearningMode() {
  const [isLearningModeActive, setIsLearningModeActive] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string>("bullish-engulfing");
  const [showOverlays, setShowOverlays] = useState(true);
  const [showConfidenceScoring, setShowConfidenceScoring] = useState(true);
  const [showTooltips, setShowTooltips] = useState(true);

  const patterns: PatternTutorial[] = [
    {
      id: "bullish-engulfing",
      name: "Bullish Engulfing",
      type: "bullish",
      description: "A powerful reversal pattern where a large bullish candle completely engulfs the previous bearish candle.",
      characteristics: [
        "Previous candle is bearish (red)",
        "Current candle is bullish (green)",
        "Current candle's body completely covers previous candle's body",
        "Occurs after a downtrend",
        "Higher volume confirms the pattern"
      ],
      significance: "Strong buy signal indicating potential trend reversal from bearish to bullish",
      confidence: 0.85,
      examples: [
        { stock: "RELIANCE", date: "2025-01-15", outcome: "success", gain: 8.5 },
        { stock: "TCS", date: "2025-01-10", outcome: "success", gain: 6.2 },
        { stock: "INFY", date: "2025-01-08", outcome: "failure", gain: -2.1 }
      ]
    },
    {
      id: "bearish-engulfing",
      name: "Bearish Engulfing",
      type: "bearish",
      description: "A reversal pattern where a large bearish candle engulfs the previous bullish candle.",
      characteristics: [
        "Previous candle is bullish (green)",
        "Current candle is bearish (red)",
        "Current candle's body completely covers previous candle's body",
        "Occurs after an uptrend",
        "Higher volume confirms the pattern"
      ],
      significance: "Strong sell signal indicating potential trend reversal from bullish to bearish",
      confidence: 0.82,
      examples: [
        { stock: "HDFC", date: "2025-01-12", outcome: "success", gain: 7.3 },
        { stock: "ICICI", date: "2025-01-09", outcome: "success", gain: 5.8 }
      ]
    },
    {
      id: "doji",
      name: "Doji",
      type: "neutral",
      description: "An indecision pattern where open and close prices are very close, creating a cross-like shape.",
      characteristics: [
        "Open and close prices are nearly equal",
        "Small or non-existent body",
        "Long upper and/or lower shadows",
        "Indicates market indecision",
        "Context determines bullish or bearish bias"
      ],
      significance: "Signals potential reversal or continuation depending on trend context",
      confidence: 0.65,
      examples: [
        { stock: "SBIN", date: "2025-01-14", outcome: "success", gain: 4.2 },
        { stock: "BAJFINANCE", date: "2025-01-11", outcome: "failure", gain: -1.5 }
      ]
    },
    {
      id: "hammer",
      name: "Hammer",
      type: "bullish",
      description: "A reversal pattern with a small body and long lower shadow, resembling a hammer.",
      characteristics: [
        "Small body at the top of the range",
        "Long lower shadow (at least 2x body size)",
        "Little to no upper shadow",
        "Occurs after a downtrend",
        "Body color is less important than shape"
      ],
      significance: "Bullish reversal signal showing buyers stepping in at lower levels",
      confidence: 0.75,
      examples: [
        { stock: "MARUTI", date: "2025-01-13", outcome: "success", gain: 9.1 },
        { stock: "TATAMOTORS", date: "2025-01-07", outcome: "success", gain: 12.3 }
      ]
    },
    {
      id: "shooting-star",
      name: "Shooting Star",
      type: "bearish",
      description: "A reversal pattern with a small body and long upper shadow, resembling an inverted hammer.",
      characteristics: [
        "Small body at the bottom of the range",
        "Long upper shadow (at least 2x body size)",
        "Little to no lower shadow",
        "Occurs after an uptrend",
        "Shows rejection of higher prices"
      ],
      significance: "Bearish reversal signal indicating selling pressure at higher levels",
      confidence: 0.78,
      examples: [
        { stock: "WIPRO", date: "2025-01-16", outcome: "success", gain: 6.7 },
        { stock: "HCLTECH", date: "2025-01-06", outcome: "failure", gain: -0.8 }
      ]
    }
  ];

  const progress: LearningProgress = {
    totalPatterns: 15,
    learnedPatterns: 8,
    practiceScore: 78,
    streakDays: 5,
    achievements: ["Pattern Expert", "Week Warrior", "Accuracy Master"]
  };

  const selectedPatternData = patterns.find(p => p.id === selectedPattern);

  const getPatternTypeColor = (type: string) => {
    switch (type) {
      case 'bullish':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'bearish':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Learning Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning Mode</h2>
          <p className="text-gray-600 mt-1">
            Educational overlays to improve your trading knowledge
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Learning Active</span>
            <Switch
              checked={isLearningModeActive}
              onCheckedChange={setIsLearningModeActive}
            />
          </div>
          
          {isLearningModeActive && (
            <Badge className="bg-blue-100 text-blue-800">
              <Eye className="w-3 h-3 mr-1" />
              Learning Mode ON
            </Badge>
          )}
        </div>
      </div>

      {/* Learning Progress Overview */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Award className="w-5 h-5 mr-2" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{progress.learnedPatterns}/{progress.totalPatterns}</div>
              <div className="text-sm text-blue-700">Patterns Learned</div>
              <Progress value={(progress.learnedPatterns / progress.totalPatterns) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.practiceScore}%</div>
              <div className="text-sm text-blue-700">Practice Score</div>
              <Progress value={progress.practiceScore} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{progress.streakDays}</div>
              <div className="text-sm text-blue-700">Day Streak</div>
              <div className="mt-2 text-xs text-purple-600">Keep it up!</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{progress.achievements.length}</div>
              <div className="text-sm text-blue-700">Achievements</div>
              <div className="flex flex-wrap gap-1 mt-2 justify-center">
                {progress.achievements.slice(0, 2).map((achievement, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Mode Settings */}
      {isLearningModeActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Learning Mode Settings
            </CardTitle>
            <CardDescription>
              Customize your learning experience with visual aids and explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Pattern Name Overlays</div>
                  <div className="text-sm text-gray-600">Show pattern names on charts</div>
                </div>
                <Switch checked={showOverlays} onCheckedChange={setShowOverlays} />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Confidence Scoring</div>
                  <div className="text-sm text-gray-600">Display pattern confidence levels</div>
                </div>
                <Switch checked={showConfidenceScoring} onCheckedChange={setShowConfidenceScoring} />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Educational Tooltips</div>
                  <div className="text-sm text-gray-600">Show detailed explanations</div>
                </div>
                <Switch checked={showTooltips} onCheckedChange={setShowTooltips} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pattern Library */}
      <Tabs value={selectedPattern} onValueChange={setSelectedPattern} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pattern Library</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <PlayCircle className="w-4 h-4 mr-1" />
              Practice Quiz
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset Progress
            </Button>
          </div>
        </div>
        
        <TabsList className="grid w-full grid-cols-5">
          {patterns.map((pattern) => (
            <TabsTrigger key={pattern.id} value={pattern.id} className="flex flex-col items-center p-2">
              <div className="flex items-center space-x-1">
                {getPatternIcon(pattern.type)}
                <span className="text-xs">{pattern.name}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {patterns.map((pattern) => (
          <TabsContent key={pattern.id} value={pattern.id} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      {getPatternIcon(pattern.type)}
                      <span>{pattern.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">{pattern.description}</CardDescription>
                  </div>
                  <Badge className={`${getPatternTypeColor(pattern.type)} border`}>
                    {pattern.type.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pattern Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Characteristics</h4>
                      <ul className="space-y-1">
                        {pattern.characteristics.map((char, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Trading Significance</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {pattern.significance}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Pattern Confidence</h4>
                      <div className="flex items-center space-x-3">
                        <Progress value={pattern.confidence * 100} className="flex-1" />
                        <span className="text-sm font-medium">{(pattern.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Historical Examples */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recent Examples</h4>
                    <div className="space-y-2">
                      {pattern.examples.map((example, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{example.stock}</div>
                            <div className="text-xs text-gray-600">{example.date}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {example.outcome === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${example.gain > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {example.gain > 0 ? '+' : ''}{example.gain.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Practice & Quiz Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Interactive Learning
          </CardTitle>
          <CardDescription>
            Test your knowledge with pattern recognition quizzes and simulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <PlayCircle className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Pattern Quiz</div>
                <div className="text-xs opacity-80">Test pattern recognition skills</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Target className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Trading Simulator</div>
                <div className="text-xs opacity-80">Practice with virtual trading</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}