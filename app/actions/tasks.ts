'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * 새로운 작업을 추가하는 Server Action입니다.
 * Server Actions는 서버에서 실행되므로 보안이 강화됩니다.
 * 
 * Supabase 공식 문서의 모범 사례를 따릅니다.
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
export async function addTask(name: string) {
  const client = await createClient()

  try {
    const response = await client.from('tasks').insert({
      name,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    console.log('작업이 성공적으로 추가되었습니다!', response)
    return { success: true }
  } catch (error: any) {
    console.error('작업 추가 중 오류 발생:', error.message)
    throw new Error('작업 추가에 실패했습니다')
  }
}

/**
 * 모든 작업을 가져오는 Server Action입니다.
 * 
 * Supabase 공식 문서의 모범 사례를 따릅니다.
 */
export async function getTasks() {
  const client = await createClient()

  try {
    const { data, error } = await client.from('tasks').select()

    if (error) {
      throw new Error(error.message)
    }

    return { data, error: null }
  } catch (error: any) {
    console.error('작업 조회 중 오류 발생:', error.message)
    return { data: null, error: error.message }
  }
}

