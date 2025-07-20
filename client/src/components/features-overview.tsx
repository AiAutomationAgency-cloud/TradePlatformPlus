import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  BarChart3, 
  GraduationCap,
  CheckCircle,
  Globe,
  Zap,
  Target,
  BookOpen,
  Activity,
  Eye
} from "lucide-react";

export default function FeaturesOverview() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Google Gemini 2.5 Flash provides intelligent market insights",
      color: "blue",
      features: [
        "Real-time pattern detection",
        "Technical indicator analysis", 
        "Buy/Sell/Hold recommendations",
        "Risk assessment with confidence scores"
      ]
    },
    {
      icon: Globe,
      title: "Multi-Platform Support", 
      description: "Works seamlessly across major Indian trading platforms",
      color: "green",
      features: [
        "Zerodha Kite integration",
        "Groww platform support",
        "AngelOne compatibility", 
        "Automatic stock detection"
      ]
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat",
      description: "Ask questions and get instant AI-powered responses",
      color: "purple",
      features: [
        "Context-aware conversations",
        "Stock-specific Q&A",
        "Trading strategy insights",
        "Educational explanations"
      ]
    },
    {
      icon: BarChart3,
      title: "Technical Analysis",
      description: "Comprehensive technical indicators and pattern recognition",
      color: "orange", 
      features: [
        "Candlestick pattern detection",
        "RSI, MACD, moving averages",
        "Support/resistance levels",
        "Volume analysis"
      ]
    },
    {
      icon: GraduationCap,
      title: "Learning Mode",
      description: "Educational overlays to improve your trading knowledge",
      color: "red",
      features: [
        "Pattern name overlays",
        "Educational tooltips", 
        "Confidence scoring",
        "Visual pattern indicators"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "border-blue-200 bg-blue-50",
      green: "border-green-200 bg-green-50", 
      purple: "border-purple-200 bg-purple-50",
      orange: "border-orange-200 bg-orange-50",
      red: "border-red-200 bg-red-50"
    };
    return colorMap[color as keyof typeof colorMap] || "border-gray-200 bg-gray-50";
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600", 
      orange: "text-orange-600",
      red: "text-red-600"
    };
    return colorMap[color as keyof typeof colorMap] || "text-gray-600";
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Trading Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            StockSense AI combines advanced artificial intelligence with comprehensive technical analysis 
            to provide you with the insights you need for confident trading decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className={`h-full border-2 ${getColorClasses(feature.color)} hover:shadow-lg transition-shadow`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                      <IconComponent className={`w-6 h-6 ${getIconColor(feature.color)}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional feature highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Analysis</h3>
            <p className="text-sm text-gray-600">
              Get instant analysis as market conditions change with live pattern detection.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Precision Targeting</h3>
            <p className="text-sm text-gray-600">
              AI-powered entry and exit points with confidence scores for better timing.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Educational</h3>
            <p className="text-sm text-gray-600">
              Learn while you trade with explanations for every pattern and recommendation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}