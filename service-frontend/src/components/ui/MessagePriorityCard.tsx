import { CircleAlert, Clock4, CircleMinus, CircleDot } from 'lucide-react'
import type { NotificationPriority } from '@/types'

const PRIORITY_CONFIG: Record<
  NotificationPriority,
  {
    label: string
    sublabel: string
    color: string
    bg: string
    border: string
    iconBg: string
    Icon: React.ComponentType<{ size?: number; color?: string }>
  }
> = {
  critical: {
    label: '긴급',
    sublabel: '즉시 조치 필요',
    color: 'var(--color-urgent-500)',
    bg: 'var(--color-urgent-50)',
    border: 'rgba(239,68,68,0.2)',
    iconBg: 'rgba(239,68,68,0.1)',
    Icon: CircleAlert,
  },
  high: {
    label: '중요',
    sublabel: '오늘 안에 확인',
    color: 'var(--color-important-500)',
    bg: 'var(--color-important-50)',
    border: 'rgba(247,144,9,0.2)',
    iconBg: 'rgba(247,144,9,0.1)',
    Icon: Clock4,
  },
  medium: {
    label: '보통',
    sublabel: '여유있게 확인',
    color: 'var(--color-normal-500)',
    bg: 'var(--color-normal-50)',
    border: 'rgba(59,130,246,0.2)',
    iconBg: 'rgba(59,130,246,0.1)',
    Icon: CircleMinus,
  },
  low: {
    label: '낮음',
    sublabel: '나중에 확인',
    color: 'var(--color-status-completed-500)',
    bg: 'var(--color-status-completed-50)',
    border: 'rgba(18,183,106,0.2)',
    iconBg: 'rgba(16,167,96,0.1)',
    Icon: CircleDot,
  },
}

interface MessagePriorityCardProps {
  priority: NotificationPriority
  count: number
}

export default function MessagePriorityCard({ priority, count }: MessagePriorityCardProps) {
  const { label, sublabel, color, bg, border, iconBg, Icon } = PRIORITY_CONFIG[priority]

  return (
    <div
      className="flex flex-1 items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] border p-[var(--spacing-sm)]"
      style={{ background: bg, borderColor: border }}
    >
      {/* 아이콘 */}
      <span
        className="flex shrink-0 items-center justify-center rounded-[10px]"
        style={{ width: 36, height: 36, background: iconBg }}
      >
        <Icon size={20} color={color} />
      </span>

      {/* 레이블 */}
      <div className="flex flex-1 flex-col gap-[2px]">
        <span
          className="font-medium"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)', color }}
        >
          {label}
        </span>
        <span
          className="text-[var(--color-gray-700)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          {sublabel}
        </span>
      </div>

      {/* 카운트 */}
      <span
        className="font-semibold"
        style={{ fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-lg)', color }}
      >
        {count}
      </span>
    </div>
  )
}
