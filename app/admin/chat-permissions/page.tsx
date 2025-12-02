import { requireAdmin } from '@/lib/auth'
import { clerkClient } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, LayoutDashboard, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { getPermissions } from './actions'
import { grantPermission, revokePermission } from './actions'

export default async function ChatPermissionsPage() {
  // 관리자 권한 확인
  try {
    await requireAdmin()
  } catch (error) {
    redirect('/dashboard')
  }

  // 사용자 목록 조회
  const clerk = await clerkClient()
  const userListResponse = await clerk.users.getUserList({ limit: 100 })
  const users = userListResponse.data

  // 권한 목록 조회
  const permissionsResult = await getPermissions()
  const permissions = permissionsResult.data || []

  // Map<userId, ChatPermission>으로 변환
  const permissionMap = new Map(
    permissions.map((perm) => [perm.userId, perm])
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>챗봇 권한 관리</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            챗봇 사용 권한 관리
          </h1>
          <p className="text-muted-foreground">
            사용자별 챗봇 사용 권한을 부여하거나 회수할 수 있습니다.
          </p>
        </div>

        {/* 권한 목록 테이블 */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    권한 상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    메모
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    권한 부여 시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const permission = permissionMap.get(user.id)
                  const hasPermission = permission?.enabled === true

                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                            {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.firstName || user.emailAddresses[0]?.emailAddress || '이름 없음'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">
                          {user.emailAddresses[0]?.emailAddress || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hasPermission ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3" />
                            활성화
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-muted text-muted-foreground">
                            <XCircle className="h-3 w-3" />
                            비활성화
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {permission?.notes || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {permission?.grantedAt
                            ? new Date(permission.grantedAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {hasPermission ? (
                            <form action={revokePermission}>
                              <input type="hidden" name="userId" value={user.id} />
                              <button
                                type="submit"
                                className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                              >
                                권한 회수
                              </button>
                            </form>
                          ) : (
                            <form action={grantPermission}>
                              <input type="hidden" name="userId" value={user.id} />
                              <button
                                type="submit"
                                className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                              >
                                권한 부여
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              사용자가 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

