import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  MessageSquare, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Target,
  BookOpen,
  Bot,
  User
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'analysis' | 'pattern' | 'recommendation' | 'explanation';
    confidence?: number;
    symbols?: string[];
  };
}

interface QuickAction {
  label: string;
  icon: any;
  prompt: string;
  type: 'analysis' | 'pattern' | 'recommendation' | 'explanation';
}

export default function AIChatInterface({ symbol = "RELIANCE" }: { symbol?: string }) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    {
      label: "Analyze Current Trend",
      icon: TrendingUp,
      prompt: `Analyze the current trend for ${symbol} and provide insights`,
      type: "analysis"
    },
    {
      label: "Detect Patterns",
      icon: Target,
      prompt: `What patterns do you see in ${symbol}? Any breakout signals?`,
      type: "pattern"
    },
    {
      label: "Get Recommendation",
      icon: Lightbulb,
      prompt: `Should I buy, sell, or hold ${symbol} right now?`,
      type: "recommendation"
    },
    {
      label: "Explain Strategy",
      icon: BookOpen,
      prompt: `Explain the best trading strategy for ${symbol} based on current conditions`,
      type: "explanation"
    }
  ];

  // Fetch chat history
  const { data: chatHistory } = useQuery({
    queryKey: ["/api/chat/history"],
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (userMessage: string) => {
      return await apiRequest("POST", "/api/chat/send", {
        message: userMessage,
        symbol: symbol,
        context: "web_app"
      });
    },
    onSuccess: (data) => {
      if (data.response) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          metadata: data.metadata
        };
        setConversation(prev => [...prev, newMessage]);
      }
    },
  });

  const handleSendMessage = async (messageText = message) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage("");
    await sendMessage.mutateAsync(messageText);
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversation]);

  useEffect(() => {
    if (chatHistory?.messages) {
      setConversation(chatHistory.messages);
    }
  }, [chatHistory]);

  const getMessageTypeIcon = (metadata?: any) => {
    if (!metadata?.type) return <Bot className="w-4 h-4" />;
    
    switch (metadata.type) {
      case 'analysis':
        return <Brain className="w-4 h-4 text-blue-500" />;
      case 'pattern':
        return <Target className="w-4 h-4 text-green-500" />;
      case 'recommendation':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'explanation':
        return <BookOpen className="w-4 h-4 text-orange-500" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getMessageTypeColor = (metadata?: any) => {
    if (!metadata?.type) return "bg-gray-100 text-gray-800";
    
    switch (metadata.type) {
      case 'analysis':
        return "bg-blue-100 text-blue-800";
      case 'pattern':
        return "bg-green-100 text-green-800";
      case 'recommendation':
        return "bg-purple-100 text-purple-800";
      case 'explanation':
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">AI Trading Assistant</h3>
              <p className="text-sm text-gray-600">Ask questions about {symbol}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            <Brain className="w-3 h-3 mr-1" />
            Gemini 2.5 Flash
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-b p-4">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                disabled={sendMessage.isPending}
                className="flex items-center justify-start space-x-2 h-auto py-2 px-3"
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {conversation.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">
                Start a conversation! Ask me anything about stock analysis, patterns, or trading strategies.
              </p>
            </div>
          )}
          
          {conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 mt-1">
                      {getMessageTypeIcon(msg.metadata)}
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <User className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    
                    {msg.metadata && (
                      <div className="mt-2 flex items-center space-x-2">
                        {msg.metadata.type && (
                          <Badge size="sm" className={getMessageTypeColor(msg.metadata)}>
                            {msg.metadata.type}
                          </Badge>
                        )}
                        {msg.metadata.confidence && (
                          <Badge size="sm" variant="outline">
                            {(msg.metadata.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {sendMessage.isPending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-gray-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask about ${symbol} analysis, patterns, or trading strategies...`}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={sendMessage.isPending}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={sendMessage.isPending || !message.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
          <AlertTriangle className="w-3 h-3" />
          <span>AI responses are for educational purposes. Always do your own research before trading.</span>
        </div>
      </div>
    </div>
  );
}