import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import type { Briefing, NotificationProvider } from '@/types'
import { formatDate, formatTime } from '@/utils'

const PROVIDER_COLOR: Record<NotificationProvider, string> = {
  slack: 'bg-[#4a154b]',
  discord: 'bg-[#5865f2]',
  jira: 'bg-[#0052cc]',
  gmail: 'bg-[#ea4335]',
}

interface BriefingCardProps {
  briefing: Briefing
  providerCounts: Partial<Record<NotificationProvider, number>>
}

export default function BriefingCard({ briefing, providerCounts }: BriefingCardProps) {
  const { criticalCount, highCount, mediumCount, content, actionItems, generatedAt } = briefing

  const titleParts: { label: string; className: string }[] = []
  if (criticalCount > 0) titleParts.push({ label: `긴급 ${criticalCount}건`, className: 'text-[var(--color-urgent-500)]' })
  if (highCount > 0) titleParts.push({ label: `중요 ${highCount}건`, className: 'text-[var(--color-important-500)]' })
  if (mediumCount > 0) titleParts.push({ label: `보통 ${mediumCount}건`, className: 'text-[var(--color-normal-500)]' })

  const providerEntries = (Object.entries(providerCounts) as [NotificationProvider, number][]).filter(([, c]) => c > 0)

  return (
    <div className="flex flex-col gap-[var(--spacing-xs)] rounded-[var(--radius-sm)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] p-[var(--spacing-sm)]">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-[var(--spacing-xs)]">
        <p className="font-medium text-[var(--color-gray-950)]" style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}>
          {titleParts.map((part, i) => (
            <span key={part.label}>
              {i > 0 && <span className="text-[var(--color-gray-400)]"> · </span>}
              <span className={part.className}>{part.label}</span>
            </span>
          ))}
          <span className="text-[var(--color-gray-700)]">에 대한 브리핑입니다.</span>
        </p>
        <span className="shrink-0 text-[var(--color-gray-400)]" style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}>
          {formatDate(generatedAt)} {formatTime(generatedAt)}
        </span>
      </div>

      {/* AI 요약 */}
      <div className="rounded-[var(--radius-xs)] bg-[var(--color-brand-20)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)]">
        <p className="mb-[var(--spacing-4xs)] font-semibold text-[var(--color-brand-500)]" style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}>
          AI 요약
        </p>
        <p className="line-clamp-2 text-[var(--color-gray-900)]" style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}>
          {content}
        </p>
      </div>

      {/* 권장 조치 */}
      {actionItems.length > 0 && (
        <div className="rounded-[var(--radius-xs)] bg-[var(--color-gray-20)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)]">
          <p className="mb-[var(--spacing-4xs)] font-semibold text-[var(--color-gray-700)]" style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}>
            권장 조치
          </p>
          <p className="line-clamp-1 text-[var(--color-gray-900)]" style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}>
            {actionItems[0]}
          </p>
        </div>
      )}

      {/* 푸터 */}
      <div className="flex items-center justify-between pt-[var(--spacing-4xs)]">
        <div className="flex items-center gap-[var(--spacing-2xs)]">
          {providerEntries.map(([provider, count]) => (
            <span key={provider} className="flex items-center gap-[var(--spacing-4xs)]">
              <span className={['flex h-5 w-5 items-center justify-center rounded-full text-white', PROVIDER_COLOR[provider]].join(' ')}>
                <MessageSquare size={10} />
              </span>
              <span className="text-[var(--color-gray-500)]" style={{ fontSize: 'var(--font-size-5xs)' }}>
                ({count})
              </span>
            </span>
          ))}
        </div>
        <Link
          href={`/briefing/${briefing.id}`}
          className="rounded-[var(--radius-xs)] bg-[var(--color-brand-500)] px-[var(--spacing-xs)] py-[var(--spacing-3xs)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          상세보기
        </Link>
      </div>
    </div>
  )
}
