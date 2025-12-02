import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bot, LayoutDashboard } from 'lucide-react'
import { checkChatPermission } from '@/lib/chat-permissions'
import ChatInterface from './chat-interface'

export default async function ChatPage() {
  // 1. 로그인 확인
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // 2. 권한 확인
  const hasPermission = await checkChatPermission()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Bot className="h-6 w-6 text-primary" />
            <span>AI Chatbot</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              대시보드
            </Link>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI 챗봇</h1>
          <p className="text-muted-foreground">
            Gemini AI와 대화를 나눠보세요.
          </p>
        </div>

        {/* Chat Interface */}
        <ChatInterface hasPermission={hasPermission} />
      </main>
    </div>
  )
}

