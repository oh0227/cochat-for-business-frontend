'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarPlus, X, Loader2 } from 'lucide-react'
import { useCalendarPromptStore } from '@/store/calendarPromptStore'
import { toDatetimeLocalValue } from '@/lib/datetime'

interface CalendarCandidateNotification {
  id: number
  title: string
  summary: string
  calendar_status: string
  occurred_at: string
}

/**
 * 마운트 시 오프라인 중 놓친 prompted 알림을 한 번 캐치업해 큐에 채워 넣고,
 * 큐에 쌓인 순서대로(NotificationStream의 실시간 enqueue 포함) 한 건씩 등록 제안 모달을 띄운다.
 */
export default function CalendarPromptModal() {
  const router = useRouter()
  const { queue, enqueue, dequeue } = useCalendarPromptStore()
  const [submitting, setSubmitting] = useState<'register' | 'dismiss' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const notConnected = error?.includes('연동') ?? false

  function close() {
    setError(null)
    dequeue()
  }

  useEffect(() => {
    let cancelled = false

    fetch('/api/notifications/calendar-candidates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { notifications?: CalendarCandidateNotification[] } | null) => {
        if (cancelled || !data) return
        for (const n of data.notifications ?? []) {
          if (n.calendar_status === 'prompted') {
            enqueue({ notificationId: String(n.id), title: n.title, summary: n.summary, occurredAt: n.occurred_at })
          }
        }
      })
      .catch((error) => {
        console.error('[CalendarPromptModal] 캘린더 등록 후보 조회 실패', error)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const current = queue[0]
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState(30)

  // 큐가 다음 항목으로 넘어가면 시간 입력을 그 항목의 값으로 초기화
  useEffect(() => {
    if (!current) return
    setStartTime(toDatetimeLocalValue(current.occurredAt))
    setDuration(30)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.notificationId])

  if (!current) return null

  async function respond(action: 'register' | 'dismiss') {
    if (!current) return
    setSubmitting(action)
    setError(null)
    try {
      const path = action === 'register'
        ? `/api/notifications/${current.notificationId}/calendar-event`
        : `/api/notifications/${current.notificationId}/calendar-event/dismiss`
      const res = await fetch(path, {
        method: 'POST',
        headers: action === 'register' ? { 'Content-Type': 'application/json' } : undefined,
        body: action === 'register' && startTime
          ? JSON.stringify({ start_time: new Date(startTime).toISOString(), duration_minutes: duration })
          : undefined,
      })
      const data = await res.json().catch(() => ({})) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? `캘린더 ${action === 'register' ? '등록' : '거절'}에 실패했습니다.`)
        return
      }
      router.refresh()
      dequeue()
    } catch (err) {
      console.error(`[CalendarPromptModal] ${action} 실패`, err)
      setError(`캘린더 ${action === 'register' ? '등록' : '거절'}에 실패했습니다.`)
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      <div
        className="fixed inset-0 -z-10 bg-black/40"
        onClick={close}
      />
      <div className="flex w-full max-w-[420px] flex-col gap-[var(--spacing-md)] rounded-[var(--radius-md)] border border-[var(--color-brand-100)] bg-[var(--color-gray-default)] p-[var(--spacing-lg)] shadow-lg">
        <div className="flex items-start justify-between gap-[var(--spacing-sm)]">
          <div className="flex items-center gap-[var(--spacing-2xs)]">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'var(--color-brand-20)' }}
            >
              <CalendarPlus size={18} className="text-[var(--color-brand-500)]" />
            </span>
            <p
              className="font-semibold text-[var(--color-gray-950)]"
              style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
            >
              일정 등록 제안
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--color-gray-400)] transition-colors hover:bg-[var(--color-gray-50)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-[var(--spacing-3xs)]">
          <p
            className="text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            이 알림은 일정에 관련된 것 같습니다. 캘린더에 등록할까요?
          </p>
          <div className="rounded-[var(--radius-xs)] bg-[var(--color-gray-20)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]">
            <p
              className="font-medium text-[var(--color-gray-950)]"
              style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
            >
              {current.title}
            </p>
            {current.summary && (
              <p
                className="text-[var(--color-gray-500)]"
                style={{ fontSize: 'var(--font-size-4xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                {current.summary}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-[var(--spacing-2xs)]">
          <label className="flex flex-1 flex-col gap-[var(--spacing-4xs)]">
            <span
              className="font-medium text-[var(--color-gray-700)]"
              style={{ fontSize: 'var(--font-size-4xs)', lineHeight: 'var(--line-height-4xs)' }}
            >
              시작 시각
            </span>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-[var(--radius-xs)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-[var(--color-gray-950)]"
              style={{ fontSize: 'var(--font-size-3xs)' }}
            />
          </label>
          <label className="flex w-[96px] flex-col gap-[var(--spacing-4xs)]">
            <span
              className="font-medium text-[var(--color-gray-700)]"
              style={{ fontSize: 'var(--font-size-4xs)', lineHeight: 'var(--line-height-4xs)' }}
            >
              소요 시간(분)
            </span>
            <input
              type="number"
              min={15}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Math.max(15, Number(e.target.value) || 30))}
              className="rounded-[var(--radius-xs)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-[var(--color-gray-950)]"
              style={{ fontSize: 'var(--font-size-3xs)' }}
            />
          </label>
        </div>

        {error && (
          <p
            className="rounded-[var(--radius-xs)] bg-[var(--color-urgent-50)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-[var(--color-urgent-500)]"
            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            {error}
            {notConnected && (
              <>
                {' '}
                <Link href="/settings" onClick={close} className="font-medium underline">
                  설정에서 연동하기
                </Link>
              </>
            )}
          </p>
        )}

        <div className="flex justify-end gap-[var(--spacing-2xs)]">
          <button
            type="button"
            onClick={() => respond('dismiss')}
            disabled={submitting !== null}
            className="flex h-10 items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-gray-80)] px-[var(--spacing-md)] font-medium text-[var(--color-gray-700)] transition-opacity hover:opacity-80 disabled:opacity-60"
            style={{ fontSize: 'var(--font-size-3xs)' }}
          >
            {submitting === 'dismiss' && <Loader2 size={14} className="mr-[var(--spacing-4xs)] animate-spin" />}
            괜찮아요
          </button>
          <button
            type="button"
            onClick={() => respond('register')}
            disabled={submitting !== null}
            className="flex h-10 items-center justify-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] bg-[var(--color-brand-500)] px-[var(--spacing-md)] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
            style={{ fontSize: 'var(--font-size-3xs)' }}
          >
            {submitting === 'register' && <Loader2 size={14} className="animate-spin" />}
            캘린더에 등록
          </button>
        </div>
      </div>
    </div>
  )
}
