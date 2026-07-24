'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { FocusSession } from '@/types'

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

interface FocusTimerWidgetProps {
  session: FocusSession | null
}

export default function FocusTimerWidget({ session }: FocusTimerWidgetProps) {
  const isActive = session?.status === 'active'

  const [visible, setVisible] = useState(isActive)
  const [elapsed, setElapsed] = useState(() => {
    if (!isActive || !session?.startedAt) return 0
    return Math.max(0, Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000))
  })

  // 1초마다 경과 시간 증가
  useEffect(() => {
    if (!visible || !isActive) return
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [visible, isActive])

  if (!visible) return null

  return (
    <div className="fixed right-[var(--spacing-lg)] top-[var(--spacing-lg)] z-50 w-[200px] overflow-hidden rounded-[var(--radius-md)] border-2 border-[var(--color-brand-400)] bg-[var(--color-gray-default)] shadow-lg">
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-[var(--color-brand-50)] px-[var(--spacing-xs)] py-[var(--spacing-3xs)]">
        <span
          className="font-semibold text-[var(--color-brand-600)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          집중 중
        </span>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="flex h-5 w-5 items-center justify-center rounded-[var(--radius-3xs)] text-[var(--color-gray-400)] transition-colors hover:bg-[var(--color-gray-80)] hover:text-[var(--color-gray-700)]"
        >
          <X size={12} />
        </button>
      </div>

      {/* 타이머 */}
      <div className="flex flex-col items-center gap-[var(--spacing-xs)] px-[var(--spacing-xs)] py-[var(--spacing-sm)]">
        <span
          className="font-bold tabular-nums text-[var(--color-brand-500)]"
          style={{ fontSize: 'var(--font-size-2xl)', lineHeight: '1' }}
        >
          {formatElapsed(elapsed)}
        </span>

        {/* 종료 버튼 */}
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="w-full rounded-[var(--radius-xs)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] py-[var(--spacing-3xs)] font-semibold text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          종료
        </button>
      </div>
    </div>
  )
}
