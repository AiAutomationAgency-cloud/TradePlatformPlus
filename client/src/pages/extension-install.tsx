import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { 
  Brain, 
  Crown, 
  MessageSquare, 
  BarChart3, 
  LogOut,
  ArrowLeft,
  Download,
  Chrome,
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Settings,
  Zap
} from "lucide-react";

export default function ExtensionInstall() {
  const { user, isPremium, isAuthenticated } = useAuth();
  const logout = useLogout();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const manifestContent = `{
  "manifest_version": 3,
  "name": "StockSense AI",
  "version": "1.0.0",
  "description": "AI-powered trading assistant for Indian stock platforms",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "https://kite.zerodha.com/*",
    "https://groww.in/*",
    "https://web.angelone.in/*"
  ],
  "content_scripts": [
    {
      "matches": [
        "https://kite.zerodha.com/*",
        "https://groww.in/*", 
        "https://web.angelone.in/*"
      ],
      "js": ["content.js"]
    }
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_title": "StockSense AI"
  },
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            )}
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Extension Installation</span>
            {isPremium && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <nav className="flex space-x-4">
                  <Link href="/chat">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </Link>
                  <Link href="/analytics">
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                </nav>
                <Button variant="ghost" size="sm" onClick={() => logout.mutate()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Install StockSense AI Extension</h1>
          <p className="text-gray-600">Follow these steps to install the browser extension and start analyzing stocks</p>
        </div>

        {!isAuthenticated && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You'll need to <Link href="/auth" className="font-medium underline">sign in</Link> to use all extension features and sync your data.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="chrome" className="space-y-6">
          <TabsList>
            <TabsTrigger value="chrome">Chrome Installation</TabsTrigger>
            <TabsTrigger value="features">Extension Features</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="chrome" className="space-y-6">
            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Google Chrome browser (version 88 or higher)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span>Google Gemini API key (required for AI features)</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                        Get API Key
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Developer mode enabled in Chrome</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Installation Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Installation Steps</CardTitle>
                <CardDescription>Follow these steps to install the extension</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">1</span>
                      Enable Developer Mode
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Open Chrome and navigate to <code className="bg-gray-100 px-2 py-1 rounded">chrome://extensions/</code>
                    </p>
                    <p className="text-gray-600 mb-3">
                      Toggle "Developer mode" in the top-right corner
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">2</span>
                      Download Extension Files
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Download the StockSense AI extension package
                    </p>
                    <Button className="mb-3">
                      <Download className="w-4 h-4 mr-2" />
                      Download Extension.zip
                    </Button>
                    <p className="text-sm text-gray-500">
                      Extract the ZIP file to a folder on your computer
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">
                      <span className="bg-purple-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">3</span>
                      Load Extension
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Click "Load unpacked" and select the extracted folder
                    </p>
                    <p className="text-gray-600">
                      The StockSense AI extension should now appear in your extensions list
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">4</span>
                      Configure API Key
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Click on the extension icon and enter your Google Gemini API key
                    </p>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your API key is stored locally and never shared. It's only used to connect to Google's AI services.
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Step 5 */}
                  <div className="border-l-4 border-teal-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">
                      <span className="bg-teal-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">5</span>
                      Start Trading
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Visit any supported platform and start getting AI-powered insights:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://kite.zerodha.com" target="_blank" rel="noopener noreferrer">
                          Zerodha Kite
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://groww.in" target="_blank" rel="noopener noreferrer">
                          Groww
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://web.angelone.in" target="_blank" rel="noopener noreferrer">
                          AngelOne
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test the Extension */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Test the Extension
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Want to see the extension in action before installing? Try our demo page:
                </p>
                <Button variant="outline" asChild>
                  <a href="/test-page.html" target="_blank">
                    Open Demo Page
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    AI-Powered Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time buy/sell/hold recommendations</li>
                    <li>• Confidence scoring for all predictions</li>
                    <li>• Context-aware market analysis</li>
                    <li>• Risk assessment and alerts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Pattern Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Candlestick pattern recognition</li>
                    <li>• Technical indicator overlays</li>
                    <li>• Support and resistance levels</li>
                    <li>• Volume analysis</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                    Interactive Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Ask questions about any stock</li>
                    <li>• Get educational explanations</li>
                    <li>• Trading strategy recommendations</li>
                    <li>• Market news and insights</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-orange-600" />
                    Customization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Toggle analysis overlays</li>
                    <li>• Learning mode for beginners</li>
                    <li>• Customizable alerts and notifications</li>
                    <li>• Dark/light theme support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Extension not loading</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Make sure Developer mode is enabled in Chrome</li>
                      <li>Check that all extension files are in the same folder</li>
                      <li>Try refreshing the extensions page</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">AI features not working</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Verify your Google Gemini API key is correctly entered</li>
                      <li>Check your internet connection</li>
                      <li>Make sure you have API quota remaining</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Platform not detected</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Make sure you're on a supported platform (Zerodha, Groww, AngelOne)</li>
                      <li>Refresh the trading platform page</li>
                      <li>Check browser console for any error messages</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Need more help?</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      If you're still experiencing issues, please contact our support team:
                    </p>
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}