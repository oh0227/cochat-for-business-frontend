import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import type { Briefing } from '@/types'
import { formatRelativeTime } from '@/utils'
import PriorityBadge from './PriorityBadge'

interface BriefingSectionProps {
  briefings: Briefing[]
}

export default function BriefingSection({ briefings }: BriefingSectionProps) {
  return (
    <div className="flex flex-col rounded-[var(--radius-md)] bg-white p-[var(--spacing-sm)] shadow-sm">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-[var(--spacing-4xs)] flex items-center gap-[var(--spacing-3xs)]">
            <Sparkles size={16} className="text-[var(--color-gray-700)]" />
            <span
              className="font-semibold text-[var(--color-gray-950)]"
              style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
            >
              최근 브리핑
            </span>
          </div>
          <p
            className="text-[var(--color-gray-400)]"
            style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
          >
            오늘의 알림을 브리핑으로 확인하세요
          </p>
        </div>
        <Link
          href="/briefing"
          className="font-medium text-[var(--color-brand-500)] transition-opacity hover:opacity-70"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          더보기
        </Link>
      </div>

      {/* 브리핑 카드 목록 */}
      <div className="mt-[var(--spacing-xs)] flex flex-col gap-[var(--spacing-3xs)]">
        {briefings.map((briefing) => (
          <BriefingCard key={briefing.id} briefing={briefing} />
        ))}
      </div>
    </div>
  )
}

function BriefingCard({ briefing }: { briefing: Briefing }) {
  const { title, content, criticalCount, highCount, mediumCount, generatedAt } = briefing

  return (
    <div className="flex flex-col gap-[var(--spacing-3xs)] rounded-[var(--radius-sm)] border border-[var(--color-gray-80)] p-[var(--spacing-xs)]">
      {/* 제목 */}
      <div className="flex items-start justify-between gap-[var(--spacing-xs)]">
        <span
          className="font-semibold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          {title}
        </span>
        <span
          className="shrink-0 text-[var(--color-gray-400)]"
          style={{ fontSize: '10px', lineHeight: '14px' }}
        >
          {formatRelativeTime(generatedAt)}
        </span>
      </div>

      {/* 본문 미리보기 */}
      <p
        className="line-clamp-2 text-[var(--color-gray-500)]"
        style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}
      >
        {content}
      </p>

      {/* 우선순위 배지 */}
      <div className="flex items-center gap-[var(--spacing-3xs)]">
        {criticalCount > 0 && (
          <div className="flex items-center gap-[var(--spacing-4xs)]">
            <PriorityBadge priority="critical" />
            <span
              className="text-[var(--color-gray-500)]"
              style={{ fontSize: '10px' }}
            >
              ({criticalCount})
            </span>
          </div>
        )}
        {highCount > 0 && (
          <div className="flex items-center gap-[var(--spacing-4xs)]">
            <PriorityBadge priority="high" />
            <span
              className="text-[var(--color-gray-500)]"
              style={{ fontSize: '10px' }}
            >
              ({highCount})
            </span>
          </div>
        )}
        {mediumCount > 0 && (
          <div className="flex items-center gap-[var(--spacing-4xs)]">
            <PriorityBadge priority="medium" />
            <span
              className="text-[var(--color-gray-500)]"
              style={{ fontSize: '10px' }}
            >
              ({mediumCount})
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
