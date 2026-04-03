import { mockNotifications, mockBriefings, mockFocusSessions } from '@/mocks'
import SummaryCard from '@/components/ui/SummaryCard'
import MessageSection from '@/components/ui/MessageSection'
import BriefingSection from '@/components/ui/BriefingSection'
import FocusTimerWidget from '@/components/ui/FocusTimerWidget'

export default function DashboardPage() {
  const activeSession = mockFocusSessions.find((s) => s.status === 'active') ?? null

  const criticalCount = mockNotifications.filter((n) => n.priority === 'critical').length
  const highCount = mockNotifications.filter((n) => n.priority === 'high').length
  const mediumCount = mockNotifications.filter((n) => n.priority === 'medium').length

  const recentNotifications = mockNotifications.slice(0, 3)
  const recentBriefings = mockBriefings.slice(0, 3)

  return (
    <>
      <div className="flex flex-col gap-[var(--spacing-sm)]">
        {/* 페이지 헤더 */}
        <div className="flex flex-col gap-[var(--spacing-4xs)]">
          <h1
            className="font-bold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-lg)' }}
          >
            알림 현황
          </h1>
          <p
            className="text-[var(--color-gray-400)]"
            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            오늘의 업무 현황을 확인하세요
          </p>
        </div>

        {/* 요약 카드 4개 */}
        <div className="grid grid-cols-4 gap-[var(--spacing-sm)]">
          <SummaryCard
            type="priority"
            priority="critical"
            count={criticalCount}
            subtext="즉시 조치 필요"
          />
          <SummaryCard
            type="priority"
            priority="high"
            count={highCount}
            subtext="오늘 안에 확인"
          />
          <SummaryCard
            type="priority"
            priority="medium"
            count={mediumCount}
            subtext="여유있게 확인"
          />
          <SummaryCard type="focus" session={activeSession} />
        </div>

        {/* 콘텐츠 2열 */}
        <div className="grid grid-cols-2 gap-[var(--spacing-sm)]">
          <MessageSection notifications={recentNotifications} />
          <BriefingSection briefings={recentBriefings} />
        </div>
      </div>

      {/* Floating 집중 타이머 위젯 */}
      <FocusTimerWidget session={activeSession} />
    </>
  )
}
