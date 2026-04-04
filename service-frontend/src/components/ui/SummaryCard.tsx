import Link from 'next/link'
import { AlertCircle, Clock, Info, Atom } from 'lucide-react'
import type { FocusSession } from '@/types'
import { getPriorityLabel } from '@/utils'

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

/* ─── 우선순위별 스타일 ───────────────────────────────────────────── */

const PRIORITY_STYLE = {
  critical: {
    bg: 'bg-[var(--color-urgent-50)]',
    border: 'border-[rgba(239,68,68,0.2)]',
    iconBg: 'bg-[rgba(239,68,68,0.1)]',
    text: 'text-[var(--color-urgent-500)]',
  },
  high: {
    bg: 'bg-[var(--color-important-50)]',
    border: 'border-[rgba(247,144,9,0.2)]',
    iconBg: 'bg-[rgba(247,144,9,0.1)]',
    text: 'text-[var(--color-important-500)]',
  },
  medium: {
    bg: 'bg-[var(--color-normal-50)]',
    border: 'border-[rgba(59,130,246,0.2)]',
    iconBg: 'bg-[rgba(59,130,246,0.1)]',
    text: 'text-[var(--color-normal-500)]',
  },
} as const

const PRIORITY_ICON = {
  critical: AlertCircle,
  high: Clock,
  medium: Info,
} as const

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

function PriorityCard({
  priority,
  count,
  subtext,
}: {
  priority: 'critical' | 'high' | 'medium'
  count: number
  subtext: string
}) {
  const { bg, border, iconBg, text } = PRIORITY_STYLE[priority]
  const label = getPriorityLabel(priority)
  const Icon = PRIORITY_ICON[priority]

  return (
    <div
      className={`flex flex-1 flex-col justify-between rounded-[var(--radius-sm)] border p-[var(--spacing-md)] ${bg} ${border}`}
      style={{ height: '170px' }}
    >
      {/* 아이콘 */}
      <span
        className={`flex items-center justify-center rounded-[10px] ${iconBg}`}
        style={{ width: '36px', height: '36px' }}
      >
        <Icon size={20} className={text} />
      </span>

      {/* 하단: 카운트 + 라벨 + 서브텍스트 */}
      <div className="flex flex-col gap-[2px]">
        <span
          className="font-semibold leading-[var(--line-height-lg)] text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-lg)' }}
        >
          {count}
        </span>
        <span
          className={`font-medium leading-[var(--line-height-4xs)] ${text}`}
          style={{ fontSize: 'var(--font-size-3xs)' }}
        >
          {label}
        </span>
        <span
          className="leading-[var(--line-height-5xs)] text-[var(--color-gray-700)]"
          style={{ fontSize: 'var(--font-size-5xs)' }}
        >
          {subtext}
        </span>
      </div>
    </div>
  )
}

/* ─── 집중모드 카드 ─────────────────────────────────────────────── */

function FocusCard({ session }: { session: FocusSession | null }) {
  const isActive = session?.status === 'active'

  return (
    <div
      className="flex flex-col justify-between rounded-[14px] border border-[var(--color-gray-80)] bg-white p-[var(--spacing-md)]"
      style={{ height: '170px' }}
    >
      {/* 상단: 제목 + 설명 + 아이콘 */}
      <div className="flex items-start justify-between gap-[var(--spacing-2xs)]">
        <div className="flex flex-col gap-[var(--spacing-3xs)]">
          <span
            className="font-semibold leading-[var(--line-height-xs)] text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-sm)' }}
          >
            집중 모드
          </span>
          <p
            className="leading-[var(--line-height-4xs)] text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-3xs)' }}
          >
            {isActive
              ? `${session!.plannedDurationMinutes}분 세션 진행 중입니다.`
              : <>집중 모드 중에는<br />긴급한 알림만 표시됩니다.</>}
          </p>
        </div>
        <span
          className="flex shrink-0 items-center justify-center rounded-[10px] bg-[rgba(90,93,219,0.1)]"
          style={{ width: '36px', height: '36px' }}
        >
          <Atom size={20} className="text-[var(--color-brand-600)]" />
        </span>
      </div>

      {/* 하단: 버튼 */}
      <Link
        href="/deepwork"
        className="flex h-[40px] w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-brand-500)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
        style={{ fontSize: 'var(--font-size-xs)' }}
      >
        {isActive ? '세션 보기' : '시작하기'}
      </Link>
    </div>
  )
}
