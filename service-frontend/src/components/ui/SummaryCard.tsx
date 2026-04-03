import Link from 'next/link'
import { AlertCircle, Clock, Info, Atom } from 'lucide-react'
import type { FocusSession } from '@/types'
import { getPriorityLabel, getPriorityColorClass } from '@/utils'

/* ─── 타입 ─────────────────────────────────────────────────────── */

interface PrioritySummaryCardProps {
  type: 'priority'
  priority: 'critical' | 'high' | 'medium'
  count: number
  subtext: string
}

interface FocusSummaryCardProps {
  type: 'focus'
  session: FocusSession | null
}

type SummaryCardProps = PrioritySummaryCardProps | FocusSummaryCardProps

/* ─── 메인 컴포넌트 ─────────────────────────────────────────────── */

export default function SummaryCard(props: SummaryCardProps) {
  if (props.type === 'focus') {
    return <FocusCard session={props.session} />
  }
  return (
    <PriorityCard
      priority={props.priority}
      count={props.count}
      subtext={props.subtext}
    />
  )
}

/* ─── 우선순위 카드 ─────────────────────────────────────────────── */

const PRIORITY_ICON = {
  critical: AlertCircle,
  high: Clock,
  medium: Info,
} as const

function PriorityCard({
  priority,
  count,
  subtext,
}: {
  priority: 'critical' | 'high' | 'medium'
  count: number
  subtext: string
}) {
  const { bg, text } = getPriorityColorClass(priority)
  const label = getPriorityLabel(priority)
  const Icon = PRIORITY_ICON[priority]

  return (
    <div
      className={`flex flex-col gap-[var(--spacing-xs)] rounded-[var(--radius-md)] p-[var(--spacing-sm)] ${bg}`}
    >
      {/* 아이콘 */}
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/60 ${text}`}
      >
        <Icon size={16} />
      </span>

      {/* 카운트 */}
      <span
        className={`font-bold leading-none ${text}`}
        style={{ fontSize: 'var(--font-size-4xl)' }}
      >
        {count}
      </span>

      {/* 라벨 */}
      <span
        className={`font-semibold ${text}`}
        style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
      >
        {label}
      </span>

      {/* 서브텍스트 */}
      <span
        className="text-[var(--color-gray-500)]"
        style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
      >
        {subtext}
      </span>
    </div>
  )
}

/* ─── 집중모드 카드 ─────────────────────────────────────────────── */

function FocusCard({ session }: { session: FocusSession | null }) {
  const isActive = session?.status === 'active'

  return (
    <div className="flex flex-col gap-[var(--spacing-xs)] rounded-[var(--radius-md)] bg-white p-[var(--spacing-sm)] shadow-sm">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <span
          className="font-semibold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          집중 모드
        </span>
        <Atom size={18} className="text-[var(--color-gray-400)]" />
      </div>

      {/* 설명 */}
      <p
        className="text-[var(--color-gray-500)]"
        style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}
      >
        {isActive
          ? `${session!.plannedDurationMinutes}분 세션 진행 중입니다.`
          : '집중 모드 중에는 긴급한 알림만 표시됩니다.'}
      </p>

      {/* 액션 */}
      <Link
        href="/deepwork"
        className="mt-auto flex items-center justify-center rounded-[var(--radius-xs)] bg-[var(--color-brand-500)] py-[var(--spacing-3xs)] font-semibold text-white transition-colors hover:bg-[var(--color-brand-600)]"
        style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
      >
        {isActive ? '세션 보기' : '시작하기'}
      </Link>
    </div>
  )
}
