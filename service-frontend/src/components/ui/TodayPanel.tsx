import { CalendarDays, Clock } from 'lucide-react'
import type { CalendarEvent } from '@/types'

interface TodayPanelProps {
  events: CalendarEvent[]
  date: Date
}

function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(new Date(isoString))
}

export default function TodayPanel({ events, date }: TodayPanelProps) {
  const dateLabel = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(date)

  return (
    <aside className="flex w-full shrink-0 flex-col gap-[var(--spacing-sm)] border-t border-[var(--color-gray-80)] p-[var(--spacing-sm)] lg:w-[280px] lg:border-l lg:border-t-0">
      {/* 헤더 */}
      <div className="flex items-center gap-[var(--spacing-2xs)]">
        <CalendarDays size={18} className="text-[var(--color-gray-700)]" />
        <span
          className="font-semibold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
        >
          오늘 일정
        </span>
      </div>

      {/* 날짜 */}
      <p
        className="text-[var(--color-gray-400)]"
        style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
      >
        {dateLabel}
      </p>

      {/* 이벤트 목록 */}
      <div className="flex flex-col gap-[var(--spacing-2xs)]">
        {events.length === 0 ? (
          <p
            className="text-[var(--color-gray-400)]"
            style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            오늘 일정이 없습니다.
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-[var(--spacing-4xs)] rounded-[var(--radius-xs)] bg-[var(--color-gray-20)] p-[var(--spacing-xs)]"
            >
              <p
                className="font-medium text-[var(--color-gray-950)]"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                {event.title}
              </p>
              {!event.isAllDay && (
                <div className="flex items-center gap-[var(--spacing-3xs)] text-[var(--color-gray-500)]">
                  <Clock size={12} />
                  <span style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}>
                    {formatTime(event.startAt)}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
