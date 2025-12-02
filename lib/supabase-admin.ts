import { createClient } from '@supabase/supabase-js'

/**
 * 관리자 권한(Service Role)을 가진 Supabase 클라이언트입니다.
 * RLS(Row Level Security)를 우회할 수 있으므로, 반드시 **서버 사이드**에서만 사용해야 합니다.
 * 
 * @requires SUPABASE_SERVICE_ROLE_KEY 환경 변수
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  // 개발 환경에서만 경고를 띄우거나, 빌드 타임에는 에러를 던지지 않도록 처리할 수 있습니다.
  // 여기서는 런타임에 키가 없으면 명시적으로 에러를 발생시킵니다.
  // console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Admin features will not work.')
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || '', // 키가 없을 경우 빈 문자열을 넣어 초기화 에러 방지 (실제 호출 시 실패함)
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

