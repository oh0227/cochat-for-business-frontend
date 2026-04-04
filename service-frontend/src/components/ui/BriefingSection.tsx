import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import type { Briefing } from '@/types'

interface BriefingSectionProps {
  briefings: Briefing[]
}

export default function BriefingSection({ briefings }: BriefingSectionProps) {
  return (
    <div className="flex flex-1 flex-col gap-[var(--spacing-md)] rounded-[14px] border border-[var(--color-gray-80)] bg-white p-[21px]">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[var(--spacing-3xs)]">
          <div className="flex items-center gap-[var(--spacing-2xs)]">
            <span
              className="flex items-center justify-center rounded-[10px] bg-[rgba(43,127,255,0.1)]"
              style={{ width: '36px', height: '36px' }}
            >
              <Sparkles size={20} className="text-[var(--color-normal-500)]" />
            </span>
            <span
              className="font-semibold text-[var(--color-gray-950)]"
              style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
            >
              최근 브리핑
            </span>
          </div>
          <p
            className="text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
          >
            오늘의 알림을 브리핑으로 확인하세요
          </p>
        </div>
        <Link
          href="/briefing"
          className="font-medium text-[var(--color-brand-700)] transition-opacity hover:opacity-70"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          더보기
        </Link>
      </div>

      {/* 브리핑 카드 목록 */}
      <div className="flex flex-col gap-[13px]">
        {briefings.map((briefing) => (
          <BriefingCard key={briefing.id} briefing={briefing} />
        ))}
      </div>
    </div>
  )
}

function BriefingCard({ briefing }: { briefing: Briefing }) {
  const { title, content, criticalCount, highCount, mediumCount } = briefing

  return (
    <div className="flex flex-col gap-[var(--spacing-sm)] rounded-[10px] border border-[var(--color-gray-80)] bg-white p-[17px]">
      {/* 제목 + 본문 */}
      <div className="flex flex-col gap-[var(--spacing-3xs)]">
        <p
          className="font-semibold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
        >
          {title}
        </p>
        <p
          className="truncate text-[var(--color-gray-700)]"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          {content}
        </p>
      </div>

      {/* 우선순위 배지 */}
      <div className="flex items-center gap-[var(--spacing-2xs)]">
        {criticalCount > 0 && (
          <span className="inline-flex h-[28px] items-center justify-center rounded-[var(--radius-xs)] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] px-[var(--spacing-2xs)] font-medium text-[var(--color-urgent-500)]"
            style={{ fontSize: 'var(--font-size-3xs)' }}>
            긴급 ({criticalCount})
          </span>
        )}
        {highCount > 0 && (
          <span className="inline-flex h-[28px] items-center justify-center rounded-[var(--radius-xs)] border border-[rgba(247,144,9,0.2)] bg-[rgba(247,144,9,0.1)] px-[var(--spacing-2xs)] font-medium text-[var(--color-important-500)]"
            style={{ fontSize: 'var(--font-size-3xs)' }}>
            중요 ({highCount})
          </span>
        )}
        {mediumCount > 0 && (
          <span className="inline-flex h-[28px] items-center justify-center rounded-[var(--radius-xs)] border border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.1)] px-[var(--spacing-2xs)] font-medium text-[var(--color-normal-500)]"
            style={{ fontSize: 'var(--font-size-3xs)' }}>
            보통 ({mediumCount})
          </span>
        )}
      </div>
    </div>
  )
}
