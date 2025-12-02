import { auth, clerkClient } from '@clerk/nextjs/server'

export type UserRole = 'admin' | 'user' | string | null

/**
 * 현재 로그인한 사용자의 역할을 가져옵니다.
 * 
 * 1. 세션 클레임(JWT)에서 확인
 * 2. 실패 시 DB(Clerk API)에서 직접 조회
 */
export async function getUserRole(): Promise<UserRole> {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return null
    }

    // 1. 세션 클레임에서 확인 (Clerk Dashboard 설정 필요)
    // sessionClaims는 커스텀 클레임을 포함할 수 있습니다.
    // privateMetadata가 토큰에 포함되어 있다면 여기서 바로 반환합니다.
    // 참고: JWT 템플릿 설정에 따라 키 이름이 다를 수 있습니다.
    const roleFromSession = 
      (sessionClaims as any)?.privateMetadata?.role || 
      (sessionClaims as any)?.metadata?.role ||
      (sessionClaims?.publicMetadata as any)?.role

    if (roleFromSession) {
      return roleFromSession as UserRole
    }

    // 2. Fallback: clerkClient로 직접 조회
    // 세션 토큰에 정보가 없거나 만료되었을 경우 최신 정보를 가져옵니다.
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    
    return (user.privateMetadata?.role as UserRole) || null

  } catch (error) {
    console.error('getUserRole Error:', error)
    return null
  }
}

/**
 * 현재 사용자가 관리자(admin)인지 확인합니다.
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const role = await getUserRole()
    return role === 'admin'
  } catch (error) {
    console.error('isAdmin Error:', error)
    return false
  }
}

/**
 * 관리자 권한이 필요한 경우 호출합니다.
 * 권한이 없으면 에러를 발생시킵니다.
 */
export async function requireAdmin(): Promise<void> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized: Login required')
  }

  const role = await getUserRole()

  if (role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }
}

/**
 * 현재 사용자의 ID를 반환합니다.
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { userId } = await auth()
    return userId
  } catch (error) {
    console.error('getCurrentUserId Error:', error)
    return null
  }
}

