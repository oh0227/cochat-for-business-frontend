import { getNotifications, getBriefings } from '@/lib/api'
import { toBriefing } from '@/lib/briefing'
import SummaryCard from '@/components/ui/SummaryCard'
import MessagePriorityCard from '@/components/ui/MessagePriorityCard'
import MessageSection from '@/components/ui/MessageSection'
import BriefingSection from '@/components/ui/BriefingSection'

export default async function DashboardPage() {
  const [notifications, briefings] = await Promise.all([getNotifications(), getBriefings()])

  const criticalCount = notifications.filter((n) => n.priority === 'critical').length
  const highCount = notifications.filter((n) => n.priority === 'high').length
  const mediumCount = notifications.filter((n) => n.priority === 'medium').length
  const lowCount = notifications.filter((n) => n.priority === 'low').length

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

      {/* 요약 카드 5개 — 5칸이 한 줄에 여유 있게 들어가는 xl(1280px) 이상에서만 큰 카드를 쓰고,
          태블릿/모바일에서는 압축형 가로 카드(메시지 페이지와 동일 컴포넌트)로 영역을 줄여서
          아래 메시지/브리핑 섹션에 더 많은 공간을 준다. */}
      <div className="flex flex-col gap-[var(--spacing-sm)] xl:hidden">
        <div className="grid grid-cols-2 gap-[var(--spacing-2xs)] sm:grid-cols-4">
          <MessagePriorityCard priority="critical" count={criticalCount} />
          <MessagePriorityCard priority="high" count={highCount} />
          <MessagePriorityCard priority="medium" count={mediumCount} />
          <MessagePriorityCard priority="low" count={lowCount} />
        </div>
        <SummaryCard type="focus" />
      </div>
      <div className="hidden gap-[var(--spacing-sm)] xl:grid xl:grid-cols-5">
        <SummaryCard type="priority" priority="critical" count={criticalCount} subtext="즉시 조치 필요" />
        <SummaryCard type="priority" priority="high" count={highCount} subtext="오늘 안에 확인" />
        <SummaryCard type="priority" priority="medium" count={mediumCount} subtext="여유있게 확인" />
        <SummaryCard type="priority" priority="low" count={lowCount} subtext="나중에 확인" />
        <SummaryCard type="focus" />
      </div>

      {/* 콘텐츠 2열 */}
      <div className="flex flex-col gap-[20px] lg:flex-row">
        <MessageSection notifications={recentNotifications} />
        <BriefingSection briefings={recentBriefings} />
      </div>
    </div>
  )
}
