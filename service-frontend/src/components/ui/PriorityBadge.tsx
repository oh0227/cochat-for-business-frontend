import type { NotificationPriority } from '@/types'

const PRIORITY_CONFIG: Record<
  NotificationPriority,
  { label: string; className: string }
> = {
  critical: {
    label: '긴급',
    className: 'bg-[var(--color-urgent-50)] text-[var(--color-urgent-500)]',
  },
  high: {
    label: '중요',
    className: 'bg-[var(--color-important-50)] text-[var(--color-important-500)]',
  },
  medium: {
    label: '보통',
    className: 'bg-[var(--color-normal-50)] text-[var(--color-normal-500)]',
  },
  low: {
    label: '일반',
    className: 'bg-[var(--color-gray-50)] text-[var(--color-gray-500)]',
  },
}

interface PriorityBadgeProps {
  priority: NotificationPriority
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, className } = PRIORITY_CONFIG[priority]
  return (
    <span
      className={[
        'inline-flex items-center rounded-[var(--radius-8xl)] px-[var(--spacing-3xs)] py-[var(--spacing-4xs)] font-medium',
        className,
      ].join(' ')}
      style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
    >
      {label}
    </span>
  )
}
