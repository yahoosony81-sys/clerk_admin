import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, ArrowRight, CheckCircle2, Database, Shield } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: tasks } = await supabase.from('tasks').select('*').limit(5)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="h-6 w-6" />
            <span>Clerk Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                    로그인
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                    회원가입
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
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
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 md:px-6 py-24 space-y-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              New Feature
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Clerk + Supabase <br/> 통합 템플릿
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Next.js 15, Clerk 인증, Supabase 데이터베이스, 그리고 shadcn/ui로 구축된 모던 웹 애플리케이션 템플릿입니다.
            </p>
            <div className="space-x-4">
              <SignedIn>
                <Link href="/dashboard">
                  <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    대시보드로 이동
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    시작하기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32 bg-muted/50 rounded-3xl my-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">강력한 인증</h3>
              <p className="text-muted-foreground">
                Clerk를 사용한 안전하고 간편한 사용자 인증 및 관리. 소셜 로그인, 다중 요소 인증을 지원합니다.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">실시간 데이터베이스</h3>
              <p className="text-muted-foreground">
                Supabase를 활용한 확장 가능한 PostgreSQL 데이터베이스. RLS로 데이터를 안전하게 보호합니다.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">최신 기술 스택</h3>
              <p className="text-muted-foreground">
                Next.js 15 App Router, Server Actions, Tailwind CSS 등 최신 웹 기술을 사용하여 개발되었습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Tasks Preview (Only for logged in users) */}
        <SignedIn>
          <section className="container px-4 md:px-6 py-12">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col space-y-1.5">
                <h3 className="font-semibold leading-none tracking-tight">최근 작업</h3>
                <p className="text-sm text-muted-foreground">Supabase에서 가져온 최근 작업 목록입니다.</p>
              </div>
              <div className="p-6 pt-0">
                {tasks && tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map((task: any) => (
                      <div key={task.id} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{task.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(task.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    작업이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </section>
        </SignedIn>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <span className="font-medium underline underline-offset-4">Clerk Admin</span>. The source code is available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  )
}
