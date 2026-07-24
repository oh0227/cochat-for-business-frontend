import { Sparkles } from 'lucide-react'
import { getNotifications, buildChannelSummaries } from '@/lib/api'
import MessagePriorityCard from '@/components/ui/MessagePriorityCard'
import ChannelCard from '@/components/ui/ChannelCard'
import type { NotificationPriority } from '@/types'

const PRIORITY_ORDER: NotificationPriority[] = ['critical', 'high', 'medium', 'low']

export default async function MessagesPage() {
  const notifications = await getNotifications()
  const channelSummaries = buildChannelSummaries(notifications)

  const counts = {
    critical: notifications.filter((n) => n.priority === 'critical').length,
    high: notifications.filter((n) => n.priority === 'high').length,
    medium: notifications.filter((n) => n.priority === 'medium').length,
    low: notifications.filter((n) => n.priority === 'low').length,
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-[var(--spacing-sm)] sm:flex-row sm:items-center sm:gap-[var(--spacing-lg)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-4xs)]">
          <h1
            className="font-bold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-2xl)', lineHeight: 'var(--line-height-3xl)' }}
          >
            메시지
          </h1>
          <p
            className="text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
          >
            모든 메시지를 확인하고 관리하세요.
          </p>
        </div>
        <button
          type="button"
          className="flex h-[48px] shrink-0 items-center justify-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] px-[var(--spacing-sm)] font-medium text-white transition-opacity hover:opacity-90"
          style={{
            fontSize: 'var(--font-size-xs)',
            background: 'linear-gradient(109.93deg, #6366f1 1.17%, #7cabf9 98.83%)',
          }}
        >
          <Sparkles size={24} />
          브리핑 받기
        </button>
      </div>

      {/* 우선순위 요약 카드 */}
      <div className="grid grid-cols-2 gap-[var(--spacing-sm)] sm:grid-cols-4 sm:gap-[17px]">
        {PRIORITY_ORDER.map((priority) => (
          <MessagePriorityCard key={priority} priority={priority} count={counts[priority]} />
        ))}
      </div>

      {/* 채널 목록 */}
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <h2
          className="font-semibold text-[var(--color-gray-900)]"
          style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
        >
          채널
        </h2>
        {channelSummaries.length === 0 ? (
          <p className="text-[var(--color-gray-400)]" style={{ fontSize: 'var(--font-size-3xs)' }}>
            연결된 채널이 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-[var(--spacing-2xs)]">
            {channelSummaries.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
