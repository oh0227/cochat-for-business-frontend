import { CalendarDays, CalendarPlus } from 'lucide-react'
import { mockCalendarEvents } from '@/mocks'
import CalendarGrid from '@/components/ui/CalendarGrid'
import TodayPanel from '@/components/ui/TodayPanel'

export default function CalendarPage() {
  const today = new Date()

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const todayEvents = mockCalendarEvents.filter((e) =>
    e.startAt.startsWith(todayStr)
  )

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
          events={mockCalendarEvents}
          initialYear={today.getFullYear()}
          initialMonth={today.getMonth()}
        />
        <TodayPanel events={todayEvents} date={today} />
      </div>
    </div>
  )
}
