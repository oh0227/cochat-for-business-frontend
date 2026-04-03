import { MessageSquare } from 'lucide-react'
import type { Notification, NotificationProvider } from '@/types'
import PriorityBadge from './PriorityBadge'

const PROVIDER_COLOR: Record<NotificationProvider, string> = {
  slack: 'bg-[#4a154b]',
  discord: 'bg-[#5865f2]',
  jira: 'bg-[#0052cc]',
  gmail: 'bg-[#ea4335]',
}

interface NotificationCardProps {
  notification: Notification
  onClick?: () => void
}

export default function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const { summary, actor, channel, provider, priority, createdAt } = notification

  const subtext = [actor, channel].filter(Boolean).join(' · ')
  const time = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(createdAt))

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[var(--spacing-xs)] rounded-[var(--radius-xs)] bg-white px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-left transition-colors hover:bg-[var(--color-gray-20)]"
    >
      {/* Provider 아이콘 */}
      <span
        className={[
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white',
          PROVIDER_COLOR[provider],
        ].join(' ')}
      >
        <MessageSquare size={18} />
      </span>

      {/* 본문 */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p
          className="truncate font-medium text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          {summary}
        </p>
        <p
          className="truncate text-[var(--color-gray-400)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          {subtext} · {time}
        </p>
      </div>

      {/* 우선순위 배지 */}
      <PriorityBadge priority={priority} />
    </button>
  )
}
