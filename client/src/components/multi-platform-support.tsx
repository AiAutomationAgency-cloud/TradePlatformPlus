import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle, 
  Globe, 
  Download, 
  ExternalLink,
  Smartphone,
  Monitor,
  Zap,
  Settings,
  Activity,
  TrendingUp,
  AlertCircle,
  Play
} from "lucide-react";

interface Platform {
  id: string;
  name: string;
  description: string;
  url: string;
  status: 'supported' | 'testing' | 'coming_soon';
  features: string[];
  logo: string;
  compatibility: {
    desktop: boolean;
    mobile: boolean;
    app: boolean;
  };
}

interface ExtensionStatus {
  installed: boolean;
  version?: string;
  permissions: string[];
  platforms: {
    [key: string]: {
      active: boolean;
      lastDetected?: string;
      stocksDetected: number;
    };
  };
}

export default function MultiPlatformSupport() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("zerodha");
  const queryClient = useQueryClient();

  // Fetch platform support data
  const { data: platformsData } = useQuery({
    queryKey: ["/api/platforms/supported"],
  });

  // Fetch extension status
  const { data: extensionStatus } = useQuery({
    queryKey: ["/api/extension/status"],
    refetchInterval: 5000, // Check every 5 seconds
  });

  // Test platform integration
  const testPlatform = useMutation({
    mutationFn: async (platformId: string) => {
      return await apiRequest("POST", "/api/platforms/test", { platformId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/extension/status"] });
    },
  });

  const platforms: Platform[] = platformsData?.platforms || [
    {
      id: "zerodha",
      name: "Zerodha Kite",
      description: "India's largest discount broker with comprehensive trading platform",
      url: "https://kite.zerodha.com",
      status: "supported",
      features: [
        "Real-time data extraction",
        "Order book analysis", 
        "Chart pattern detection",
        "Position monitoring",
        "P&L tracking"
      ],
      logo: "🔷",
      compatibility: {
        desktop: true,
        mobile: true,
        app: false
      }
    },
    {
      id: "groww",
      name: "Groww",
      description: "Popular investment platform for stocks and mutual funds",
      url: "https://groww.in",
      status: "supported",
      features: [
        "Stock price monitoring",
        "Portfolio analysis",
        "Investment tracking",
        "Market alerts",
        "SIP recommendations"
      ],
      logo: "💚",
      compatibility: {
        desktop: true,
        mobile: true,
        app: false
      }
    },
    {
      id: "angelone",
      name: "Angel One",
      description: "Full-service broker with advanced trading tools",
      url: "https://trade.angelone.in",
      status: "supported",
      features: [
        "Advanced charting",
        "Technical indicators",
        "Options chain analysis",
        "Market depth",
        "Research reports"
      ],
      logo: "👼",
      compatibility: {
        desktop: true,
        mobile: true,
        app: false
      }
    },
    {
      id: "upstox",
      name: "Upstox",
      description: "Technology-driven trading platform",
      url: "https://pro.upstox.com",
      status: "testing",
      features: [
        "Real-time quotes",
        "Advanced orders",
        "Technical analysis",
        "Market scanner"
      ],
      logo: "⚡",
      compatibility: {
        desktop: true,
        mobile: false,
        app: false
      }
    }
  ];

  const status: ExtensionStatus = extensionStatus?.status || {
    installed: false,
    permissions: [],
    platforms: {}
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'supported':
        return 'bg-green-100 text-green-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'coming_soon':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'supported':
        return <CheckCircle className="w-4 h-4" />;
      case 'testing':
        return <AlertCircle className="w-4 h-4" />;
      case 'coming_soon':
        return <Zap className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Multi-Platform Support</h2>
          <p className="text-gray-600 mt-1">
            StockSense AI works seamlessly across major Indian trading platforms
          </p>
        </div>
        
        {status.installed ? (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Extension Active
          </Badge>
        ) : (
          <Button asChild>
            <a href="/extension" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Install Extension</span>
            </a>
          </Button>
        )}
      </div>

      <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {platforms.slice(0, 4).map((platform) => (
            <TabsTrigger key={platform.id} value={platform.id} className="flex items-center space-x-2">
              <span>{platform.logo}</span>
              <span className="hidden sm:inline">{platform.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent key={platform.id} value={platform.id} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{platform.logo}</span>
                    <div>
                      <CardTitle className="text-xl">{platform.name}</CardTitle>
                      <CardDescription>{platform.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(platform.status)}>
                      {getStatusIcon(platform.status)}
                      <span className="ml-1">{platform.status.replace('_', ' ').toUpperCase()}</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={platform.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open Platform
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Supported Features</h4>
                    <ul className="space-y-2">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compatibility & Status */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Compatibility</h4>
                      <div className="flex space-x-4">
                        <div className={`flex items-center space-x-1 ${platform.compatibility.desktop ? 'text-green-600' : 'text-gray-400'}`}>
                          <Monitor className="w-4 h-4" />
                          <span className="text-sm">Desktop</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${platform.compatibility.mobile ? 'text-green-600' : 'text-gray-400'}`}>
                          <Smartphone className="w-4 h-4" />
                          <span className="text-sm">Mobile</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${platform.compatibility.app ? 'text-green-600' : 'text-gray-400'}`}>
                          <Download className="w-4 h-4" />
                          <span className="text-sm">App</span>
                        </div>
                      </div>
                    </div>

                    {status.installed && status.platforms[platform.id] && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Live Status</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Connection</span>
                            <Badge className={status.platforms[platform.id].active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {status.platforms[platform.id].active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          {status.platforms[platform.id].lastDetected && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Last Detected</span>
                              <span className="text-sm text-gray-900">
                                {new Date(status.platforms[platform.id].lastDetected!).toLocaleTimeString()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Stocks Monitored</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {status.platforms[platform.id].stocksDetected}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {platform.status === 'supported' && (
                      <Button
                        onClick={() => testPlatform.mutate(platform.id)}
                        disabled={testPlatform.isPending}
                        className="w-full"
                        variant="outline"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {testPlatform.isPending ? 'Testing...' : 'Test Integration'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Universal Compatibility</h3>
            <p className="text-sm text-gray-600">
              One extension works across all major trading platforms seamlessly.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Activity className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
            <p className="text-sm text-gray-600">
              Automatic stock detection and continuous analysis across platforms.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Unified Analytics</h3>
            <p className="text-sm text-gray-600">
              Consistent analysis and insights regardless of which platform you use.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Extension Status Overview */}
      {status.installed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Extension Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Extension Info</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Version</span>
                    <span className="text-sm font-semibold">{status.version || '1.0.0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Platforms</span>
                    <span className="text-sm font-semibold">
                      {Object.values(status.platforms).filter(p => p.active).length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Permissions</h4>
                <div className="flex flex-wrap gap-1">
                  {status.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}