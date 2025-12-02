'use server'

import { revalidatePath } from 'next/cache'
import { 
  grantChatPermission, 
  revokeChatPermission, 
  getAllChatPermissions,
  type ChatPermission 
} from '@/lib/chat-permissions'

export interface GrantPermissionResult {
  success: boolean
  error?: string
}

export interface RevokePermissionResult {
  success: boolean
  error?: string
}

export interface GetPermissionsResult {
  success: boolean
  data?: ChatPermission[]
  error?: string
}

/**
 * [관리자 전용] 특정 사용자에게 챗봇 사용 권한을 부여합니다.
 * Form action으로 사용할 수 있도록 FormData를 받습니다.
 */
export async function grantPermission(
  formData: FormData
): Promise<GrantPermissionResult> {
  try {
    const userId = formData.get('userId') as string
    const notes = formData.get('notes') as string | null

    // 입력 검증
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return { 
        success: false, 
        error: '사용자 ID가 필요합니다.' 
      }
    }

    // 권한 부여
    await grantChatPermission(userId, notes || undefined)

    // 페이지 재검증
    revalidatePath('/admin/chat-permissions')

    return { success: true }
  } catch (error: any) {
    console.error('GrantPermission Action Error:', error)
    return {
      success: false,
      error: error.message || '권한 부여 중 오류가 발생했습니다.'
    }
  }
}

/**
 * [관리자 전용] 특정 사용자의 챗봇 사용 권한을 회수합니다.
 * Form action으로 사용할 수 있도록 FormData를 받습니다.
 */
export async function revokePermission(
  formData: FormData
): Promise<RevokePermissionResult> {
  try {
    const userId = formData.get('userId') as string

    // 입력 검증
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return { 
        success: false, 
        error: '사용자 ID가 필요합니다.' 
      }
    }

    // 권한 회수
    await revokeChatPermission(userId)

    // 페이지 재검증
    revalidatePath('/admin/chat-permissions')

    return { success: true }
  } catch (error: any) {
    console.error('RevokePermission Action Error:', error)
    return {
      success: false,
      error: error.message || '권한 회수 중 오류가 발생했습니다.'
    }
  }
}

/**
 * [관리자 전용] 모든 챗봇 권한 부여 기록을 조회합니다.
 */
export async function getPermissions(): Promise<GetPermissionsResult> {
  try {
    const permissions = await getAllChatPermissions()

    return {
      success: true,
      data: permissions
    }
  } catch (error: any) {
    console.error('GetPermissions Action Error:', error)
    return {
      success: false,
      error: error.message || '권한 목록 조회 중 오류가 발생했습니다.'
    }
  }
}

