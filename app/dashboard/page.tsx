import { currentUser } from '@clerk/nextjs/server'
import { getUserRole } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Calendar, Mail, LayoutDashboard, MessageSquare, Settings } from 'lucide-react'

export default async function DashboardPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // 권한 확인 (에러 발생 시에도 페이지는 표시)
  let role: string | null = null
  let isAdmin = false
  try {
    role = await getUserRole()
    isAdmin = role === 'admin'
  } catch (error) {
    console.error('Failed to get user role:', error)
    // 에러가 발생해도 페이지는 계속 렌더링
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <LayoutDashboard className="h-8 w-8" />
        대시보드
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 프로필 카드 */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-muted">
              <Image
                src={user.imageUrl}
                alt={user.fullName || 'User Avatar'}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.fullName}</h2>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {isAdmin ? '관리자' : '사용자'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.emailAddresses[0]?.emailAddress}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>권한: {role || '없음'}</span>
            </div>
          </div>
        </div>

        {/* 빠른 작업 카드 */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">빠른 작업</h3>
          <div className="space-y-2">
            <Link href="/chat" className="block">
              <button className="inline-flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <MessageSquare className="mr-2 h-4 w-4" />
                AI 챗봇
              </button>
            </Link>
            {isAdmin && (
              <Link href="/admin" className="block">
                <button className="inline-flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  <Settings className="mr-2 h-4 w-4" />
                  관리자 페이지
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

