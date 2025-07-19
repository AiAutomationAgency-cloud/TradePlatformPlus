import { useState, useRef, useEffect } from "react"
import { Send, Trash2 } from "lucide-react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

interface ChatInterfaceProps {
  stockSymbol?: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: number
}

export const ChatInterface = ({ stockSymbol }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendToBackground({
        name: "chatWithAI",
        body: {
          message: input.trim(),
          context: {
            symbol: stockSymbol,
            timestamp: Date.now()
          }
        }
      })

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response || "I couldn't process your request. Please try again.",
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I'm experiencing technical difficulties. Please check your API configuration.",
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-slate-100 text-sm">Ask AI</h4>
        <button
          onClick={clearChat}
          className="text-slate-400 hover:text-slate-100 transition-colors"
          disabled={messages.length === 0}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto stocksense-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-slate-400">Start a conversation about {stockSymbol || 'this stock'}</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg p-2 ${
                message.type === 'user'
                  ? 'bg-slate-700 ml-4'
                  : 'bg-blue-500/10 mr-4'
              }`}
            >
              <div className="text-xs font-medium mb-1">
                <span className={message.type === 'user' ? 'text-blue-400' : 'text-blue-300'}>
                  {message.type === 'user' ? 'You' : 'AI Assistant'}
                </span>
              </div>
              <div className="text-xs text-slate-100 leading-relaxed">
                {message.content}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="bg-blue-500/10 rounded-lg p-2 mr-4">
            <div className="text-xs text-blue-300 font-medium mb-1">AI Assistant</div>
            <div className="text-xs text-slate-100">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Ask about ${stockSymbol || 'this stock'}...`}
          disabled={isLoading}
          className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-1 rounded transition-colors"
        >
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
