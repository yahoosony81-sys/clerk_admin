import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Supabase 공식 문서의 모범 사례를 따르는 서버 사이드 클라이언트입니다.
 * Cookie-based 인증을 사용하여 세션을 관리합니다.
 * 
 * 이 함수는 서버 컴포넌트나 Server Actions에서 사용할 수 있습니다.
 * 
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Clerk와 통합된 Supabase 클라이언트입니다.
 * Clerk의 세션 토큰을 사용하여 Supabase에 인증합니다.
 * 
 * 이 함수는 Clerk를 사용하는 경우에 사용합니다.
 * @deprecated Clerk 통합이 필요한 경우에만 사용하세요. 일반적으로는 위의 createClient()를 사용하세요.
 */
export async function createServerSupabaseClient() {
  const { auth } = await import('@clerk/nextjs/server')
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        // Clerk의 인증 토큰을 가져와서 Supabase 요청에 포함시킵니다
        return (await auth()).getToken()
      },
    },
  )
}
