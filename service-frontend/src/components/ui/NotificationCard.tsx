'use client'

import { MessageSquare } from 'lucide-react'
import type { Notification, NotificationProvider } from '@/types'
import PriorityBadge from './PriorityBadge'
import CalendarEventAction from './CalendarEventAction'
import { formatRelativeTime } from '@/utils'
import { PROVIDER_ICON_META } from '@/components/icons/ProviderIcon'

const PROVIDER_STYLE: Record<
  NotificationProvider,
  { iconBg: string; Icon: React.ComponentType<{ size?: number; color?: string }>; color: string }
> = {
  discord: { iconBg: 'bg-[rgba(88,101,242,0.1)]', Icon: PROVIDER_ICON_META.discord.Icon, color: PROVIDER_ICON_META.discord.color },
  slack: { iconBg: 'bg-[rgba(74,21,75,0.1)]', Icon: PROVIDER_ICON_META.slack.Icon, color: PROVIDER_ICON_META.slack.color },
  jira: { iconBg: 'bg-[rgba(0,82,204,0.1)]', Icon: PROVIDER_ICON_META.jira.Icon, color: PROVIDER_ICON_META.jira.color },
  gmail: { iconBg: 'bg-[rgba(234,67,53,0.1)]', Icon: PROVIDER_ICON_META.gmail.Icon, color: PROVIDER_ICON_META.gmail.color },
}

const DEFAULT_STYLE = {
  iconBg: 'bg-[var(--color-gray-50)]',
  Icon: MessageSquare,
  color: 'var(--color-gray-400)',
}

interface NotificationCardProps {
  notification: Notification
  onClick?: () => void
}

export default function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const { id, summary, actor, channel, provider, priority, createdAt, isScheduleRelated, calendarStatus, calendarEventUrl } = notification
  const { iconBg, Icon, color } = provider ? PROVIDER_STYLE[provider] : DEFAULT_STYLE

  const infoItems = [channel, actor, formatRelativeTime(createdAt)].filter(Boolean)

  // CalendarEventAction이 자체 버튼/링크를 렌더링하므로, 카드 자체는 button이 아닌
  // role="button" div로 두어 인터랙티브 요소 중첩(invalid HTML)을 피한다.
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className="flex w-full cursor-pointer items-center gap-[var(--spacing-sm)] rounded-[var(--radius-sm)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] p-[21px] text-left transition-colors hover:bg-[var(--color-gray-20)]"
    >
      {/* 플랫폼 아이콘 */}
      <span
        className={`flex shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}
        style={{ width: '36px', height: '36px' }}
      >
        <Icon size={20} color={color} />
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

      {/* 우선순위 배지 + 캘린더 등록 액션 */}
      <div className="flex shrink-0 flex-col items-end gap-[var(--spacing-3xs)]">
        <PriorityBadge priority={priority} />
        <CalendarEventAction
          notificationId={id}
          isScheduleRelated={isScheduleRelated}
          calendarStatus={calendarStatus}
          calendarEventUrl={calendarEventUrl}
          createdAt={createdAt}
          suggestedStartTime={notification.suggestedStartTime}
          suggestedDurationMinutes={notification.suggestedDurationMinutes}
          calendarEventStartTime={notification.calendarEventStartTime}
          calendarEventEndTime={notification.calendarEventEndTime}
        />
      </div>
    </div>
  )
}
