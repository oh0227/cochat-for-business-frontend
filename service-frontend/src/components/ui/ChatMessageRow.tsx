import { Copy, ExternalLink, Sparkles } from 'lucide-react'
import type { ChatMessage, NotificationPriority } from '@/types'
import { formatRelativeTime } from '@/utils'

const BAR_COLOR: Record<NotificationPriority, string> = {
  critical: 'var(--color-urgent-500)',
  high:     'var(--color-important-500)',
  medium:   'var(--color-normal-500)',
  low:      'var(--color-status-completed-500)',
}

interface ChatMessageRowProps {
  message: ChatMessage
  isSelected: boolean
  aiDraft?: string
  provider?: string
  onCopy?: () => void
}

export default function ChatMessageRow({ message, isSelected, aiDraft, provider, onCopy }: ChatMessageRowProps) {
  const { author, content, createdAt, priorityBar } = message

  return (
    <div
      className="relative flex gap-4 rounded-[4px] p-2 transition-colors"
      style={
        isSelected
          ? {
              background: 'rgba(99,102,241,0.08)',
              border: '1.5px solid var(--color-brand-400)',
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
        style={{ background: 'var(--color-gray-80)', fontSize: 13 }}
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

        {/* AI 답장 초안 패널 */}
        {isSelected && aiDraft && (
          <div className="mt-3 flex flex-col gap-2">
            {/* 헤더 */}
            <div className="flex items-center gap-1">
              <Sparkles size={14} color="#972ddd" />
              <span
                className="font-semibold"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)', color: '#972ddd' }}
              >
                AI 답장 제안
              </span>
            </div>

            {/* 초안 텍스트 박스 */}
            <div
              className="flex h-[42px] items-center justify-between rounded-[10px] border px-[13px]"
              style={{ background: '#f6eafe', borderColor: '#b85af5' }}
            >
              <p
                className="flex-1 truncate text-[var(--color-gray-950)]"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                {aiDraft}
              </p>
              <button
                type="button"
                onClick={onCopy}
                className="ml-2 shrink-0 transition-opacity hover:opacity-60"
              >
                <Copy size={18} color="#972ddd" />
              </button>
            </div>

            {/* Slack/Discord에서 답장 링크 */}
            <div className="flex justify-end">
              <button
                type="button"
                className="flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-brand-600)' }}
              >
                <span style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)', fontWeight: 500 }}>
                  {provider === 'discord' ? 'Discord에서 답장' : 'Slack에서 답장'}
                </span>
                <ExternalLink size={14} className="text-[var(--color-brand-600)]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
