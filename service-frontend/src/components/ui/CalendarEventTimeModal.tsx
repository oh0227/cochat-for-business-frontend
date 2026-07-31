'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, CalendarPlus, Loader2 } from 'lucide-react'
import { toDatetimeLocalValue } from '@/lib/datetime'

interface CalendarEventTimeModalProps {
  defaultStartTime: string // ISO 8601 - 시작값(AI가 추출한 일정 시간, 없으면 메시지 도착 시각)
  defaultDurationMinutes?: number | null // AI가 추출한 예상 소요 시간(분), 없으면 30분
  submitting: boolean
  error?: string | null
  showSettingsLink?: boolean
  onCancel: () => void
  onConfirm: (params: { startTime: string; durationMinutes: number }) => void
}

/**
 * AI가 메시지에서 실제 일정 시간을 추출하지 못한 경우 메시지 도착 시각으로 폴백되므로,
 * 실제 일정 시간과 다를 수 있다. 등록 전에 사용자가 직접 확인/수정하도록 하는 모달.
 */
export default function CalendarEventTimeModal({
  defaultStartTime,
  defaultDurationMinutes,
  submitting,
  error,
  showSettingsLink,
  onCancel,
  onConfirm,
}: CalendarEventTimeModalProps) {
  const [value, setValue] = useState(() => toDatetimeLocalValue(defaultStartTime))
  const [duration, setDuration] = useState(() => defaultDurationMinutes ?? 30)

  function handleConfirm() {
    if (!value) return
    onConfirm({ startTime: new Date(value).toISOString(), durationMinutes: duration })
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="fixed inset-0 -z-10 bg-black/40" onClick={onCancel} />
      <div className="flex w-full max-w-[360px] flex-col gap-[var(--spacing-md)] rounded-[var(--radius-md)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] p-[var(--spacing-lg)] shadow-lg">
        <div className="flex items-center justify-between">
          <p
            className="font-semibold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
          >
            일정 시간 확인
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--color-gray-400)] transition-colors hover:bg-[var(--color-gray-50)]"
          >
            <X size={16} />
          </button>
        </div>

        <p
          className="text-[var(--color-gray-500)]"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          메시지 내용에 적힌 실제 일정 시간과 다를 수 있어요. 확인 후 필요하면 수정해주세요.
        </p>

        <label className="flex flex-col gap-[var(--spacing-4xs)]">
          <span
            className="font-medium text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-4xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            시작 시각
          </span>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-[var(--radius-xs)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-xs)' }}
          />
        </label>

        <label className="flex flex-col gap-[var(--spacing-4xs)]">
          <span
            className="font-medium text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-4xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            소요 시간 (분)
          </span>
          <input
            type="number"
            min={15}
            step={15}
            value={duration}
            onChange={(e) => setDuration(Math.max(15, Number(e.target.value) || 30))}
            className="rounded-[var(--radius-xs)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-xs)' }}
          />
        </label>

        {error && (
          <p
            className="rounded-[var(--radius-xs)] bg-[var(--color-urgent-50)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-[var(--color-urgent-500)]"
            style={{ fontSize: 'var(--font-size-4xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            {error}
            {showSettingsLink && (
              <>
                {' '}
                <Link href="/settings" className="font-medium underline">
                  설정에서 연동하기
                </Link>
              </>
            )}
          </p>
        )}

        <div className="flex justify-end gap-[var(--spacing-2xs)]">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex h-10 items-center justify-center rounded-[var(--radius-xs)] border border-[var(--color-gray-80)] px-[var(--spacing-md)] font-medium text-[var(--color-gray-700)] transition-opacity hover:opacity-80 disabled:opacity-60"
            style={{ fontSize: 'var(--font-size-3xs)' }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="flex h-10 items-center justify-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] bg-[var(--color-brand-500)] px-[var(--spacing-md)] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
            style={{ fontSize: 'var(--font-size-3xs)' }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <CalendarPlus size={14} />}
            등록
          </button>
        </div>
      </div>
    </div>
  )
}
