import { Link } from "wouter";
import { Download, Brain, Target, MessageCircle, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FeaturesOverview from "@/components/features-overview";

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
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ready for Chrome
              </Badge>
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            </div>
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
            <Link href="/extension">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-5 w-5" />
                Install Extension
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <a href="/test-page.html" className="flex items-center">
                View Demo
              </a>
            </Button>
          </div>
        </div>

        {/* Features Overview Component */}
        <FeaturesOverview />
        
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
      </main>
    </div>
  );
}