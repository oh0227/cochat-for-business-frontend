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
    color: 'var(--color-urgent-500)',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.2)',
    selectedBg: 'var(--color-urgent-50)',
    selectedBorder: 'var(--color-urgent-300)',
    Icon: CircleAlert,
  },
  high: {
    label: '중요',
    color: 'var(--color-important-500)',
    bg: 'rgba(247,144,9,0.1)',
    border: 'rgba(247,144,9,0.2)',
    selectedBg: 'var(--color-important-50)',
    selectedBorder: 'var(--color-important-300)',
    Icon: Clock4,
  },
  medium: {
    label: '보통',
    color: 'var(--color-normal-500)',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.2)',
    selectedBg: 'var(--color-normal-50)',
    selectedBorder: 'var(--color-normal-300)',
    Icon: CircleMinus,
  },
  low: {
    label: '낮음',
    color: 'var(--color-status-completed-500)',
    bg: 'rgba(18,183,106,0.1)',
    border: 'rgba(18,183,106,0.2)',
    selectedBg: 'var(--color-status-completed-50)',
    selectedBorder: 'var(--color-status-completed-300)',
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
        background: isSelected ? selectedBg : 'var(--color-gray-default)',
        border: `${isSelected ? '1.5px' : '1px'} solid ${isSelected ? selectedBorder : 'var(--color-gray-80)'}`,
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
