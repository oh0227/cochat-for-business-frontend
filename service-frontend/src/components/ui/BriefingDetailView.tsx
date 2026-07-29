'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, MessageSquare } from 'lucide-react'
import type { Briefing, Notification, NotificationPriority, NotificationProvider } from '@/types'
import { formatRelativeTime } from '@/utils'
import MarkdownContent from './MarkdownContent'

const PROVIDER_HEX: Record<NotificationProvider, string> = {
  slack: '#4a154b',
  discord: '#5865f2',
  jira: '#0052cc',
  gmail: '#ea4335',
}

const PROVIDER_NAME: Record<NotificationProvider, string> = {
  slack: 'Slack',
  discord: 'Discord',
  jira: 'Jira',
  gmail: 'Gmail',
}

const PRIORITY_BADGE_STYLE: Record<NotificationPriority, { label: string; text: string; bg: string; border: string }> = {
  critical: { label: '긴급', text: 'var(--color-urgent-500)', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  high: { label: '중요', text: 'var(--color-important-500)', bg: 'rgba(247,144,9,0.1)', border: 'rgba(247,144,9,0.2)' },
  medium: { label: '보통', text: 'var(--color-normal-500)', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  low: { label: '일반', text: 'var(--color-gray-500)', bg: 'var(--color-gray-50)', border: 'var(--color-gray-80)' },
}

/** 상세 화면 메시지 카드 전용 우선순위 배지 (텍스트 전용, 카드형) */
function DetailPriorityBadge({ priority }: { priority: NotificationPriority }) {
  const { label, text, bg, border } = PRIORITY_BADGE_STYLE[priority]
  return (
    <span
      className="flex h-7 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border px-[var(--spacing-xs)] font-medium"
      style={{ backgroundColor: bg, borderColor: border, color: text, fontSize: 'var(--font-size-3xs)' }}
    >
      {label}
    </span>
  )
}

const PRIORITY_ORDER: Record<NotificationPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

type SortType = 'time' | 'priority'

interface BriefingDetailViewProps {
  briefing: Briefing
  notifications: Notification[]
}

export default function BriefingDetailView({ briefing, notifications }: BriefingDetailViewProps) {
  const router = useRouter()
  const [sort, setSort] = useState<SortType>('time')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sorted = [...notifications].sort((a, b) => {
    if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      {/* 뒤로 가기 */}
      <Link
        href="/briefing"
        className="flex w-fit items-center gap-[var(--spacing-3xs)] text-[var(--color-gray-500)] transition-colors hover:text-[var(--color-gray-700)]"
        style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
      >
        <ArrowLeft size={16} />
        브리핑
      </Link>

      {/* 제목 */}
      <h1
        className="font-semibold text-[var(--color-gray-950)]"
        style={{ fontSize: 'var(--font-size-2xl)', lineHeight: 'var(--line-height-3xl)' }}
      >
        {briefing.title}
      </h1>

      {/* AI 요약 */}
      <div className="rounded-[var(--radius-sm)] bg-[var(--color-brand-20)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
        <p className="mb-[var(--spacing-3xs)] font-semibold text-[var(--color-brand-500)]" style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}>
          AI 요약
        </p>
        <MarkdownContent content={briefing.content} />
      </div>

      {/* 권장 조치 */}
      {briefing.actionItems.length > 0 && (
        <div className="rounded-[var(--radius-sm)] bg-[var(--color-gray-20)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
          <p className="mb-[var(--spacing-xs)] font-semibold text-[var(--color-gray-700)]" style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}>
            권장 조치
          </p>
          <ul className="flex flex-col gap-[var(--spacing-2xs)]">
            {briefing.actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-[var(--spacing-2xs)] text-[var(--color-gray-900)]" style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}>
                <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gray-700)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 받은 메시지 */}
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[var(--color-gray-950)]" style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}>
            받은 메시지 ({notifications.length})
          </p>
          {/* 정렬 드롭다운 */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-[var(--spacing-4xs)] rounded-[var(--radius-xs)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)] text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
              style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}
            >
              {sort === 'time' ? '시간 순' : '우선순위 순'}
              <ChevronDown size={14} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 min-w-[120px] overflow-hidden rounded-[var(--radius-xs)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] shadow-sm">
                {(['time', 'priority'] as SortType[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { setSort(option); setDropdownOpen(false) }}
                    className={[
                      'w-full px-[var(--spacing-sm)] py-[var(--spacing-2xs)] text-left transition-colors hover:bg-[var(--color-gray-50)]',
                      sort === option ? 'font-semibold text-[var(--color-brand-500)]' : 'text-[var(--color-gray-700)]',
                    ].join(' ')}
                    style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}
                  >
                    {option === 'time' ? '시간 순' : '우선순위 순'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)]">
          {sorted.map((notification, i) => (
            <div key={notification.id}>
              {i > 0 && <div className="mx-[var(--spacing-sm)] border-t border-[var(--color-gray-80)]" />}
              <button
                type="button"
                onClick={() => {
                  const channelId = `${notification.integrationId}:${notification.channel ?? '__dm__'}`
                  router.push(`/messages/${encodeURIComponent(channelId)}?notif=${notification.id}`)
                }}
                className="flex w-full items-start gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-sm)] text-left transition-colors hover:bg-[var(--color-gray-20)]"
              >
                {/* 프로바이더 아이콘 */}
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                  style={{
                    backgroundColor: notification.provider ? `${PROVIDER_HEX[notification.provider]}1a` : 'var(--color-gray-50)',
                    color: notification.provider ? PROVIDER_HEX[notification.provider] : 'var(--color-gray-400)',
                  }}
                >
                  <MessageSquare size={18} />
                </span>

                {/* 본문 */}
                <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-xs)]">
                  <div className="flex flex-col gap-[var(--spacing-4xs)]">
                    <p
                      className="truncate"
                      style={{
                        fontSize: 'var(--font-size-5xs)',
                        lineHeight: 'var(--line-height-5xs)',
                        color: notification.provider ? PROVIDER_HEX[notification.provider] : 'var(--color-gray-400)',
                      }}
                    >
                      {notification.provider ? PROVIDER_NAME[notification.provider] : '메시지'}{notification.channel ? ` › ${notification.channel}` : ''}
                    </p>
                    <p className="font-semibold text-[var(--color-gray-950)]" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}>
                      {notification.title}
                    </p>
                    <p className="flex items-center gap-[var(--spacing-4xs)]" style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}>
                      <span className="text-[var(--color-gray-700)]">{notification.actor ?? '알 수 없음'}</span>
                      <span className="text-[var(--color-gray-400)]">·</span>
                      <span className="text-[var(--color-gray-400)]">{formatRelativeTime(notification.createdAt)}</span>
                    </p>
                  </div>
                  <p className="text-[var(--color-gray-700)]" style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}>
                    {notification.summary}
                  </p>
                </div>

                {/* 우선순위 배지 */}
                <div className="flex shrink-0 items-center gap-[var(--spacing-xs)]">
                  <DetailPriorityBadge priority={notification.priority} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
