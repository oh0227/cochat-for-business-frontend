import { MessageSquare, Hash, Mail, Clipboard } from 'lucide-react'
import type { Notification, NotificationProvider } from '@/types'
import PriorityBadge from './PriorityBadge'
import { formatRelativeTime } from '@/utils'

const PROVIDER_STYLE: Record<
  NotificationProvider,
  { iconBg: string; Icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  discord: {
    iconBg: 'bg-[rgba(97,95,255,0.1)]',
    Icon: ({ size, className }) => <MessageSquare size={size} className={className ?? 'text-[#615fff]'} />,
  },
  slack: {
    iconBg: 'bg-[rgba(236,86,148,0.1)]',
    Icon: ({ size, className }) => <Hash size={size} className={className ?? 'text-[#ec5694]'} />,
  },
  jira: {
    iconBg: 'bg-[rgba(0,82,204,0.1)]',
    Icon: ({ size, className }) => <Clipboard size={size} className={className ?? 'text-[#0052cc]'} />,
  },
  gmail: {
    iconBg: 'bg-[rgba(234,67,53,0.1)]',
    Icon: ({ size, className }) => <Mail size={size} className={className ?? 'text-[#ea4335]'} />,
  },
}

interface NotificationCardProps {
  notification: Notification
  onClick?: () => void
}

export default function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const { summary, actor, channel, provider, priority, createdAt } = notification
  const { iconBg, Icon } = PROVIDER_STYLE[provider]

  const infoItems = [channel, actor, formatRelativeTime(createdAt)].filter(Boolean)

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[var(--spacing-sm)] rounded-[var(--radius-sm)] border border-[var(--color-gray-80)] bg-white p-[21px] text-left transition-colors hover:bg-[var(--color-gray-20)]"
    >
      {/* 플랫폼 아이콘 */}
      <span
        className={`flex shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}
        style={{ width: '36px', height: '36px' }}
      >
        <Icon size={20} />
      </span>

      {/* 본문 */}
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-3xs)]">
        <p
          className="truncate font-semibold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
        >
          {summary}
        </p>
        <p
          className="truncate text-[var(--color-gray-400)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          {infoItems.join(' · ')}
        </p>
      </div>

      {/* 우선순위 배지 */}
      <PriorityBadge priority={priority} />
    </button>
  )
}
