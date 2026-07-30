import { getNotifications, getBriefings } from '@/lib/api'
import { toBriefing } from '@/lib/briefing'
import SummaryCard from '@/components/ui/SummaryCard'
import MessageSection from '@/components/ui/MessageSection'
import BriefingSection from '@/components/ui/BriefingSection'

export default async function DashboardPage() {
  const [notifications, briefings] = await Promise.all([getNotifications(), getBriefings()])

  const criticalCount = notifications.filter((n) => n.priority === 'critical').length
  const highCount = notifications.filter((n) => n.priority === 'high').length
  const mediumCount = notifications.filter((n) => n.priority === 'medium').length

  const recentNotifications = notifications.slice(0, 3)
  const recentBriefings = briefings.slice(0, 2).map(toBriefing)

  return (
    <div className="flex flex-col gap-[var(--spacing-md)]">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-[var(--spacing-3xs)]">
        <h1
          className="font-bold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-2xl)', lineHeight: 'var(--line-height-3xl)' }}
        >
          알림 현황
        </h1>
        <p
          className="text-[var(--color-gray-700)]"
          style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
        >
          오늘의 업무 현황을 확인하세요
        </p>
      </div>

      {/* 요약 카드 4개 */}
      <div className="grid grid-cols-1 gap-[var(--spacing-sm)] sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard type="priority" priority="critical" count={criticalCount} subtext="즉시 조치 필요" />
        <SummaryCard type="priority" priority="high" count={highCount} subtext="오늘 안에 확인" />
        <SummaryCard type="priority" priority="medium" count={mediumCount} subtext="여유있게 확인" />
        <SummaryCard type="focus" session={null} />
      </div>

      {/* 콘텐츠 2열 */}
      <div className="flex flex-col gap-[20px] lg:flex-row">
        <MessageSection notifications={recentNotifications} />
        <BriefingSection briefings={recentBriefings} />
      </div>
    </div>
  )
}
