import Link from 'next/link'
import { MessageSquare, Hash, ChevronRight } from 'lucide-react'
import type { ChannelSummary, NotificationPriority, NotificationProvider } from '@/types'
import { formatRelativeTime } from '@/utils'

const PROVIDER_STYLE: Record<
  NotificationProvider,
  { iconBg: string; textColor: string; Icon: React.ComponentType<{ size?: number; color?: string }> }
> = {
  slack: {
    iconBg: 'rgba(236,86,148,0.1)',
    textColor: '#ec5694',
    Icon: ({ size, color }) => <Hash size={size} color={color ?? '#ec5694'} />,
  },
  discord: {
    iconBg: 'rgba(97,95,255,0.1)',
    textColor: 'var(--color-brand-500)',
    Icon: ({ size, color }) => <MessageSquare size={size} color={color ?? 'var(--color-brand-500)'} />,
  },
  jira: {
    iconBg: 'rgba(0,82,204,0.1)',
    textColor: '#0052cc',
    Icon: ({ size, color }) => <Hash size={size} color={color ?? '#0052cc'} />,
  },
  gmail: {
    iconBg: 'rgba(234,67,53,0.1)',
    textColor: '#ea4335',
    Icon: ({ size, color }) => <MessageSquare size={size} color={color ?? '#ea4335'} />,
  },
}

const DEFAULT_STYLE = {
  iconBg: 'rgba(148,163,184,0.1)',
  textColor: 'var(--color-gray-400)',
  Icon: ({ size, color }: { size?: number; color?: string }) => (
    <MessageSquare size={size} color={color ?? 'var(--color-gray-400)'} />
  ),
}

const PRIORITY_BADGE_STYLE: Record<
  NotificationPriority,
  { label: string; color: string; bg: string; border: string }
> = {
  critical: {
    label: '긴급',
    color: 'var(--color-urgent-500)',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.2)',
  },
  high: {
    label: '중요',
    color: 'var(--color-important-500)',
    bg: 'rgba(247,144,9,0.1)',
    border: 'rgba(247,144,9,0.2)',
  },
  medium: {
    label: '보통',
    color: 'var(--color-normal-500)',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.2)',
  },
  low: {
    label: '낮음',
    color: 'var(--color-status-completed-500)',
    bg: 'rgba(18,183,106,0.1)',
    border: 'rgba(18,183,106,0.2)',
  },
}

const PRIORITY_ORDER: NotificationPriority[] = ['critical', 'high', 'medium', 'low']

interface ChannelCardProps {
  channel: ChannelSummary
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const { iconBg, textColor, Icon } = channel.provider ? PROVIDER_STYLE[channel.provider] : DEFAULT_STYLE

  const badges = PRIORITY_ORDER.filter((p) => channel.counts[p] > 0)

  return (
    <Link
      href={`/messages/${channel.id}`}
      className="flex w-full items-center gap-[var(--spacing-sm)] rounded-[14px] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] p-[17px] text-left transition-colors hover:bg-[var(--color-gray-20)]"
    >
      {/* 플랫폼 아이콘 */}
      <span
        className="flex shrink-0 items-center justify-center rounded-[10px]"
        style={{ width: 44, height: 44, background: iconBg }}
      >
        <Icon size={24} />
      </span>

      {/* 채널 정보 */}
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <div className="flex min-w-0 items-center gap-[2px]">
          <span
            className="truncate font-medium"
            style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)', color: textColor }}
          >
            {channel.workspaceName}
          </span>
          <ChevronRight size={20} color={textColor} className="shrink-0" />
          <span
            className="truncate font-medium"
            style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)', color: textColor }}
          >
            {channel.channelName}
          </span>
        </div>
        <span
          className="text-[var(--color-gray-400)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          {formatRelativeTime(channel.latestAt)}
        </span>
      </div>

      {/* 우선순위 배지들 */}
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
        {badges.map((priority) => {
          const { label, color, bg, border } = PRIORITY_BADGE_STYLE[priority]
          return (
            <span
              key={priority}
              className="inline-flex h-[28px] items-center rounded-[8px] border px-3 font-medium"
              style={{
                fontSize: 'var(--font-size-3xs)',
                lineHeight: 'var(--line-height-4xs)',
                color,
                background: bg,
                borderColor: border,
              }}
            >
              {label} ({channel.counts[priority]})
            </span>
          )
        })}
      </div>
    </Link>
  )
}
