import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY

// API 키가 없을 경우 경고 (빌드 타임 에러 방지)
if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Gemini features will not work.')
}

const genAI = new GoogleGenerativeAI(apiKey || '')

/**
 * 사용할 모델 목록 (우선순위 순)
 * 실패 시 다음 모델로 자동 전환됩니다.
 */
const MODELS = [
  'gemini-2.5-flash',      // 요청하신 최우선 모델 (존재하지 않을 수 있음)
  'gemini-2.0-flash',      // 차순위 (Experimental일 수 있음)
  'gemini-2.0-flash-exp',  // 2.0 Flash Experimental
  'gemini-1.5-pro',        // Stable Pro
  'gemini-1.5-flash',      // Stable Flash
  'gemini-pro',            // Legacy Pro
]

export interface GeminiResponse {
  text: string
  model: string
  triedModels: string[]
}

/**
 * Gemini API를 사용하여 텍스트 응답을 생성합니다.
 * 여러 모델을 순차적으로 시도하여 실패 시 자동으로 다음 모델을 사용합니다.
 * 
 * @param prompt - 입력 프롬프트
 * @returns 생성된 텍스트와 사용된 모델 정보
 */
export async function generateResponse(prompt: string): Promise<GeminiResponse> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.')
  }

  let lastError: any = null
  const triedModels: string[] = []

  for (const modelName of MODELS) {
    try {
      // console.log(`Attempting to generate with model: ${modelName}`)
      const model = genAI.getGenerativeModel({ model: modelName })
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      if (!text) {
        throw new Error('Empty response from API')
      }

      return {
        text,
        model: modelName,
        triedModels
      }
    } catch (error: any) {
      // console.warn(`Failed with model ${modelName}:`, error.message)
      lastError = error
      triedModels.push(modelName)
      // 다음 모델 시도
    }
  }

  throw new Error(
    `All Gemini models failed. Tried: ${triedModels.join(', ')}. Last Error: ${lastError?.message}`
  )
}

