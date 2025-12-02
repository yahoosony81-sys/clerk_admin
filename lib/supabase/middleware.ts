import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase 세션을 업데이트하는 미들웨어 함수입니다.
 * 이 함수는 Next.js middleware에서 호출되어 사용자 세션을 갱신합니다.
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // 
  // Note: Clerk를 사용하는 경우 Supabase 자체 인증을 사용하지 않으므로
  // getUser() 호출을 건너뛰고 바로 응답을 반환합니다.
  // Clerk 인증은 middleware.ts에서 이미 처리됩니다.
  try {
    await supabase.auth.getUser()
  } catch (error) {
    // Clerk를 사용하는 경우 Supabase 인증이 없을 수 있으므로 에러를 무시합니다.
    // 이는 정상적인 동작입니다.
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}

