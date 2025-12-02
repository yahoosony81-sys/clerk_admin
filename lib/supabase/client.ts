'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase 공식 문서의 모범 사례를 따르는 클라이언트 사이드 클라이언트입니다.
 * 브라우저에서 사용하는 Supabase 클라이언트를 생성합니다.
 * 
 * 이 함수는 클라이언트 컴포넌트에서 사용할 수 있습니다.
 * 
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_KEY!
  )
}

/**
 * Clerk와 통합된 Supabase 클라이언트 Hook입니다.
 * Clerk의 세션 토큰을 사용하여 Supabase에 인증합니다.
 * 
 * 이 Hook은 Clerk를 사용하는 경우에 사용합니다.
 * @deprecated Clerk 통합이 필요한 경우에만 사용하세요. 일반적으로는 위의 createClient()를 사용하세요.
 */
export function useSupabaseClient() {
  const { useSession } = require('@clerk/nextjs')
  const { useMemo } = require('react')
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  
  const { session } = useSession()

  return useMemo(() => {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        async accessToken() {
          // Clerk의 세션 토큰을 가져와서 Supabase 요청에 포함시킵니다
          return session?.getToken() ?? null
        },
      },
    )
  }, [session])
}
