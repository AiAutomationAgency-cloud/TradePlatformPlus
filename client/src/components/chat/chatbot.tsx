import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Bot, User, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage, ChatConversation } from "@shared/schema";

export function Chatbot() {
  const [input, setInput] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch conversations
  const { data: conversationsData } = useQuery({
    queryKey: ["/api/chat/conversations"],
  });

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat/conversations", selectedConversation, "messages"],
    enabled: !!selectedConversation,
  });

  // Create new conversation
  const createConversation = useMutation({
    mutationFn: async (title: string) => {
      return await apiRequest("POST", "/api/chat/conversations", { title });
    },
    onSuccess: (data) => {
      setSelectedConversation(data.conversation.id);
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
    },
  });

  // Send message
  const sendMessage = useMutation({
    mutationFn: async (data: { conversationId: number; content: string }) => {
      return await apiRequest("POST", `/api/chat/conversations/${data.conversationId}/messages`, {
        content: data.content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/chat/conversations", selectedConversation, "messages"],
      });
      setInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const conversations = conversationsData?.conversations || [];
  const messages = messagesData?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    let conversationId = selectedConversation;

    // Create new conversation if none selected
    if (!conversationId) {
      const newConv = await createConversation.mutateAsync(
        input.substring(0, 50) + (input.length > 50 ? "..." : "")
      );
      conversationId = newConv.conversation.id;
    }

    if (conversationId) {
      sendMessage.mutate({ conversationId, content: input });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r bg-muted/20">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat History
          </h3>
        </div>
        <ScrollArea className="h-[calc(600px-73px)]">
          <div className="p-2 space-y-2">
            {conversations.map((conv: ChatConversation) => (
              <Button
                key={conv.id}
                variant={selectedConversation === conv.id ? "default" : "ghost"}
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="truncate">
                  <div className="text-sm font-medium truncate">
                    {conv.title || "New Conversation"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(conv.createdAt!).toLocaleDateString()}
                  </div>
                </div>
              </Button>
            ))}
            {conversations.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs">Start chatting to create your first conversation</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">StockSense AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Ask me about stocks, patterns, and trading strategies
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {selectedConversation ? (
            <div className="space-y-4">
              {messagesLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message: ChatMessage) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === "assistant" && (
                          <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        {message.role === "user" && (
                          <User className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt!).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Welcome to StockSense AI</h3>
                <p className="text-muted-foreground mb-4">
                  Your intelligent trading assistant is ready to help
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Ask about stock analysis and patterns</p>
                  <p>• Get trading recommendations</p>
                  <p>• Learn about technical indicators</p>
                  <p>• Understand market trends</p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about stocks, patterns, or trading strategies..."
              disabled={sendMessage.isPending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || sendMessage.isPending}
              size="icon"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Powered by Google Gemini AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}