'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, MessageSquare } from 'lucide-react'
import type { Briefing, Notification, NotificationPriority, NotificationProvider } from '@/types'
import { formatRelativeTime } from '@/utils'
import PriorityBadge from './PriorityBadge'

const PROVIDER_COLOR: Record<NotificationProvider, string> = {
  slack: 'bg-[#4a154b]',
  discord: 'bg-[#5865f2]',
  jira: 'bg-[#0052cc]',
  gmail: 'bg-[#ea4335]',
}

const PROVIDER_NAME: Record<NotificationProvider, string> = {
  slack: 'Slack',
  discord: 'Discord',
  jira: 'Jira',
  gmail: 'Gmail',
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
        <p className="whitespace-pre-line text-[var(--color-gray-900)]" style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}>
          {briefing.content}
        </p>
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
              <div className="flex items-start gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-sm)]">
                {/* 프로바이더 아이콘 */}
                <span className={['flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white', notification.provider ? PROVIDER_COLOR[notification.provider] : 'bg-[var(--color-gray-400)]'].join(' ')}>
                  <MessageSquare size={16} />
                </span>

                {/* 본문 */}
                <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-4xs)]">
                  <p className="text-[var(--color-gray-400)]" style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}>
                    {notification.provider ? PROVIDER_NAME[notification.provider] : '메시지'}{notification.channel ? ` › ${notification.channel}` : ''}
                  </p>
                  <p className="font-medium text-[var(--color-gray-950)]" style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}>
                    {notification.summary}
                  </p>
                  <p className="text-[var(--color-gray-400)]" style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}>
                    {notification.actor ?? '알 수 없음'} · {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>

                {/* 우선순위 배지 */}
                <PriorityBadge priority={notification.priority} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
