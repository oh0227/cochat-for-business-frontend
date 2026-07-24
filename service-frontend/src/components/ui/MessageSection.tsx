import Link from 'next/link'
import { Mail, ChevronRight } from 'lucide-react'
import type { Notification } from '@/types'
import NotificationCard from './NotificationCard'

interface MessageSectionProps {
  notifications: Notification[]
}

export default function MessageSection({ notifications }: MessageSectionProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-md)] rounded-[14px] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] p-[21px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[var(--spacing-2xs)]">
          <span
            className="flex items-center justify-center rounded-[10px] bg-[var(--color-gray-20)]"
            style={{ width: '36px', height: '36px' }}
          >
            <Mail size={20} className="text-[var(--color-gray-700)]" />
          </span>
          <span
            className="font-semibold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
          >
            메시지
          </span>
        </div>
        <Link
          href="/messages"
          className="flex items-center gap-[2px] font-medium text-[var(--color-brand-600)] transition-opacity hover:opacity-70"
          style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
        >
          더보기
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* 알림 카드 목록 */}
      <div className="flex flex-col gap-[var(--spacing-2xs)]">
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}
