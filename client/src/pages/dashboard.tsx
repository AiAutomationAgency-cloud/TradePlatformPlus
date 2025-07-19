import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
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
  Zap
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

        {/* Usage Stats */}
        {!isPremium && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <Activity className="w-5 h-5 mr-2" />
                Daily Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>API Calls Used</span>
                  <span>{user?.apiUsageCount || 0} / {user?.dailyUsageLimit || 10}</span>
                </div>
                <Progress value={usagePercentage} className="w-full" />
                {usagePercentage > 80 && (
                  <div className="flex items-center text-sm text-orange-600">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Consider upgrading to Premium for unlimited usage
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with common tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/chat">
                    <Button className="w-full h-20 flex flex-col" variant="outline">
                      <MessageSquare className="w-6 h-6 mb-2" />
                      <span>Start AI Chat</span>
                    </Button>
                  </Link>
                  <Link href="/extension">
                    <Button className="w-full h-20 flex flex-col" variant="outline">
                      <Download className="w-6 h-6 mb-2" />
                      <span>Install Extension</span>
                    </Button>
                  </Link>
                  <Link href="/analytics">
                    <Button className="w-full h-20 flex flex-col" variant="outline">
                      <BarChart3 className="w-6 h-6 mb-2" />
                      <span>View Analytics</span>
                    </Button>
                  </Link>
                  {!isPremium && (
                    <Button
                      className="w-full h-20 flex flex-col bg-yellow-500 hover:bg-yellow-600"
                      onClick={() => upgradePremium.mutate()}
                      disabled={upgradePremium.isPending}
                    >
                      <Crown className="w-6 h-6 mb-2" />
                      <span>{upgradePremium.isPending ? "Upgrading..." : "Go Premium"}</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Analysis</CardTitle>
                <CardDescription>Your latest stock analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                {analyses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No analysis yet</p>
                    <p className="text-sm">Install the extension to start analyzing stocks</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analyses.slice(0, 5).map((analysis: any) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{analysis.symbol}</h4>
                          <p className="text-sm text-gray-500">{analysis.platform}</p>
                        </div>
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
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Demo Data */}
            {stockData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Live Demo Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{stockData.symbol}</span>
                        <Badge variant={stockData.change > 0 ? "default" : "destructive"}>
                          {stockData.change > 0 ? "+" : ""}{stockData.changePercent}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">₹{stockData.price}</div>
                      <div className="text-sm text-gray-500">
                        Vol: {stockData.volume.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Technical Indicators</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>RSI: {stockData.technicalIndicators.rsi}</div>
                        <div>MACD: {stockData.technicalIndicators.macd}</div>
                        <div>SMA20: ₹{stockData.technicalIndicators.sma20}</div>
                        <div>SMA50: ₹{stockData.technicalIndicators.sma50}</div>
                      </div>
                    </div>

                    {stockData.patterns && stockData.patterns.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Detected Patterns</h4>
                        {stockData.patterns.map((pattern: any, index: number) => (
                          <Badge key={index} variant="outline" className="mr-2">
                            {pattern.type} ({pattern.confidence}%)
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feature Status */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Extension Installed</span>
                  {user?.extensionInstalled ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Link href="/extension">
                      <Button size="sm" variant="outline">Install</Button>
                    </Link>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Chat Access</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Premium Features</span>
                  {isPremium ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Link href="/premium">
                      <Button size="sm" variant="outline">Upgrade</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}