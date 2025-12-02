# Supabase 설정 가이드

이 가이드는 Supabase를 Next.js 프로젝트에 통합하는 방법을 단계별로 설명합니다.

**Supabase 공식 문서의 모범 사례를 따릅니다.**
- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Server-Side Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

> **참고:** 이 프로젝트는 Clerk와 Supabase를 함께 사용합니다. Clerk 통합이 필요한 경우 별도 섹션을 참고하세요.

## 📋 목차

1. [Clerk Dashboard 설정](#1-clerk-dashboard-설정)
2. [Supabase Dashboard 설정](#2-supabase-dashboard-설정)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [Supabase 데이터베이스 설정](#4-supabase-데이터베이스-설정)
5. [테스트](#5-테스트)

---

## 1. Clerk Dashboard 설정

Clerk를 Supabase의 서드파티 인증 제공자로 설정합니다.

### 단계:

1. [Clerk Dashboard](https://dashboard.clerk.com)에 로그인합니다
2. 왼쪽 메뉴에서 **"Integrations"** 또는 **"Setup"** 메뉴를 찾습니다
3. **"Supabase"** 통합을 선택합니다
4. 설정 옵션을 선택한 후 **"Activate Supabase integration"** 버튼을 클릭합니다
5. 표시된 **"Clerk domain"**을 복사합니다 (예: `your-app.clerk.accounts.dev`)
   - 이 값은 다음 단계에서 필요합니다

---

## 2. Supabase Dashboard 설정

Supabase에서 Clerk를 서드파티 인증 제공자로 추가합니다.

### 단계:

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인합니다
2. 프로젝트를 선택합니다 (없으면 새로 만듭니다)
3. 왼쪽 메뉴에서 **"Authentication"** → **"Providers"** 또는 **"Sign In / Up"** 메뉴로 이동합니다
4. **"Add provider"** 버튼을 클릭합니다
5. 제공자 목록에서 **"Clerk"**를 선택합니다
6. 이전 단계에서 복사한 **Clerk domain**을 붙여넣습니다
7. **"Save"** 버튼을 클릭합니다

---

## 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 추가합니다.

### Supabase 프로젝트 정보 가져오기:

1. Supabase Dashboard에서 **"Project Settings"** → **"API"** 메뉴로 이동합니다
2. 다음 정보를 복사합니다:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키 (API Keys 섹션에서 찾을 수 있습니다)

### `.env.local` 파일 생성:

프로젝트 루트 디렉토리에 `.env.local` 파일을 만들고 다음 내용을 추가합니다:

```env
# Clerk 환경 변수 (이미 설정되어 있을 수 있습니다)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase 환경 변수
# Supabase 공식 문서에 따르면 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 사용합니다
# 하지만 기존 코드와의 호환성을 위해 NEXT_PUBLIC_SUPABASE_KEY도 지원합니다
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
# 또는 (기존 코드 호환성)
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

**중요:** 
- `NEXT_PUBLIC_` 접두사는 클라이언트 사이드에서 사용되는 변수에 필요합니다
- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함되어 있습니다)
- Supabase 공식 문서에서는 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 권장하지만, `NEXT_PUBLIC_SUPABASE_KEY`도 지원합니다

---

## 4. Supabase 데이터베이스 설정

예제로 사용할 `tasks` 테이블을 생성하고 Row Level Security (RLS) 정책을 설정합니다.

### 단계:

1. Supabase Dashboard에서 **"SQL Editor"** 메뉴로 이동합니다
2. **"New query"** 버튼을 클릭합니다
3. 다음 SQL 코드를 복사하여 붙여넣고 실행합니다:

```sql
-- tasks 테이블 생성
-- user_id 컬럼은 Clerk 사용자 ID를 자동으로 저장합니다
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) 활성화
-- 이렇게 하면 사용자가 자신의 데이터만 볼 수 있습니다
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 사용자가 자신의 작업만 볼 수 있도록 하는 정책
CREATE POLICY "Users can view their own tasks"
ON tasks
FOR SELECT
TO authenticated
USING (
  (SELECT auth.jwt()->>'sub') = user_id::text
);

-- 사용자가 자신의 작업만 추가할 수 있도록 하는 정책
CREATE POLICY "Users can insert their own tasks"
ON tasks
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.jwt()->>'sub') = user_id::text
);

-- 사용자가 자신의 작업만 수정할 수 있도록 하는 정책 (선택사항)
CREATE POLICY "Users can update their own tasks"
ON tasks
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.jwt()->>'sub') = user_id::text
)
WITH CHECK (
  (SELECT auth.jwt()->>'sub') = user_id::text
);

-- 사용자가 자신의 작업만 삭제할 수 있도록 하는 정책 (선택사항)
CREATE POLICY "Users can delete their own tasks"
ON tasks
FOR DELETE
TO authenticated
USING (
  (SELECT auth.jwt()->>'sub') = user_id::text
);
```

4. **"Run"** 버튼을 클릭하여 SQL을 실행합니다
5. 성공 메시지가 표시되면 설정이 완료된 것입니다

---

## 5. 테스트

모든 설정이 완료되었는지 확인합니다.

### 단계:

1. 개발 서버를 실행합니다:
   ```bash
   pnpm run dev
   ```

2. 브라우저에서 `http://localhost:3000`으로 이동합니다

3. **로그인**합니다 (Clerk 로그인 화면이 표시됩니다)

4. 로그인 후 메인 페이지에서:
   - 작업 목록이 표시되는지 확인합니다
   - 새 작업을 추가해봅니다
   - 작업이 목록에 나타나는지 확인합니다

5. **다른 계정으로 로그인**하여:
   - 각 사용자가 자신의 작업만 볼 수 있는지 확인합니다
   - 다른 사용자의 작업은 보이지 않아야 합니다

---

## 🔍 문제 해결

### 오류: "Invalid API key" 또는 "Failed to fetch"

- `.env.local` 파일의 환경 변수가 올바른지 확인하세요
- Supabase Dashboard에서 Project URL과 API Key를 다시 확인하세요
- 개발 서버를 재시작하세요 (`Ctrl+C`로 중지 후 다시 `pnpm run dev`)

### 오류: "Row Level Security policy violation"

- Supabase SQL Editor에서 RLS 정책이 올바르게 생성되었는지 확인하세요
- Clerk Dashboard에서 Supabase 통합이 활성화되어 있는지 확인하세요
- Supabase Dashboard에서 Clerk 제공자가 올바르게 설정되었는지 확인하세요

### 작업이 표시되지 않음

- Supabase Dashboard의 **"Table Editor"**에서 `tasks` 테이블을 확인하세요
- `user_id` 컬럼에 올바른 Clerk 사용자 ID가 저장되어 있는지 확인하세요
- 브라우저의 개발자 도구(F12)에서 네트워크 탭을 확인하여 API 요청이 성공했는지 확인하세요

---

## 📚 추가 리소스

- [Clerk Supabase 통합 공식 문서](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase 서드파티 인증 제공자 문서](https://supabase.com/docs/guides/auth/third-party/overview)

---

## 💡 다음 단계

이제 기본 통합이 완료되었습니다! 다음을 시도해볼 수 있습니다:

1. **더 많은 테이블 추가**: 다른 데이터 모델을 만들어보세요
2. **실시간 업데이트**: Supabase Realtime을 사용하여 실시간으로 데이터를 동기화하세요
3. **파일 저장**: Supabase Storage를 사용하여 파일을 업로드하고 관리하세요
4. **웹훅 설정**: Clerk 웹훅을 사용하여 사용자 데이터를 Supabase에 동기화하세요

