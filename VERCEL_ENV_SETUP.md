# Vercel 환경 변수 설정 가이드 (상세)

이 문서는 로컬 `.env.local` 파일의 환경 변수를 Vercel에 추가하는 방법을 단계별로 설명합니다.

## 📍 1단계: Vercel 프로젝트 페이지 접근

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. 배포하려는 프로젝트(`clerk_admin`) 클릭
3. 상단 메뉴에서 **"Settings"** 탭 클릭

## 📍 2단계: Environment Variables 메뉴 찾기

1. Settings 페이지 왼쪽 사이드바에서 **"Environment Variables"** 클릭
   - 또는 스크롤하여 "Environment Variables" 섹션 찾기

## 📍 3단계: 환경 변수 추가하기

각 환경 변수를 하나씩 추가합니다. 아래 표를 참고하여 정확히 입력하세요.

### 필수 환경 변수 목록

| 순서 | Key (환경 변수 이름) | Value (값) | 어디서 가져오나? |
|------|---------------------|------------|-----------------|
| 1 | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_a2V5LW9yeXgtNDYuY2xlcmsuYWNjb3VudHMuZGV2JA` | 로컬 `.env.local` 파일의 동일한 이름 |
| 2 | `CLERK_SECRET_KEY` | `sk_test_nNTbto3kREynlrZidtp3fk1yEItXCoQy7Ye2WjpRPh` | 로컬 `.env.local` 파일의 동일한 이름 |
| 3 | `NEXT_PUBLIC_SUPABASE_URL` | `https://jcenhziltyldxnrilptl.supabase.co` | 로컬 `.env.local` 파일의 동일한 이름 |
| 4 | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (전체 값) | 로컬 `.env.local` 파일의 동일한 이름 |
| 5 | `NEXT_PUBLIC_SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (전체 값) | 로컬 `.env.local` 파일의 동일한 이름 |
| 6 | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (전체 값) | 로컬 `.env.local` 파일의 동일한 이름 |
| 7 | `GEMINI_API_KEY` | `AIzaSyC4ijLN6BIBOvLphqibawLhIQt8u_Lc5EQ` | 로컬 `.env.local` 파일의 동일한 이름 |

### 선택적 환경 변수 (Clerk URL 설정)

| Key | Value | 설명 |
|-----|-------|------|
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | 로그인 페이지 경로 |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | 회원가입 페이지 경로 |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` | 로그인 후 리다이렉트 경로 |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` | 회원가입 후 리다이렉트 경로 |

## 📍 4단계: 각 환경 변수 추가 방법 (상세)

### 예시: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 추가하기

1. **"Add New"** 또는 **"Add"** 버튼 클릭
2. **Key** 입력란에 정확히 입력:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   ```
   ⚠️ 주의: 대소문자, 언더스코어(_) 정확히 입력

3. **Value** 입력란에 로컬 `.env.local` 파일에서 복사한 값 붙여넣기:
   ```
   pk_test_a2V5LW9yeXgtNDYuY2xlcmsuYWNjb3VudHMuZGV2JA
   ```
   ⚠️ 주의: 
   - 공백 없이 정확히 복사
   - 따옴표(' 또는 ") 없이 값만 입력
   - 줄바꿈 없이 한 줄로 입력

4. **Environment** 선택:
   - ☑️ **Production** (프로덕션 환경)
   - ☑️ **Preview** (프리뷰 환경)
   - ☑️ **Development** (개발 환경)
   
   ⚠️ 모든 환경에 적용하려면 세 가지 모두 체크

5. **"Save"** 또는 **"Add"** 버튼 클릭

### 나머지 환경 변수도 동일한 방법으로 추가

위의 표에 있는 모든 환경 변수를 하나씩 추가합니다.

## 📍 5단계: 환경 변수 확인

모든 환경 변수를 추가한 후:

1. Environment Variables 목록에서 확인:
   - Key 이름이 정확한지 확인
   - Value가 올바르게 입력되었는지 확인 (일부는 `***`로 마스킹됨)
   - Environment가 올바르게 선택되었는지 확인

2. 총 7개(또는 11개)의 환경 변수가 추가되었는지 확인

## 📍 6단계: 배포 실행

1. 환경 변수 추가 완료 후 상단 메뉴에서 **"Deployments"** 탭으로 이동
2. 최신 배포의 **"..."** 메뉴 클릭 → **"Redeploy"** 선택
   - 또는 **"Deploy"** 버튼 클릭 (새 배포)
3. 배포 완료 대기

## ⚠️ 주의사항

### 1. 값 복사 시 주의사항
- `.env.local` 파일에서 값을 복사할 때 **전체 값**을 복사해야 합니다
- 특히 Supabase 키는 매우 길기 때문에 끝까지 복사했는지 확인하세요
- 줄바꿈이나 공백이 포함되지 않도록 주의하세요

### 2. Key 이름 정확히 입력
- 대소문자를 정확히 구분합니다
- 언더스코어(_) 위치를 정확히 입력합니다
- 예: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (대문자, 언더스코어)

### 3. 환경 변수 값 예시 (전체 값이 아닌 형식만 표시)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://jcenhziltyldxnrilptl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZW5oemlsdHlsZHhucmlscHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjY5NjYsImV4cCI6MjA4MDIwMjk2Nn0.3-UyUJQKNtb6POTNzkhO54VUddoyQG6fx4SJTKhFvJ0
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZW5oemlsdHlsZHhucmlscHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjY5NjYsImV4cCI6MjA4MDIwMjk2Nn0.3-UyUJQKNtb6POTNzkhO54VUddoyQG6fx4SJTKhFvJ0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZW5oemlsdHlsZHhucmlscHRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYyNjk2NiwiZXhwIjoyMDgwMjAyOTY2fQ.UMZ0EPSGGopJgYsNhkW2PRExghGhYNEb8tfpItd-8Rk
GEMINI_API_KEY=AIzaSyC4ijLN6BIBOvLphqibawLhIQt8u_Lc5EQ
```

## 🔍 문제 해결

### 환경 변수가 적용되지 않는 경우
1. 환경 변수 추가 후 **반드시 재배포**해야 합니다
2. Key 이름이 정확한지 다시 확인하세요
3. Value에 공백이나 줄바꿈이 없는지 확인하세요

### 빌드 실패 시
1. Vercel 로그에서 어떤 환경 변수가 누락되었는지 확인
2. Environment Variables 목록에서 누락된 변수 추가
3. 다시 배포

## ✅ 체크리스트

배포 전 확인사항:
- [ ] 모든 필수 환경 변수 7개 추가 완료
- [ ] Key 이름이 정확히 입력되었는지 확인
- [ ] Value 값이 전체 값으로 입력되었는지 확인
- [ ] Environment가 Production, Preview, Development 모두 선택되었는지 확인
- [ ] 환경 변수 추가 후 재배포 실행

