'use client'

import { useState } from 'react'
import { CalendarDays, CalendarPlus } from 'lucide-react'
import { mockCalendarEvents } from '@/mocks'
import CalendarGrid from '@/components/ui/CalendarGrid'
import TodayPanel from '@/components/ui/TodayPanel'
import EventFormModal, { type EventFormData } from '@/components/ui/EventFormModal'
import type { CalendarEvent } from '@/types'

const pad = (n: number) => String(n).padStart(2, '0')

/** Date + "HH:MM" → "YYYY-MM-DDTHH:MM:00+09:00" */
function parseToIso(date: Date, time: string): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const [hour, minute] = time ? time.split(':').map(Number) : [0, 0]
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+09:00`
}

function addOneHour(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 3600_000)
  const kst = new Date(d.getTime() + 9 * 3600_000)
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}T${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}:00+09:00`
}

export default function CalendarPage() {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents)
  const [modalOpen, setModalOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null)

  const todayEvents = events.filter((e) => e.startAt.startsWith(todayStr))

  function openCreateModal() {
    setEditEvent(null)
    setModalOpen(true)
  }

  function openEditModal(event: CalendarEvent) {
    setEditEvent(event)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditEvent(null)
  }

  function handleSubmit(data: EventFormData) {
    const startAt = parseToIso(data.date ?? new Date(), data.time)
    const endAt = addOneHour(startAt)
    const isAllDay = !data.time.trim()

    if (editEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editEvent.id
            ? { ...e, title: data.title, startAt, endAt, isAllDay, attendees: data.attendees }
            : e,
        ),
      )
    } else {
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        title: data.title,
        startAt,
        endAt,
        isAllDay,
        attendees: data.attendees,
        relatedNotificationIds: [],
      }
      setEvents((prev) => [...prev, newEvent])
    }

    closeModal()
  }

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 2 * var(--spacing-lg))' }}>
      {/* 페이지 헤더 */}
      <div className="mb-[var(--spacing-sm)] flex items-center gap-[var(--spacing-lg)]">
        <div className="flex flex-1 flex-col gap-[var(--spacing-3xs)]">
          <h1
            className="font-bold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-2xl)', lineHeight: 'var(--line-height-3xl)' }}
          >
            캘린더
          </h1>
          <p
            className="text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
          >
            메시지에서 정리한 일정과 마감을 한곳에서 관리할 수 있어요.
          </p>
        </div>
        <div className="flex items-center gap-[var(--spacing-2xs)]">
          <button
            type="button"
            className="flex h-[48px] items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] bg-[rgba(46,50,55,0.08)] px-[var(--spacing-sm)] font-medium text-[var(--color-gray-950)] transition-colors hover:bg-[rgba(46,50,55,0.12)]"
            style={{ fontSize: 'var(--font-size-xs)' }}
          >
            <CalendarDays size={24} />
            오늘
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex h-[48px] items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] bg-[var(--color-brand-500)] px-[var(--spacing-sm)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
            style={{ fontSize: 'var(--font-size-xs)' }}
          >
            <CalendarPlus size={24} />
            일정 추가
          </button>
        </div>
      </div>

      {/* 캘린더 + 오늘 일정 사이드바 */}
      <div className="flex flex-1 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-gray-80)] bg-white">
        <CalendarGrid
          events={events}
          initialYear={today.getFullYear()}
          initialMonth={today.getMonth()}
          onEditEvent={openEditModal}
        />
        <TodayPanel events={todayEvents} date={today} />
      </div>

      {modalOpen && (
        <EventFormModal
          event={editEvent}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
