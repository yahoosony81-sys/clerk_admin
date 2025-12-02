import { createClient } from '@supabase/supabase-js'

/**
 * Clerk JWT 토큰을 사용하여 Supabase 클라이언트를 생성합니다.
 * 
 * @param clerkToken - Clerk에서 발급받은 Supabase JWT 토큰
 * @returns Supabase Client
 * 
 * @example
 * // Client Component
 * const { getToken } = useAuth();
 * const token = await getToken({ template: 'supabase' });
 * const supabase = createSupabaseClient(token);
 * 
 * // Server Component
 * const { getToken } = auth();
 * const token = await getToken({ template: 'supabase' });
 * const supabase = createSupabaseClient(token);
 */
export const createSupabaseClient = (clerkToken: string) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
    }
  )
}

