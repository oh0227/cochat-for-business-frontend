'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, CalendarPlus, Loader2, TriangleAlert } from 'lucide-react'
import CalendarGrid, { buildCalendarDays } from '@/components/ui/CalendarGrid'
import TodayPanel from '@/components/ui/TodayPanel'
import EventFormModal, { type EventFormData } from '@/components/ui/EventFormModal'
import { listCalendarEvents, createCalendarEvent, updateCalendarEvent, type CalendarEventInput } from '@/lib/calendarEvents'
import type { CalendarEvent } from '@/types'

const pad = (n: number) => String(n).padStart(2, '0')

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Date + "HH:MM" → "YYYY-MM-DDTHH:MM:00+09:00" */
function parseToIso(date: Date, time: string): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const [hour, minute] = time ? time.split(':').map(Number) : [0, 0]
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+09:00`
}

/** ISO(+09:00) 문자열에 분을 더해 같은 형식으로 반환 (백엔드 end_at 기본값과 동일한 +30분 규칙) */
function addMinutes(iso: string, minutes: number): string {
  const d = new Date(new Date(iso).getTime() + minutes * 60_000)
  const kst = new Date(d.getTime() + 9 * 3600_000)
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}T${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}:00+09:00`
}

export default function CalendarPage() {
  const today = new Date()
  const todayStr = toDateKey(today)

  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [notConnected, setNotConnected] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const todayEvents = events.filter((e) => e.startAt.startsWith(todayStr))

  async function handleMonthChange(year: number, month: number) {
    const days = buildCalendarDays(year, month)
    const from = toDateKey(days[0])
    const to = toDateKey(days[days.length - 1])

    setLoading(true)
    setLoadError(null)
    const result = await listCalendarEvents(from, to)
    setLoading(false)

    if (!result.ok) {
      setNotConnected(result.notConnected)
      setLoadError(result.notConnected ? null : result.error)
      setEvents([])
      return
    }
    setNotConnected(false)
    setEvents(result.events)
  }

  function openCreateModal() {
    if (notConnected) return
    setEditEvent(null)
    setFormError(null)
    setModalOpen(true)
  }

  function openEditModal(event: CalendarEvent) {
    setEditEvent(event)
    setFormError(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditEvent(null)
    setFormError(null)
  }

  async function handleSubmit(data: EventFormData) {
    const startAt = parseToIso(data.date ?? new Date(), data.time)
    const isAllDay = !data.time.trim()
    const endAt = addMinutes(startAt, 30)

    const input: CalendarEventInput = {
      title: data.title,
      startAt,
      endAt,
      isAllDay,
      attendees: data.attendees,
      description: data.memo || null,
    }

    setSubmitting(true)
    setFormError(null)
    const result = editEvent
      ? await updateCalendarEvent(editEvent.id, input)
      : await createCalendarEvent(input)
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.error)
      return
    }

    setEvents((prev) =>
      editEvent
        ? prev.map((e) => (e.id === result.event.id ? result.event : e))
        : [...prev, result.event],
    )
    closeModal()
  }

  return (
    <div className="flex flex-col lg:h-[calc(100vh_-_2*var(--spacing-lg))] lg:overflow-hidden">
      {/* 페이지 헤더 */}
      <div className="mb-[var(--spacing-sm)] flex flex-col gap-[var(--spacing-sm)] sm:flex-row sm:items-center sm:justify-between sm:gap-[var(--spacing-lg)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-3xs)]">
          <h1
            className="font-bold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-2xl)', lineHeight: 'var(--line-height-3xl)' }}
          >
            캘린더
          </h1>
          <p
            className="flex items-center gap-[var(--spacing-3xs)] text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
          >
            메시지에서 정리한 일정과 마감을 한곳에서 관리할 수 있어요.
            {loading && <Loader2 size={14} className="animate-spin text-[var(--color-gray-400)]" />}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-[var(--spacing-2xs)]">
          <button
            type="button"
            className="flex h-[48px] items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] bg-[var(--color-gray-50)] px-[var(--spacing-sm)] font-medium text-[var(--color-gray-950)] transition-colors hover:bg-[var(--color-gray-80)]"
            style={{ fontSize: 'var(--font-size-xs)' }}
          >
            <CalendarDays size={24} />
            오늘
          </button>
          {notConnected ? (
            <Link
              href="/settings"
              className="flex h-[48px] items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] bg-[var(--color-brand-500)] px-[var(--spacing-sm)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
              style={{ fontSize: 'var(--font-size-xs)' }}
            >
              <CalendarPlus size={24} />
              Google Calendar 연동하기
            </Link>
          ) : (
            <button
              type="button"
              onClick={openCreateModal}
              className="flex h-[48px] items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] bg-[var(--color-brand-500)] px-[var(--spacing-sm)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
              style={{ fontSize: 'var(--font-size-xs)' }}
            >
              <CalendarPlus size={24} />
              일정 추가
            </button>
          )}
        </div>
      </div>

      {notConnected && (
        <div
          className="mb-[var(--spacing-sm)] flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
          style={{ background: 'var(--color-urgent-50)', color: 'var(--color-urgent-500)' }}
        >
          <TriangleAlert size={18} />
          <span style={{ fontSize: 'var(--font-size-3xs)' }}>
            Google Calendar 연동이 필요합니다. <Link href="/settings" className="font-medium underline">설정에서 연동하기</Link>
          </span>
        </div>
      )}
      {loadError && !notConnected && (
        <div
          className="mb-[var(--spacing-sm)] flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
          style={{ background: 'var(--color-urgent-50)', color: 'var(--color-urgent-500)' }}
        >
          <TriangleAlert size={18} />
          <span style={{ fontSize: 'var(--font-size-3xs)' }}>{loadError}</span>
        </div>
      )}

      {/* 캘린더 + 오늘 일정 사이드바 */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] lg:flex-row">
        <CalendarGrid
          events={events}
          initialYear={today.getFullYear()}
          initialMonth={today.getMonth()}
          onEditEvent={openEditModal}
          onMonthChange={handleMonthChange}
        />
        <TodayPanel events={todayEvents} date={today} />
      </div>

      {modalOpen && (
        <EventFormModal
          event={editEvent}
          submitting={submitting}
          error={formError}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
