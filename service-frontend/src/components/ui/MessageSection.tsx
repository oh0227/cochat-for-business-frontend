import Link from 'next/link'
import { Mail } from 'lucide-react'
import type { Notification } from '@/types'
import NotificationCard from './NotificationCard'

interface MessageSectionProps {
  notifications: Notification[]
}

export default function MessageSection({ notifications }: MessageSectionProps) {
  return (
    <div className="flex flex-col rounded-[var(--radius-md)] bg-white p-[var(--spacing-sm)] shadow-sm">
      {/* 헤더 */}
      <div className="mb-[var(--spacing-xs)] flex items-center justify-between">
        <div className="flex items-center gap-[var(--spacing-3xs)]">
          <Mail size={16} className="text-[var(--color-gray-700)]" />
          <span
            className="font-semibold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            메시지
          </span>
        </div>
        <Link
          href="/messages"
          className="font-medium text-[var(--color-brand-500)] transition-opacity hover:opacity-70"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          더보기 &gt;
        </Link>
      </div>

      {/* 알림 카드 목록 */}
      <div className="flex flex-col gap-[var(--spacing-4xs)]">
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}
