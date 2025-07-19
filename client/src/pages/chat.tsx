import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chatbot } from "@/components/chat/chatbot";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Crown, 
  Download,
  LogOut,
  ArrowLeft
} from "lucide-react";

export default function Chat() {
  const { user, isPremium } = useAuth();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">StockSense AI Chat</span>
            {isPremium && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <Link href="/analytics">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/extension">
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Extension
                </Button>
              </Link>
              {!isPremium && (
                <Link href="/premium">
                  <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-600">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade
                  </Button>
                </Link>
              )}
            </nav>
            <Button variant="ghost" size="sm" onClick={() => logout.mutate()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Trading Assistant</h1>
          <p className="text-gray-600">Ask questions about stocks, patterns, and trading strategies</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <Chatbot />
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Pattern Analysis</h3>
            <p className="text-sm text-gray-600">Ask about specific candlestick patterns like "What does a hammer pattern indicate?"</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Stock Analysis</h3>
            <p className="text-sm text-gray-600">Get insights on stocks: "Should I buy RELIANCE at current levels?"</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Risk Management</h3>
            <p className="text-sm text-gray-600">Learn about risk: "How should I manage risk in volatile markets?"</p>
          </div>
        </div>
      </div>
    </div>
  );
}