'use server'

import { checkChatPermission } from '@/lib/chat-permissions'
import { generateResponse } from '@/lib/gemini'

export interface SendMessageResult {
  success: boolean
  response?: string
  error?: string
}

const MAX_MESSAGE_LENGTH = 1000

/**
 * 사용자의 채팅 메시지를 처리하고 AI 응답을 반환합니다.
 * 
 * @param message 사용자 입력 메시지
 */
export async function sendMessage(message: string): Promise<SendMessageResult> {
  try {
    // 1. 입력값 검증
    if (!message || typeof message !== 'string' || !message.trim()) {
      return { success: false, error: '메시지를 입력해주세요.' }
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return { 
        success: false, 
        error: `메시지는 최대 ${MAX_MESSAGE_LENGTH}자까지 입력 가능합니다.` 
      }
    }

    // 2. 권한 확인
    // 관리자는 자동 통과, 일반 사용자는 DB 조회
    const hasPermission = await checkChatPermission()
    
    if (!hasPermission) {
      return { 
        success: false, 
        error: '챗봇 사용 권한이 없습니다.' 
      }
    }

    // 3. Gemini API 호출
    const aiResult = await generateResponse(message)

    return {
      success: true,
      response: aiResult.text
    }

  } catch (error: any) {
    console.error('SendMessage Action Error:', error)
    
    // 사용자에게 보여줄 에러 메시지 정제
    const errorMessage = error.message?.includes('API_KEY') 
      ? '시스템 설정 오류가 발생했습니다.' 
      : (error.message || '알 수 없는 오류가 발생했습니다.')

    return {
      success: false,
      error: errorMessage
    }
  }
}

