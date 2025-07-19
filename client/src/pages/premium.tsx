import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Crown, 
  MessageSquare, 
  BarChart3, 
  Download,
  LogOut,
  ArrowLeft,
  Check,
  Zap,
  Shield,
  Star,
  Infinity
} from "lucide-react";

export default function Premium() {
  const { user, isPremium } = useAuth();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Premium upgrade mutation
  const upgradePremium = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/premium/upgrade");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Welcome to Premium!",
        description: "Your account has been upgraded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to upgrade account",
        variant: "destructive",
      });
    },
  });

  const freeFeatures = [
    "10 AI analyses per day",
    "Basic pattern detection",
    "Chat with AI assistant",
    "Extension access",
    "Basic technical indicators"
  ];

  const premiumFeatures = [
    "Unlimited AI analyses",
    "Advanced pattern detection",
    "Priority AI responses",
    "Real-time alerts",
    "Advanced technical indicators",
    "Portfolio tracking",
    "Risk management tools",
    "Priority support",
    "Export data & reports",
    "Custom notifications"
  ];

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
            <span className="text-xl font-bold text-gray-900">Premium Plans</span>
            {isPremium && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Crown className="w-3 h-3 mr-1" />
                Premium Active
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
            </nav>
            <Button variant="ghost" size="sm" onClick={() => logout.mutate()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-yellow-100 text-yellow-800">
            <Crown className="w-3 h-3 mr-1" />
            Premium Features
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock the Full Power of StockSense AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to AI-powered trading insights, advanced analytics, 
            and premium features to maximize your trading potential.
          </p>
        </div>

        {/* Current Plan Status */}
        {isPremium ? (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <Crown className="w-5 h-5 mr-2" />
                Premium Account Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-700">
                    You're currently enjoying all premium features!
                  </p>
                  {user?.premiumUntil && (
                    <p className="text-sm text-yellow-600 mt-1">
                      Valid until: {new Date(user.premiumUntil).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Free Plan
              </CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">₹0<span className="text-lg font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {!isPremium && (
                <Badge variant="outline" className="w-full justify-center py-2">
                  Current Plan
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-yellow-300 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-yellow-500 text-white px-4 py-1">
                <Crown className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-600" />
                Premium Plan
              </CardTitle>
              <CardDescription>For serious traders and investors</CardDescription>
              <div className="text-3xl font-bold">
                ₹999
                <span className="text-lg font-normal">/year</span>
                <div className="text-sm text-gray-500 font-normal">
                  Save 60% vs monthly billing
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {!isPremium ? (
                <Button 
                  className="w-full bg-yellow-600 hover:bg-yellow-700" 
                  size="lg"
                  onClick={() => upgradePremium.mutate()}
                  disabled={upgradePremium.isPending}
                >
                  {upgradePremium.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Crown className="w-4 h-4 mr-2" />
                  )}
                  {upgradePremium.isPending ? "Upgrading..." : "Upgrade to Premium"}
                </Button>
              ) : (
                <Badge className="w-full justify-center py-2 bg-yellow-100 text-yellow-800">
                  <Crown className="w-3 h-3 mr-1" />
                  Current Plan
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>See what's included in each plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Free</th>
                    <th className="text-center py-3 px-4">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Daily AI Analyses</td>
                    <td className="text-center py-3 px-4">10</td>
                    <td className="text-center py-3 px-4">
                      <Infinity className="w-4 h-4 mx-auto text-yellow-600" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Pattern Detection</td>
                    <td className="text-center py-3 px-4">
                      <Check className="w-4 h-4 mx-auto text-green-500" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Check className="w-4 h-4 mx-auto text-green-500" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Real-time Alerts</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">
                      <Check className="w-4 h-4 mx-auto text-green-500" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Portfolio Tracking</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">
                      <Check className="w-4 h-4 mx-auto text-green-500" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Priority Support</td>
                    <td className="text-center py-3 px-4">-</td>
                    <td className="text-center py-3 px-4">
                      <Check className="w-4 h-4 mx-auto text-green-500" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Unlimited Power</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No daily limits on AI analyses. Analyze as many stocks as you want, 
                whenever you want.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Advanced Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get sophisticated risk management tools and alerts to protect 
                your investments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="w-8 h-8 text-yellow-600 mb-2" />
              <CardTitle>Priority Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get priority customer support and access to exclusive features 
                and updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}