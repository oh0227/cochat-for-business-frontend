import { CircleAlert, Clock4, CircleMinus, CircleDot } from 'lucide-react'
import type { Notification, NotificationPriority } from '@/types'
import { formatRelativeTime } from '@/utils'

const PRIORITY_CONFIG: Record<
  NotificationPriority,
  {
    label: string
    color: string
    bg: string
    border: string
    selectedBg: string
    selectedBorder: string
    Icon: React.ComponentType<{ size?: number; color?: string }>
  }
> = {
  critical: {
    label: '긴급',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.2)',
    selectedBg: '#fef2f2',
    selectedBorder: '#fca5a5',
    Icon: CircleAlert,
  },
  high: {
    label: '중요',
    color: '#f79009',
    bg: 'rgba(247,144,9,0.1)',
    border: 'rgba(247,144,9,0.2)',
    selectedBg: '#fffaeb',
    selectedBorder: '#fcd38c',
    Icon: Clock4,
  },
  medium: {
    label: '보통',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.2)',
    selectedBg: '#ebf3fe',
    selectedBorder: '#7cabf9',
    Icon: CircleMinus,
  },
  low: {
    label: '낮음',
    color: '#12b76a',
    bg: 'rgba(18,183,106,0.1)',
    border: 'rgba(18,183,106,0.2)',
    selectedBg: '#e9f8f1',
    selectedBorder: '#6ce9a6',
    Icon: CircleDot,
  },
}

interface AlertCardProps {
  notification: Notification
  isSelected: boolean
  onSelect: () => void
}

export default function AlertCard({ notification, isSelected, onSelect }: AlertCardProps) {
  const { summary, actor, priority, createdAt } = notification
  const { label, color, bg, border, selectedBg, selectedBorder, Icon } = PRIORITY_CONFIG[priority]

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full flex-col gap-[var(--spacing-3xs)] rounded-[10px] p-[13px] text-left transition-colors"
      style={{
        background: isSelected ? selectedBg : 'white',
        border: `${isSelected ? '1.5px' : '1px'} solid ${isSelected ? selectedBorder : '#dfe3e5'}`,
      }}
    >
      {/* 우선순위 배지 */}
      <span
        className="inline-flex h-6 items-center gap-1 rounded-[6px] border px-2"
        style={{ background: bg, borderColor: border }}
      >
        <Icon size={14} color={color} />
        <span className="font-medium" style={{ fontSize: 12, color }}>
          {label}
        </span>
      </span>

      {/* 요약 */}
      <p
        className="font-semibold text-[var(--color-gray-950)]"
        style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
      >
        {summary}
      </p>

      {/* 발신자 · 시간 */}
      <p className="text-[var(--color-gray-400)]" style={{ fontSize: 12, lineHeight: '16px' }}>
        {[actor, formatRelativeTime(createdAt)].filter(Boolean).join(' · ')}
      </p>
    </button>
  )
}
