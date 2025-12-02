import { supabaseAdmin } from '@/lib/supabase-admin'
import { getCurrentUserId, isAdmin, requireAdmin } from '@/lib/auth'
import { auth } from '@clerk/nextjs/server'

export interface ChatPermission {
  userId: string
  enabled: boolean
  grantedAt: string
  grantedBy?: string | null
  notes?: string | null
}

/**
 * 현재 사용자가 챗봇 사용 권한이 있는지 확인합니다.
 * 관리자는 항상 true를 반환합니다.
 * 
 * @returns 권한이 있으면 true, 없으면 false
 */
export async function checkChatPermission(): Promise<boolean> {
  try {
    // 1. 관리자 권한 확인 (관리자는 무조건 통과)
    const isUserAdmin = await isAdmin()
    if (isUserAdmin) {
      return true
    }

    // 2. 사용자 ID 확인
    const userId = await getCurrentUserId()
    if (!userId) {
      return false
    }

    // 3. DB에서 권한 조회 (일반 사용자용 클라이언트 사용)
    // Clerk 토큰을 가져와서 Supabase 클라이언트 생성
    const { getToken } = await auth()
    const token = await getToken({ template: 'supabase' })
    
    if (!token) {
      console.warn('Failed to get Supabase token for permission check')
      return false
    }

    // lib/supabase.ts의 createSupabaseClient 사용
    const { createSupabaseClient } = await import('@/lib/supabase')
    const supabase = createSupabaseClient(token)
    
    const { data, error } = await supabase
      .from('chat_permissions')
      .select('enabled')
      .eq('user_id', userId)
      .single()

    if (error) {
      // 레코드가 없으면 권한 없음으로 간주
      if (error.code !== 'PGRST116') { // PGRST116: no rows returned
        console.error('checkChatPermission Error:', error.message)
      }
      return false
    }

    return data?.enabled === true

  } catch (error) {
    console.error('checkChatPermission Exception:', error)
    return false
  }
}

/**
 * [관리자 전용] 특정 사용자에게 챗봇 사용 권한을 부여합니다.
 * 
 * @param targetUserId 권한을 부여할 사용자 ID (Clerk User ID)
 * @param notes 선택적 메모
 */
export async function grantChatPermission(
  targetUserId: string, 
  notes?: string
): Promise<void> {
  await requireAdmin() // 관리자 확인

  const currentAdminId = await getCurrentUserId()

  const { error } = await supabaseAdmin
    .from('chat_permissions')
    .upsert({
      user_id: targetUserId,
      enabled: true,
      granted_at: new Date().toISOString(),
      granted_by: currentAdminId,
      notes: notes || null,
      updated_at: new Date().toISOString()
    }, { 
      onConflict: 'user_id' 
    })

  if (error) {
    throw new Error(`Failed to grant permission: ${error.message}`)
  }
}

/**
 * [관리자 전용] 특정 사용자의 챗봇 사용 권한을 회수합니다.
 * 
 * @param targetUserId 권한을 회수할 사용자 ID (Clerk User ID)
 */
export async function revokeChatPermission(targetUserId: string): Promise<void> {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('chat_permissions')
    .update({
      enabled: false,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', targetUserId)

  if (error) {
    throw new Error(`Failed to revoke permission: ${error.message}`)
  }
}

/**
 * [관리자 전용] 모든 권한 부여 기록을 조회합니다.
 * 
 * @returns 권한 목록 (granted_at 기준 내림차순)
 */
export async function getAllChatPermissions(): Promise<ChatPermission[]> {
  await requireAdmin()

  const { data, error } = await supabaseAdmin
    .from('chat_permissions')
    .select('*')
    .order('granted_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch permissions: ${error.message}`)
  }

  // Snake case -> Camel case 변환
  return (data || []).map((row: any) => ({
    userId: row.user_id,
    enabled: row.enabled,
    grantedAt: row.granted_at,
    grantedBy: row.granted_by,
    notes: row.notes
  }))
}

