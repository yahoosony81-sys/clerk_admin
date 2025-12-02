import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

// 관리자 경로 매처 생성
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

/**
 * Clerk와 Supabase를 모두 지원하는 통합 미들웨어입니다.
 * 1. 관리자 경로(/admin) 접근 시 role 체크
 * 2. Supabase 세션 갱신
 */
export default clerkMiddleware(async (auth, request: NextRequest) => {
  // 1. 관리자 경로 보호 로직
  if (isAdminRoute(request)) {
    // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
    await auth.protect()

    // 세션 클레임에서 역할(role) 확인
    // Note: Clerk Dashboard > Sessions > Edit > JWT Template(또는 Customize Session Token)에서
    // 'metadata' 클레임을 추가하고 값으로 {{user.private_metadata}}를 설정해야 합니다.
    const { userId, sessionClaims } = await auth()
    
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // lib/auth.ts와 동일한 방식으로 role 확인
    // 1. 세션 클레임에서 확인 (여러 경로 시도)
    const roleFromSession = 
      (sessionClaims as any)?.privateMetadata?.role || 
      (sessionClaims as any)?.metadata?.role ||
      (sessionClaims?.publicMetadata as any)?.role

    let userRole = roleFromSession

    // 2. 세션에 없으면 Clerk API로 직접 조회 (fallback)
    if (!userRole) {
      try {
        const { clerkClient } = await import('@clerk/nextjs/server')
        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        userRole = user.privateMetadata?.role
      } catch (error) {
        console.error('Failed to fetch user role in middleware:', error)
      }
    }

    // 관리자가 아니면 대시보드로 리다이렉트
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 2. Supabase 세션 갱신 및 Clerk 인증 응답 통합
  return await updateSession(request)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
