import { requireAdmin } from '@/lib/auth'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, LayoutDashboard, MessageSquare } from 'lucide-react'

export default async function AdminPage() {
  // 관리자 권한 확인
  try {
    await requireAdmin()
  } catch (error) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>관리자</span>
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
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            관리자 페이지
          </h1>
          <p className="text-muted-foreground">
            시스템 관리 및 설정을 관리할 수 있습니다.
          </p>
        </div>

        {/* 관리 메뉴 카드 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/admin/chat-permissions">
            <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">챗봇 권한 관리</h3>
                  <p className="text-sm text-muted-foreground">
                    사용자별 챗봇 사용 권한을 부여하거나 회수할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}

