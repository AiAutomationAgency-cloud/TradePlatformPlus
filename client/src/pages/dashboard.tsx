import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import TechnicalAnalysis from "@/components/technical-analysis";
import AIChatInterface from "@/components/ai-chat-interface";
import MultiPlatformSupport from "@/components/multi-platform-support";
import LearningMode from "@/components/learning-mode";
import { 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  BarChart3, 
  Crown, 
  Download,
  LogOut,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Globe,
  BookOpen
} from "lucide-react";

export default function Dashboard() {
  const { user, isPremium } = useAuth();
  const logout = useLogout();
  const queryClient = useQueryClient();

  // Fetch user's recent analyses
  const { data: analysesData } = useQuery({
    queryKey: ["/api/analysis/stock"],
  });

  // Fetch demo stock data
  const { data: demoData } = useQuery({
    queryKey: ["/api/demo/stock-data"],
  });

  // Premium upgrade mutation
  const upgradePremium = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/premium/upgrade");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const analyses = analysesData?.analyses || [];
  const stockData = demoData?.data;

  const usagePercentage = user ? (user.apiUsageCount / user.dailyUsageLimit) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">StockSense AI</span>
            {isPremium && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || user?.username}!
          </h1>
          <p className="text-gray-600">Here's your trading insight dashboard</p>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Technical Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="platforms" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Multi-Platform</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Learning Mode</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Usage Stats */}
            {!isPremium && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <Activity className="w-5 h-5 mr-2" />
                    Daily Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700">API Calls Used</span>
                      <span className="font-semibold text-orange-900">
                        {user?.apiUsageCount || 0} / {user?.dailyUsageLimit || 10}
                      </span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-orange-600">
                        {usagePercentage < 80 ? "Good usage" : usagePercentage < 95 ? "Almost at limit" : "Limit reached"}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={() => upgradePremium.mutate()}
                        disabled={upgradePremium.isPending}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Upgrade to Premium
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">AI Analysis</div>
                    <div className="text-sm text-gray-600">Powered by Gemini 2.5 Flash</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">3 Platforms</div>
                    <div className="text-sm text-gray-600">Zerodha, Groww, AngelOne</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">Technical</div>
                    <div className="text-sm text-gray-600">Real-time pattern detection</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">Learning</div>
                    <div className="text-sm text-gray-600">Educational overlays</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with StockSense AI features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Link href="/extension">
                      <Download className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-medium">Install Extension</div>
                        <div className="text-xs opacity-80">Add to Chrome browser</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="h-20 flex flex-col items-center justify-center space-y-2">
                    <a href="/test-page.html" target="_blank">
                      <Zap className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-medium">Try Demo</div>
                        <div className="text-xs opacity-80">Test with sample data</div>
                      </div>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <TechnicalAnalysis />
          </TabsContent>

          <TabsContent value="chat">
            <AIChatInterface />
          </TabsContent>

          <TabsContent value="platforms">
            <MultiPlatformSupport />
          </TabsContent>

          <TabsContent value="learning">
            <LearningMode />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}