# Clerk Admin - Clerk와 Supabase 통합 프로젝트

이 프로젝트는 [Next.js](https://nextjs.org), [Clerk](https://clerk.com), 그리고 [Supabase](https://supabase.com)를 통합한 예제 애플리케이션입니다.

## 🚀 주요 기능

- ✅ Clerk를 사용한 사용자 인증
- ✅ Supabase를 사용한 데이터베이스 연동
- ✅ Row Level Security (RLS)를 통한 데이터 보안
- ✅ 서버 사이드 렌더링 (SSR) 지원
- ✅ Server Actions를 사용한 안전한 데이터 조작

## 📦 설치된 패키지

- `@clerk/nextjs` - Clerk 인증 SDK
- `@supabase/supabase-js` - Supabase 클라이언트 라이브러리
- `@supabase/ssr` - Supabase Server-Side Rendering 패키지 (Cookie-based 인증)
- `next` - Next.js 프레임워크
- `react` & `react-dom` - React 라이브러리

> **참고:** 이 프로젝트는 [Supabase 공식 문서](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)의 모범 사례를 따릅니다.

## 🏃 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Clerk 환경 변수
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase 환경 변수
# Supabase 공식 문서에 따르면 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 사용합니다
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
# 또는 (기존 코드 호환성)
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

### 3. Supabase 설정

자세한 설정 방법은 **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** 파일을 참고하세요.

주요 단계:
1. Supabase 프로젝트 생성 및 환경 변수 설정
2. Supabase에서 `tasks` 테이블 생성 및 RLS 정책 설정
3. (선택사항) Clerk와 Supabase 통합 (Clerk를 사용하는 경우)

### 4. 개발 서버 실행

```bash
pnpm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
clerk_admin/
├── app/
│   ├── actions/
│   │   └── tasks.ts          # Server Actions (작업 추가/조회)
│   ├── components/
│   │   └── AddTaskForm.tsx   # 작업 추가 폼 컴포넌트
│   ├── layout.tsx            # 루트 레이아웃 (Clerk Provider 포함)
│   └── page.tsx              # 메인 페이지 (작업 목록 표시)
├── lib/
│   └── supabase/
│       ├── server.ts          # 서버 사이드 Supabase 클라이언트
│       └── client.ts          # 클라이언트 사이드 Supabase 클라이언트
├── middleware.ts             # Clerk 미들웨어
└── SUPABASE_SETUP.md          # Supabase 설정 가이드
```

## 🔧 사용 방법

### 서버 사이드에서 Supabase 사용 (권장)

Supabase 공식 문서의 모범 사례를 따릅니다:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('tasks').select()
  // ...
}
```

### 클라이언트 사이드에서 Supabase 사용

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export default function Component() {
  const supabase = createClient()
  // ...
}
```

### Clerk와 통합된 Supabase 사용 (선택사항)

Clerk를 사용하는 경우:

```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function Page() {
  const client = await createServerSupabaseClient()
  const { data } = await client.from('tasks').select()
  // ...
}
```

## 📚 참고 자료

### Supabase
- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) ⭐ **공식 문서**
- [Supabase Server-Side Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase 공식 문서](https://supabase.com/docs)

### Clerk
- [Clerk 공식 문서](https://clerk.com/docs)
- [Clerk-Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)

### Next.js
- [Next.js 공식 문서](https://nextjs.org/docs)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
