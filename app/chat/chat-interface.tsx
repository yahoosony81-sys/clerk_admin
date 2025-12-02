'use client'

import { useState, useRef, useEffect } from 'react'
import { sendMessage } from './actions'
import { Send, Bot, AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInterfaceProps {
  hasPermission: boolean
}

interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
  timestamp: Date
}

export default function ChatInterface({ hasPermission }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 추가될 때 스크롤을 아래로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Server Action 호출
      const result = await sendMessage(userMessage.text)

      if (!result.success) {
        throw new Error(result.error)
      }

      // AI 응답 추가
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: result.response || '응답이 없습니다.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err: any) {
      setError(err.message || '메시지 전송 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 권한이 없는 경우 경고 메시지 표시
  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center p-6 min-h-[400px]">
        <div className="max-w-md w-full border rounded-xl bg-card text-card-foreground shadow-sm p-8 flex flex-col items-center text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold">접근 권한 없음</h3>
          <p className="text-muted-foreground">
            챗봇 서비스를 이용할 수 있는 권한이 없습니다.<br />
            관리자에게 문의하여 권한을 요청해주세요.
          </p>
        </div>
      </div>
    )
  }

  // 채팅 인터페이스
  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto border rounded-xl bg-background shadow-sm overflow-hidden">
      {/* 채팅 헤더 */}
      <div className="p-4 border-b flex items-center gap-3 bg-muted/30 backdrop-blur">
        <div className="bg-primary/10 p-2 rounded-full">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-sm">AI Assistant</h2>
          <p className="text-xs text-muted-foreground">Gemini 2.0 Flash</p>
        </div>
      </div>

      {/* 메시지 목록 영역 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 dark:bg-slate-950/50"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 opacity-60">
            <div className="bg-muted p-4 rounded-full">
              <Bot className="h-8 w-8" />
            </div>
            <p className="text-sm">AI와 대화를 시작해보세요!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                  msg.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-white dark:bg-zinc-800 border rounded-bl-none"
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <p className={cn(
                  "text-[10px] mt-1.5 text-right opacity-70",
                  msg.role === 'user' ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        
        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="flex justify-start w-full animate-pulse">
            <div className="bg-white dark:bg-zinc-800 border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="flex justify-center w-full my-2">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* 입력 폼 영역 */}
      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 h-11 pl-4 pr-12 text-sm rounded-full border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 top-1.5 inline-flex items-center justify-center rounded-full h-8 w-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

