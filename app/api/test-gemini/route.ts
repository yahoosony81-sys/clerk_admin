import { NextRequest, NextResponse } from 'next/server'
import { generateResponse } from '@/lib/gemini'
import { isAdmin } from '@/lib/auth'

/**
 * GET: Gemini API 연결 테스트 (관리자 전용)
 * 간단한 인사말로 모델 작동 여부를 확인합니다.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. 관리자 권한 확인
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // 2. Gemini API 호출 테스트
    const result = await generateResponse('Hello! Please introduce yourself in one sentence.')
    
    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error: any) {
    console.error('Gemini Test API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal Server Error' 
      },
      { status: 500 }
    )
  }
}

/**
 * POST: 커스텀 프롬프트 테스트 (관리자 전용)
 * 클라이언트에서 보낸 프롬프트로 Gemini 응답을 테스트합니다.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. 관리자 권한 확인
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // 2. 요청 본문 파싱
    const body = await req.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    // 3. Gemini API 호출
    const result = await generateResponse(prompt)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error: any) {
    console.error('Gemini Test API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal Server Error' 
      },
      { status: 500 }
    )
  }
}

