'use client'

import React, { useState, useTransition } from 'react'
import { addTask } from '../actions/tasks'
import { useRouter } from 'next/navigation'

/**
 * 새로운 작업을 추가하는 폼 컴포넌트입니다.
 * useTransition을 사용하여 로딩 상태를 관리합니다.
 */
export default function AddTaskForm() {
  const [taskName, setTaskName] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (!taskName.trim()) {
      return
    }

    startTransition(async () => {
      try {
        await addTask(taskName)
        setTaskName('')
        // 페이지를 새로고침하여 최신 작업 목록을 표시합니다
        router.refresh()
      } catch (error) {
        console.error('작업 추가 실패:', error)
        alert('작업 추가에 실패했습니다. 다시 시도해주세요.')
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex gap-2">
      <input
        autoFocus
        type="text"
        name="name"
        placeholder="새 작업을 입력하세요"
        onChange={(e) => setTaskName(e.target.value)}
        value={taskName}
        disabled={isPending}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isPending || !taskName.trim()}
        className="px-6 py-2 bg-[#6c47ff] text-white rounded-lg font-medium hover:bg-[#5a3ae6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? '추가 중...' : '추가'}
      </button>
    </form>
  )
}

