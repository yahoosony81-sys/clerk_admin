# Vercel 배포 가이드

이 문서는 Clerk Admin 프로젝트를 Vercel에 배포하는 방법을 설명합니다.

## 📋 배포 전 체크리스트

### 1. GitHub에 코드 푸시 완료 ✅
```bash
git remote add origin https://github.com/yahoosony81-sys/clerk_admin.git
git branch -M main
git push -u origin main
```

### 2. Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인합니다
2. **"Add New..."** → **"Project"** 클릭
3. GitHub 저장소에서 `clerk_admin` 선택
4. **"Import"** 클릭

### 3. 환경 변수 설정 (중요!)

Vercel 프로젝트 설정에서 다음 환경 변수들을 추가해야 합니다:

#### Clerk 환경 변수
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

#### Supabase 환경 변수
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (선택사항, 호환성용)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Gemini API 환경 변수
```
GEMINI_API_KEY=your_gemini_api_key
```

### 4. 환경 변수 설정 방법

1. Vercel 프로젝트 페이지에서 **"Settings"** 탭 클릭
2. 왼쪽 메뉴에서 **"Environment Variables"** 선택
3. 각 환경 변수를 추가:
   - **Key**: 환경 변수 이름
   - **Value**: 환경 변수 값
   - **Environment**: 
     - Production (프로덕션)
     - Preview (프리뷰)
     - Development (개발)
   - 모든 환경에 적용하려면 세 가지 모두 선택

### 5. 빌드 설정 확인

Vercel은 Next.js 프로젝트를 자동으로 감지하므로 추가 설정이 필요 없습니다. 하지만 확인해야 할 사항:

- **Framework Preset**: Next.js
- **Build Command**: `next build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `pnpm install` (또는 `npm install`)

### 6. 배포 실행

1. 환경 변수 설정 완료 후 **"Deploy"** 버튼 클릭
2. 배포가 완료되면 **"Visit"** 버튼으로 배포된 사이트 확인

## 🔧 추가 설정

### Clerk 프로덕션 키 사용

프로덕션 배포 시 Clerk Dashboard에서:
1. **"API Keys"** 메뉴로 이동
2. **"Production"** 키를 복사하여 Vercel 환경 변수에 설정
3. **"Allowed callback URLs"**에 Vercel 도메인 추가:
   - `https://your-project.vercel.app`
   - `https://your-project.vercel.app/api/auth/callback`

### Supabase 프로덕션 설정

1. Supabase Dashboard에서 프로덕션 프로젝트 확인
2. **"Project Settings"** → **"API"**에서 키 확인
3. Vercel 환경 변수에 프로덕션 키 설정

## 🐛 문제 해결

### 빌드 실패 시

1. **Vercel 로그 확인**: 프로젝트 페이지 → **"Deployments"** → 실패한 배포 클릭 → **"Build Logs"** 확인
2. **환경 변수 확인**: 모든 필수 환경 변수가 설정되었는지 확인
3. **로컬 빌드 테스트**: 
   ```bash
   pnpm run build
   ```

### 환경 변수 관련 에러

- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서 접근 가능합니다
- `NEXT_PUBLIC_` 접두사가 없는 변수는 서버 사이드에서만 사용됩니다
- 환경 변수 변경 후 재배포가 필요합니다

## 📝 참고사항

- 환경 변수는 배포 시점에 빌드에 포함됩니다
- 환경 변수를 변경한 후에는 **"Redeploy"**가 필요합니다
- 프로덕션과 프리뷰 환경의 환경 변수를 별도로 관리할 수 있습니다

## ✅ 배포 완료 후 확인사항

1. ✅ 사이트가 정상적으로 로드되는지 확인
2. ✅ 로그인/회원가입 기능 테스트
3. ✅ 대시보드 접근 확인
4. ✅ 관리자 페이지 접근 확인 (관리자 권한이 있는 경우)
5. ✅ 챗봇 기능 테스트
6. ✅ Supabase 데이터베이스 연결 확인

