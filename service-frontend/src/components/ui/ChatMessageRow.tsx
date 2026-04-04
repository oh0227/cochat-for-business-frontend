import type { ChatMessage, NotificationPriority } from '@/types'
import { formatRelativeTime } from '@/utils'

const BAR_COLOR: Record<NotificationPriority, string> = {
  critical: '#ef4444',
  high:     '#f79009',
  medium:   '#3b82f6',
  low:      '#12b76a',
}

interface ChatMessageRowProps {
  message: ChatMessage
  isSelected: boolean
}

export default function ChatMessageRow({ message, isSelected }: ChatMessageRowProps) {
  const { author, content, createdAt, priorityBar } = message

  return (
    <div
      className="relative flex gap-4 rounded-[4px] p-2 transition-colors"
      style={
        isSelected
          ? {
              background: 'rgba(99,102,241,0.08)',
              border: '1.5px solid #8285f4',
              borderRadius: 12,
            }
          : undefined
      }
    >
      {/* 우선순위 바 (선택 전 상태에서만 표시) */}
      {priorityBar && !isSelected && (
        <div
          className="absolute left-0 top-0 h-full w-[3px] rounded-[2px]"
          style={{ background: BAR_COLOR[priorityBar] }}
        />
      )}

      {/* 아바타 */}
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full font-medium text-[var(--color-gray-700)]"
        style={{ background: 'rgba(46,50,55,0.12)', fontSize: 13 }}
      >
        {author[0]}
      </div>

      {/* 본문 */}
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <div className="flex items-baseline gap-2">
          <span
            className="font-semibold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
          >
            {author}
          </span>
          <span
            className="text-[var(--color-gray-400)]"
            style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
          >
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <p
          className="whitespace-pre-wrap text-[var(--color-gray-950)]"
          style={{ fontSize: 15, lineHeight: '22px' }}
        >
          {content}
        </p>
      </div>
    </div>
  )
}
