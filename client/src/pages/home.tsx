import { Download, Brain, Target, MessageCircle, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">StockSense AI</h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Ready for Chrome
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Trading Assistant
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get intelligent buy/sell recommendations and interactive chat for stock analysis 
            on Indian trading platforms with Google Gemini AI.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-5 w-5" />
              Install Extension
            </Button>
            <Button variant="outline" size="lg">
              <a href="/test-page.html" className="flex items-center">
                View Demo
              </a>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-blue-600" />
                AI-Powered Analysis
              </CardTitle>
              <CardDescription>
                Google Gemini 2.5 Flash provides intelligent market insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Real-time pattern detection</li>
                <li>• Technical indicator analysis</li>
                <li>• Buy/Sell/Hold recommendations</li>
                <li>• Risk assessment with confidence scores</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-green-600" />
                Multi-Platform Support
              </CardTitle>
              <CardDescription>
                Works seamlessly across major Indian trading platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Zerodha Kite integration</li>
                <li>• Groww platform support</li>
                <li>• AngelOne compatibility</li>
                <li>• Automatic stock detection</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-purple-600" />
                Interactive Chat
              </CardTitle>
              <CardDescription>
                Ask questions and get instant AI-powered responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Context-aware conversations</li>
                <li>• Stock-specific Q&A</li>
                <li>• Trading strategy insights</li>
                <li>• Educational explanations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-orange-600" />
                Technical Analysis
              </CardTitle>
              <CardDescription>
                Comprehensive technical indicators and pattern recognition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Candlestick pattern detection</li>
                <li>• RSI, MACD, moving averages</li>
                <li>• Support/resistance levels</li>
                <li>• Volume analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-red-600" />
                Learning Mode
              </CardTitle>
              <CardDescription>
                Educational overlays to improve your trading knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Pattern name overlays</li>
                <li>• Educational tooltips</li>
                <li>• Confidence scoring</li>
                <li>• Visual pattern indicators</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Installation Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Installation Guide
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Get Gemini API Key</h4>
              <p className="text-gray-600 text-sm">
                Visit Google AI Studio and create your free API key
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">Install Extension</h4>
              <p className="text-gray-600 text-sm">
                Load the extension in Chrome developer mode
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Start Trading</h4>
              <p className="text-gray-600 text-sm">
                Visit any supported platform and see AI analysis
              </p>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Extension Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-800 font-medium">Ready for Testing</span>
              </div>
              <p className="text-green-700 mb-4">
                The StockSense AI extension has been successfully built and is ready for deployment.
                All core features are implemented and tested.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                  <a href="/test-page.html">View Test Page</a>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Download Extension Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 StockSense AI. Built with React, Plasmo, and Google Gemini AI.</p>
          <p className="text-gray-400 mt-2">
            For educational and informational purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}