'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarPlus, CalendarCheck, ExternalLink, Loader2 } from 'lucide-react'
import type { CalendarStatus } from '@/types'

interface CalendarEventActionProps {
  notificationId: string
  isScheduleRelated: boolean
  calendarStatus: CalendarStatus
  calendarEventUrl: string | null
  // sm: 알림 카드 등 좁은 공간용 pill 배지(기본값) / lg: 채팅방 후속 액션 바처럼 다른 버튼과 나란히 놓이는 컨텍스트용
  size?: 'sm' | 'lg'
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
  size = 'sm',
}: CalendarEventActionProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const notConnected = error?.includes('연동') ?? false

  if (!isScheduleRelated || calendarStatus === 'none' || calendarStatus === 'dismissed') return null

  if (calendarStatus === 'registered') {
    return (
      <a
        href={calendarEventUrl ?? undefined}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={
          size === 'lg'
            ? 'flex h-10 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-brand-100)] bg-[var(--color-brand-20)] px-4 font-medium text-[var(--color-brand-500)] transition-opacity hover:opacity-80'
            : 'flex shrink-0 items-center gap-[var(--spacing-4xs)] rounded-[var(--radius-8xl)] border border-[var(--color-brand-100)] bg-[var(--color-brand-20)] px-[var(--spacing-xs)] py-[var(--spacing-4xs)] font-medium text-[var(--color-brand-500)] transition-colors hover:bg-[var(--color-brand-80)]'
        }
        style={{ fontSize: size === 'lg' ? 'var(--font-size-xs)' : 'var(--font-size-5xs)' }}
      >
        <CalendarCheck size={size === 'lg' ? 22 : 12} />
        캘린더 등록됨
        <ExternalLink size={size === 'lg' ? 16 : 10} />
      </a>
    )
  }

  async function handleRegister(e: React.MouseEvent) {
    e.stopPropagation()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/notifications/${notificationId}/calendar-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json().catch(() => ({})) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? '캘린더 등록에 실패했습니다.')
        return
      }
      router.refresh()
    } catch (err) {
      console.error('[CalendarEventAction] 캘린더 등록 실패', err)
      setError('캘린더 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={size === 'lg' ? 'flex flex-col gap-[var(--spacing-3xs)]' : 'flex flex-col items-end gap-[var(--spacing-4xs)]'}>
      <button
        type="button"
        onClick={handleRegister}
        disabled={submitting}
        className={
          size === 'lg'
            ? 'flex h-10 items-center gap-2 rounded-[var(--radius-sm)] px-4 font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60'
            : 'flex shrink-0 items-center gap-[var(--spacing-4xs)] rounded-[var(--radius-8xl)] border border-[var(--color-gray-100)] px-[var(--spacing-xs)] py-[var(--spacing-4xs)] font-medium text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)] disabled:cursor-not-allowed disabled:opacity-60'
        }
        style={{
          fontSize: size === 'lg' ? 'var(--font-size-xs)' : 'var(--font-size-5xs)',
          background: size === 'lg' ? 'var(--color-gray-inverse)' : undefined,
        }}
      >
        {submitting ? <Loader2 size={size === 'lg' ? 22 : 12} className="animate-spin" /> : <CalendarPlus size={size === 'lg' ? 22 : 12} />}
        캘린더에 등록
      </button>
      {error && (
        <p
          className={size === 'lg' ? 'text-[var(--color-urgent-500)]' : 'max-w-[180px] text-right text-[var(--color-urgent-500)]'}
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          {error}
          {notConnected && (
            <>
              {' '}
              <Link
                href="/settings"
                onClick={(e) => e.stopPropagation()}
                className="font-medium underline"
              >
                설정에서 연동하기
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  )
}
