import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'

/**
 * Supabase 공식 문서의 예제를 따르는 Instruments 페이지입니다.
 * 
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
async function InstrumentsData() {
  const supabase = await createClient()
  const { data: instruments } = await supabase.from('instruments').select()

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>
}

export default function Instruments() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Instruments 예제
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Supabase 공식 문서의 예제를 따라 구현한 페이지입니다
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <Suspense fallback={<div>Loading instruments...</div>}>
            <InstrumentsData />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

