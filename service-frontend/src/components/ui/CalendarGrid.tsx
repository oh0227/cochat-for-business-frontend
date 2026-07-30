'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarEvent } from '@/types'
import EventDetailPanel from './EventDetailPanel'

const DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const

interface CalendarGridProps {
  events: CalendarEvent[]
  initialYear: number
  initialMonth: number // 0-indexed
  onEditEvent?: (event: CalendarEvent) => void
  onDeleteEvent?: (event: CalendarEvent) => void
  // 표시 중인 월이 바뀔 때(마운트 시 최초 1회 포함) 호출 — 부모가 해당 월 범위로 데이터를 재조회하는 용도
  onMonthChange?: (year: number, month: number) => void
}

/** YYYY-MM-DD 형식으로 날짜 키 생성 (로컬 기준) */
function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** ISO 문자열에서 로컬(KST) 날짜 키 추출 */
function eventDateKey(isoString: string): string {
  return toDateKey(new Date(isoString))
}

/** 해당 월의 캘린더 그리드를 구성하는 날짜 배열 반환 (42칸, 월요일 시작) */
export function buildCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const start = new Date(firstDay)
  start.setDate(1 - startOffset)

  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(new Date(isoString))
}

export default function CalendarGrid({ events, initialYear, initialMonth, onEditEvent, onDeleteEvent, onMonthChange }: CalendarGridProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // 마운트 시 최초 1회 + 이후 월 이동마다 부모에게 알려 해당 범위 데이터를 재조회하게 한다.
  useEffect(() => {
    onMonthChange?.(year, month)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month])

  const today = new Date()
  const todayKey = toDateKey(today)

  const days = buildCalendarDays(year, month)
  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7))

  // 날짜별 이벤트 맵
  const eventMap = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const key = eventDateKey(event.startAt)
    if (!eventMap.has(key)) eventMap.set(key, [])
    eventMap.get(key)!.push(event)
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-center gap-[var(--spacing-sm)] border-b border-[var(--color-gray-80)] py-[10px]">
          <button
            type="button"
            onClick={prevMonth}
            className="flex size-[36px] items-center justify-center rounded-[10px] text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
          >
            <ChevronLeft size={20} />
          </button>
          <span
            className="min-w-[100px] text-center font-medium text-[var(--color-gray-950)]"
            style={{ fontSize: '20px', lineHeight: '30px' }}
          >
            {year}년 {month + 1}월
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="flex size-[36px] items-center justify-center rounded-[10px] text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="flex border-b border-[var(--color-gray-80)]">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex h-[44px] flex-1 items-center justify-center border-r border-[var(--color-gray-80)] last:border-r-0"
            >
              <span
                className="font-medium text-[var(--color-gray-400)]"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="flex flex-1 flex-col">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-1 border-b border-[var(--color-gray-80)] last:border-b-0">
              {week.map((day, di) => {
                const isCurrentMonth = day.getMonth() === month
                const key = toDateKey(day)
                const isToday = key === todayKey
                const dayEvents = eventMap.get(key) ?? []
                const MAX_VISIBLE = 2
                const overflow = dayEvents.length - MAX_VISIBLE

                return (
                  <div
                    key={di}
                    className={[
                      'flex min-w-0 flex-1 flex-col border-r border-[var(--color-gray-80)] last:border-r-0',
                      !isCurrentMonth ? 'bg-[var(--color-gray-50)]' : '',
                    ].join(' ')}
                  >
                    {/* 날짜 숫자 */}
                    <div className="flex h-[44px] items-center justify-center p-[10px]">
                      <span
                        className={[
                          'flex size-[24px] items-center justify-center font-medium',
                          isToday
                            ? 'rounded-full bg-[var(--color-brand-500)] text-white'
                            : isCurrentMonth
                              ? 'text-[var(--color-gray-900)]'
                              : 'text-[var(--color-gray-400)]',
                        ].join(' ')}
                        style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                      >
                        {day.getDate()}
                      </span>
                    </div>

                    {/* 이벤트 목록 */}
                    <div className="flex flex-col gap-[6px] overflow-hidden p-[6px] pt-0">
                      {dayEvents.slice(0, MAX_VISIBLE).map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className="truncate rounded-[4px] bg-[var(--color-brand-500)] px-[6px] py-[2px] text-left text-white transition-opacity hover:opacity-80"
                          style={{ fontSize: '12px', lineHeight: '18px' }}
                          title={event.title}
                        >
                          {!event.isAllDay && (
                            <span className="mr-1 opacity-80">{formatTime(event.startAt)}</span>
                          )}
                          {event.title}
                        </button>
                      ))}
                      {overflow > 0 && (
                        <span
                          className="px-[6px] text-[var(--color-gray-500)]"
                          style={{ fontSize: '12px', lineHeight: '16px' }}
                        >
                          +{overflow}개 더보기
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 이벤트 상세 패널 */}
      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => {
            setSelectedEvent(null)
            onEditEvent?.(selectedEvent)
          }}
          onDelete={() => {
            setSelectedEvent(null)
            onDeleteEvent?.(selectedEvent)
          }}
        />
      )}
    </>
  )
}
