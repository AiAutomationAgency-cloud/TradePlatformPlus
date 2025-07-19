import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { 
  Brain, 
  BarChart3, 
  MessageSquare, 
  Crown, 
  Download,
  LogOut,
  ArrowLeft,
  TrendingUp,
  Activity,
  Target,
  AlertCircle
} from "lucide-react";

export default function Analytics() {
  const { user, isPremium } = useAuth();
  const logout = useLogout();

  // Fetch user's analyses and patterns
  const { data: analysesData } = useQuery({
    queryKey: ["/api/analysis/stock"],
  });

  const { data: patternsData } = useQuery({
    queryKey: ["/api/patterns"],
  });

  const analyses = analysesData?.analyses || [];
  const patterns = patternsData?.patterns || [];

  const totalAnalyses = analyses.length;
  const successfulTrades = analyses.filter((a: any) => a.confidence > 70).length;
  const successRate = totalAnalyses > 0 ? Math.round((successfulTrades / totalAnalyses) * 100) : 0;

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
            <span className="text-xl font-bold text-gray-900">Analytics</span>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trading Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your trading performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                All-time stock analyses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-muted-foreground">
                High confidence predictions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patterns Detected</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patterns.length}</div>
              <p className="text-xs text-muted-foreground">
                Candlestick patterns found
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.apiUsageCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                Today's usage count
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analyses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analyses">Stock Analyses</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="analyses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Analyses</CardTitle>
                <CardDescription>Your latest AI-powered stock evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                {analyses.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No analyses yet</h3>
                    <p className="text-gray-600 mb-4">
                      Install the browser extension to start analyzing stocks
                    </p>
                    <Link href="/extension">
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Install Extension
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analyses.map((analysis: any) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">{analysis.symbol}</h4>
                            <Badge variant="outline">{analysis.platform}</Badge>
                            <Badge variant="outline">{analysis.analysisType}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(analysis.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge variant={
                              analysis.recommendation === "BUY" ? "default" :
                              analysis.recommendation === "SELL" ? "destructive" : "secondary"
                            }>
                              {analysis.recommendation}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">
                              {analysis.confidence}% confidence
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pattern Detection History</CardTitle>
                <CardDescription>Candlestick patterns identified by AI</CardDescription>
              </CardHeader>
              <CardContent>
                {patterns.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No patterns detected</h3>
                    <p className="text-gray-600 mb-4">
                      Start analyzing stocks to detect candlestick patterns
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patterns.map((pattern: any) => (
                      <div key={pattern.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">{pattern.symbol}</h4>
                            <Badge variant="outline">{pattern.patternType}</Badge>
                            {pattern.timeframe && (
                              <Badge variant="secondary">{pattern.timeframe}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(pattern.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{pattern.confidence}%</div>
                          <p className="text-sm text-gray-500">confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Track your trading analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Analysis Accuracy</label>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${successRate}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">{successRate}% success rate</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Daily Usage</label>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${user ? (user.apiUsageCount / user.dailyUsageLimit) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {user?.apiUsageCount || 0} / {user?.dailyUsageLimit || 10} API calls
                      </p>
                    </div>
                  </div>

                  {!isPremium && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Upgrade to Premium</h4>
                          <p className="text-sm text-yellow-700">
                            Get unlimited API calls, advanced analytics, and priority support
                          </p>
                        </div>
                        <Link href="/premium" className="ml-auto">
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                            Upgrade Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}