'use client'

import { X, Calendar, SquarePen, CircleCheckBig, ExternalLink, Plus, User } from 'lucide-react'
import type { CalendarEvent } from '@/types'

interface EventDetailPanelProps {
  event: CalendarEvent
  onClose: () => void
}

function formatDateTime(isoString: string): string {
  const d = new Date(isoString)
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const time = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(d)
  return `${date} · ${time}`
}

export default function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  return (
    <>
      {/* 딤 배경 */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* 슬라이드 패널 */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-[664px] flex-col border-l border-[var(--color-gray-80)] bg-white shadow-[-4px_0px_24px_0px_rgba(99,102,241,0.12)]">
        {/* 헤더 */}
        <div className="flex flex-col gap-[var(--spacing-xs)] border-b border-[var(--color-gray-80)] px-[var(--spacing-xl)] pb-[33px] pt-[var(--spacing-xl)]">
          {/* X 닫기 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex size-[32px] items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
            >
              <X size={20} />
            </button>
          </div>

          {/* 제목 + 날짜 */}
          <div className="flex flex-col gap-[var(--spacing-3xs)]">
            <h2
              className="font-semibold text-[var(--color-gray-950)]"
              style={{ fontSize: 'var(--font-size-md)', lineHeight: 'var(--line-height-sm)' }}
            >
              {event.title}
            </h2>
            <div className="flex items-center gap-[var(--spacing-3xs)]">
              <Calendar size={18} className="text-[var(--color-gray-400)]" />
              <span
                className="text-[var(--color-gray-400)]"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                {event.isAllDay ? formatDateTime(event.startAt).split(' · ')[0] + ' · 종일' : formatDateTime(event.startAt)}
              </span>
            </div>
          </div>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="flex flex-1 flex-col gap-[var(--spacing-sm)] overflow-y-auto px-[var(--spacing-xl)] py-[var(--spacing-sm)]">
          {/* 일정 요약 */}
          <div className="flex flex-col gap-[var(--spacing-4xs)] rounded-[10px] border border-[#b85af5] bg-[rgba(166,49,243,0.08)] p-[var(--spacing-xs)]">
            <p
              className="font-semibold text-[#972ddd]"
              style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
            >
              일정 요약
            </p>
            <p
              className="text-[#1e2939]"
              style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
            >
              {event.attendees.length > 0
                ? `${event.attendees.join(', ')}와(과)의 미팅`
                : event.title}
            </p>
          </div>

          {/* 메모 */}
          <div className="flex flex-col gap-[var(--spacing-2xs)]">
            <div className="flex items-center justify-between">
              <p
                className="font-semibold text-[var(--color-gray-700)]"
                style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
              >
                메모
              </p>
              <button
                type="button"
                className="flex items-center gap-[2px] text-[var(--color-brand-600)] transition-opacity hover:opacity-70"
                style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
              >
                원문 보기
                <ExternalLink size={18} />
              </button>
            </div>
            <p
              className="text-[var(--color-gray-950)]"
              style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
            >
              {event.attendees.length > 0 ? `${event.attendees[0]} 외 참석자와의 미팅` : '메모 없음'}
            </p>
          </div>

          {/* 공유된 사람 */}
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <div className="flex items-center justify-between">
              <p
                className="font-semibold text-[var(--color-gray-700)]"
                style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
              >
                공유된 사람
              </p>
              <button
                type="button"
                className="flex items-center gap-[2px] text-[var(--color-brand-600)] transition-opacity hover:opacity-70"
                style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
              >
                추가하기
                <Plus size={18} />
              </button>
            </div>
            {event.attendees.length > 0 ? (
              <div className="flex flex-wrap gap-[var(--spacing-2xs)] rounded-[10px] bg-[var(--color-gray-20)] p-[var(--spacing-xs)]">
                {event.attendees.map((attendee) => (
                  <div
                    key={attendee}
                    className="flex items-center gap-[var(--spacing-3xs)] rounded-[4px] border border-[#e2e8f0] bg-white px-[var(--spacing-xs)] py-[var(--spacing-4xs)]"
                  >
                    <User size={12} className="text-[var(--color-gray-400)]" />
                    <span
                      className="font-medium text-[var(--color-gray-950)]"
                      style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                    >
                      {attendee}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className="text-[var(--color-gray-400)]"
                style={{ fontSize: 'var(--font-size-3xs)' }}
              >
                공유된 사람이 없습니다.
              </p>
            )}
          </div>

          {/* 후속 액션 */}
          <div className="flex flex-col gap-[var(--spacing-2xs)]">
            <p
              className="font-semibold text-[var(--color-gray-700)]"
              style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
            >
              후속 액션
            </p>
            <div className="flex flex-col gap-[var(--spacing-2xs)]">
              <button
                type="button"
                className="flex h-[44px] w-full items-center justify-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] bg-[rgba(46,50,55,0.08)] font-medium text-[var(--color-gray-950)] transition-colors hover:bg-[rgba(46,50,55,0.12)]"
                style={{ fontSize: 'var(--font-size-xs)' }}
              >
                <SquarePen size={22} />
                일정 수정
              </button>
              <button
                type="button"
                className="flex h-[44px] w-full items-center justify-center gap-[var(--spacing-2xs)] rounded-[var(--radius-sm)] bg-[var(--color-brand-500)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
                style={{ fontSize: 'var(--font-size-xs)' }}
              >
                <CircleCheckBig size={22} />
                완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
