'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarPlus, CalendarCheck, ExternalLink, Loader2 } from 'lucide-react'
import type { CalendarStatus } from '@/types'

interface CalendarEventActionProps {
  notificationId: string
  isScheduleRelated: boolean
  calendarStatus: CalendarStatus
  calendarEventUrl: string | null
}

/**
 * 알림의 calendarStatus에 따라 "캘린더에 등록" 버튼 또는 "캘린더 등록됨" 배지를 렌더링.
 * 전역 알림 상태가 없는 기존 컨벤션(NotificationStream)을 따라, 액션 성공 시 router.refresh()로 갱신한다.
 */
export default function CalendarEventAction({
  notificationId,
  isScheduleRelated,
  calendarStatus,
  calendarEventUrl,
}: CalendarEventActionProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  if (!isScheduleRelated || calendarStatus === 'none' || calendarStatus === 'dismissed') return null

  if (calendarStatus === 'registered') {
    return (
      <a
        href={calendarEventUrl ?? undefined}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex shrink-0 items-center gap-[var(--spacing-4xs)] rounded-[var(--radius-8xl)] border border-[var(--color-brand-100)] bg-[var(--color-brand-20)] px-[var(--spacing-xs)] py-[var(--spacing-4xs)] font-medium text-[var(--color-brand-500)] transition-colors hover:bg-[var(--color-brand-80)]"
        style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
      >
        <CalendarCheck size={12} />
        캘린더 등록됨
        <ExternalLink size={10} />
      </a>
    )
  }

  async function handleRegister(e: React.MouseEvent) {
    e.stopPropagation()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/notifications/${notificationId}/calendar-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) throw new Error(`캘린더 등록 실패 (status=${res.status})`)
      router.refresh()
    } catch (error) {
      console.error('[CalendarEventAction] 캘린더 등록 실패', error)
      setSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleRegister}
      disabled={submitting}
      className="flex shrink-0 items-center gap-[var(--spacing-4xs)] rounded-[var(--radius-8xl)] border border-[var(--color-gray-100)] px-[var(--spacing-xs)] py-[var(--spacing-4xs)] font-medium text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)] disabled:cursor-not-allowed disabled:opacity-60"
      style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
    >
      {submitting ? <Loader2 size={12} className="animate-spin" /> : <CalendarPlus size={12} />}
      캘린더에 등록
    </button>
  )
}
