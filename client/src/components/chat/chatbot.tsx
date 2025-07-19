import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  MessageSquare
} from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export function Chatbot() {
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isPremium } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch or create conversation
  const { data: conversation } = useQuery({
    queryKey: ["/api/chat/conversations"],
    select: (data: any) => data.conversations[0] || null,
  });

  // Fetch messages for the conversation
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat/conversations", conversationId, "messages"],
    enabled: !!conversationId,
  });

  const messages: Message[] = messagesData?.messages || [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set conversation ID when conversation is loaded
  useEffect(() => {
    if (conversation) {
      setConversationId(conversation.id);
    }
  }, [conversation]);

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/chat/conversations", {
        title: "New Chat Session",
      });
    },
    onSuccess: (data: any) => {
      setConversationId(data.conversation.id);
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) {
        throw new Error("No conversation available");
      }
      return await apiRequest("POST", "/api/chat/send", {
        conversationId,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat/conversations", conversationId, "messages"] 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] }); // Update usage count
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Message Failed",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Check usage limits for non-premium users
    if (!isPremium && user && user.apiUsageCount >= user.dailyUsageLimit) {
      toast({
        title: "Usage Limit Reached",
        description: "Upgrade to Premium for unlimited chat access",
        variant: "destructive",
      });
      return;
    }

    if (!conversationId) {
      createConversationMutation.mutate();
      // Will send message after conversation is created
      return;
    }

    sendMessageMutation.mutate(message);
  };

  // Send message after conversation is created
  useEffect(() => {
    if (conversationId && message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message);
    }
  }, [conversationId]);

  const quickQuestions = [
    {
      icon: TrendingUp,
      question: "What are the current market trends?",
      category: "Market Analysis"
    },
    {
      icon: AlertTriangle,
      question: "How should I manage risk in volatile markets?",
      category: "Risk Management"
    },
    {
      icon: Lightbulb,
      question: "Explain candlestick patterns for beginners",
      category: "Education"
    },
    {
      icon: MessageSquare,
      question: "Should I buy RELIANCE at current levels?",
      category: "Stock Analysis"
    }
  ];

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <Bot className="w-5 h-5 mr-2 text-blue-600" />
          AI Trading Assistant
          {!isPremium && user && (
            <Badge variant="outline" className="ml-auto">
              {user.apiUsageCount}/{user.dailyUsageLimit} uses
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          {messages.length === 0 ? (
            <div className="space-y-6">
              <div className="text-center py-8">
                <Bot className="w-16 h-16 mx-auto text-blue-600 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome to your AI Trading Assistant!
                </h3>
                <p className="text-gray-600 mb-6">
                  Ask me anything about stocks, trading strategies, or market analysis.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Quick Questions to Get Started:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {quickQuestions.map((item, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                      onClick={() => handleQuickQuestion(item.question)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <item.icon className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <Badge variant="secondary" className="text-xs mb-2">
                              {item.category}
                            </Badge>
                            <p className="text-sm font-medium text-gray-900">
                              {item.question}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-1 opacity-70`}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {sendMessageMutation.isPending && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about stocks, patterns, or trading strategies..."
            className="flex-1"
            disabled={sendMessageMutation.isPending || createConversationMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={
              !message.trim() || 
              sendMessageMutation.isPending || 
              createConversationMutation.isPending ||
              (!isPremium && user && user.apiUsageCount >= user.dailyUsageLimit)
            }
          >
            {sendMessageMutation.isPending || createConversationMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        
        {!isPremium && user && user.apiUsageCount >= user.dailyUsageLimit && (
          <p className="text-sm text-orange-600 mt-2 text-center">
            Daily usage limit reached. Upgrade to Premium for unlimited chat access.
          </p>
        )}
      </div>
    </div>
  );
}