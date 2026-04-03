/** 알림 우선순위 관련 유틸 함수 */

import type { NotificationPriority } from '@/types'

/** priority → 한국어 레이블 */
export function getPriorityLabel(priority: NotificationPriority): string {
  const labels: Record<NotificationPriority, string> = {
    critical: '긴급',
    high: '중요',
    medium: '보통',
    low: '일반',
  }
  return labels[priority]
}

/** priority → Tailwind CSS 변수 기반 색상 클래스 */
export function getPriorityColorClass(priority: NotificationPriority): {
  bg: string
  text: string
  border: string
} {
  const map: Record<NotificationPriority, { bg: string; text: string; border: string }> = {
    critical: {
      bg: 'bg-[var(--color-urgent-50)]',
      text: 'text-[var(--color-urgent-500)]',
      border: 'border-[var(--color-urgent-500)]',
    },
    high: {
      bg: 'bg-[var(--color-important-50)]',
      text: 'text-[var(--color-important-500)]',
      border: 'border-[var(--color-important-500)]',
    },
    medium: {
      bg: 'bg-[var(--color-normal-50)]',
      text: 'text-[var(--color-normal-500)]',
      border: 'border-[var(--color-normal-500)]',
    },
    low: {
      bg: 'bg-[var(--color-gray-50)]',
      text: 'text-[var(--color-gray-500)]',
      border: 'border-[var(--color-gray-80)]',
    },
  }
  return map[priority]
}
