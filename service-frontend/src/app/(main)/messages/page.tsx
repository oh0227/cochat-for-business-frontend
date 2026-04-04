import { Sparkles } from 'lucide-react'
import { mockChannelSummaries, mockMessageSummary } from '@/mocks'
import MessagePriorityCard from '@/components/ui/MessagePriorityCard'
import ChannelCard from '@/components/ui/ChannelCard'
import type { NotificationPriority } from '@/types'

const PRIORITY_ORDER: NotificationPriority[] = ['critical', 'high', 'medium', 'low']

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-[var(--spacing-lg)]">
        <div className="flex flex-1 flex-col gap-[var(--spacing-4xs)]">
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

        {/* 브리핑 받기 버튼 */}
        <button
          type="button"
          className="flex h-[48px] items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] px-[var(--spacing-sm)] font-medium text-white transition-opacity hover:opacity-90"
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
      <div className="flex gap-[17px]">
        {PRIORITY_ORDER.map((priority) => (
          <MessagePriorityCard
            key={priority}
            priority={priority}
            count={mockMessageSummary[priority]}
          />
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
        <div className="flex flex-col gap-[var(--spacing-2xs)]">
          {mockChannelSummaries.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
    </div>
  )
}
