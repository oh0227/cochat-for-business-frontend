'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarPlus, CalendarCheck, ExternalLink } from 'lucide-react'
import type { CalendarStatus } from '@/types'
import { formatDate, formatTime } from '@/utils'
import CalendarEventTimeModal from './CalendarEventTimeModal'

interface CalendarEventActionProps {
  notificationId: string
  isScheduleRelated: boolean
  calendarStatus: CalendarStatus
  calendarEventUrl: string | null
  createdAt: string // 시간 확인 모달의 기본값 시드 폴백 (suggestedStartTime이 없을 때만 사용)
  suggestedStartTime?: string | null       // AI가 추출한 실제 일정 시작 시각 (있으면 createdAt 대신 기본값으로 사용)
  suggestedDurationMinutes?: number | null // AI가 추출한 예상 소요 시간(분)
  calendarEventStartTime?: string | null   // registered일 때 실제 등록된 이벤트 시작 시각
  calendarEventEndTime?: string | null     // registered일 때 실제 등록된 이벤트 종료 시각
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
  createdAt,
  suggestedStartTime,
  suggestedDurationMinutes,
  calendarEventStartTime,
  calendarEventEndTime,
  size = 'sm',
}: CalendarEventActionProps) {
  const router = useRouter()
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const notConnected = error?.includes('연동') ?? false

  // dismissed는 "실시간 팝업을 다시 띄우지 않는다"는 의미일 뿐, 일정 관련 표시와
  // 수동 등록 버튼은 계속 노출되어야 한다 (일정 무관인 none만 렌더링을 막는다).
  if (!isScheduleRelated || calendarStatus === 'none') return null

  if (calendarStatus === 'registered') {
    const eventTimeLabel = calendarEventStartTime
      ? `등록된 일정: ${formatDate(calendarEventStartTime)} ${formatTime(calendarEventStartTime)}${calendarEventEndTime ? ` ~ ${formatTime(calendarEventEndTime)}` : ''}`
      : undefined
    return (
      <a
        href={calendarEventUrl ?? undefined}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        title={eventTimeLabel}
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

  function handleOpenTimeModal(e: React.MouseEvent) {
    e.stopPropagation()
    setError(null)
    setShowTimeModal(true)
  }

  async function handleConfirmRegister({ startTime, durationMinutes }: { startTime: string; durationMinutes: number }) {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/notifications/${notificationId}/calendar-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_time: startTime, duration_minutes: durationMinutes }),
      })
      const data = await res.json().catch(() => ({})) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? '캘린더 등록에 실패했습니다.')
        return
      }
      setShowTimeModal(false)
      router.refresh()
    } catch (err) {
      console.error('[CalendarEventAction] 캘린더 등록 실패', err)
      setError('캘린더 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpenTimeModal}
        className={
          size === 'lg'
            ? 'flex h-10 items-center gap-2 rounded-[var(--radius-sm)] px-4 font-medium text-white transition-opacity hover:opacity-80'
            : 'flex shrink-0 items-center gap-[var(--spacing-4xs)] rounded-[var(--radius-8xl)] border border-[var(--color-gray-100)] px-[var(--spacing-xs)] py-[var(--spacing-4xs)] font-medium text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]'
        }
        style={{
          fontSize: size === 'lg' ? 'var(--font-size-xs)' : 'var(--font-size-5xs)',
          background: size === 'lg' ? 'var(--color-gray-inverse)' : undefined,
        }}
      >
        <CalendarPlus size={size === 'lg' ? 22 : 12} />
        캘린더에 등록
      </button>
      {showTimeModal && (
        <CalendarEventTimeModal
          defaultStartTime={suggestedStartTime ?? createdAt}
          defaultDurationMinutes={suggestedDurationMinutes}
          submitting={submitting}
          error={error}
          showSettingsLink={notConnected}
          onCancel={() => setShowTimeModal(false)}
          onConfirm={handleConfirmRegister}
        />
      )}
    </>
  )
}
