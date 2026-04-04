'use client'

import { useState, useRef, useEffect } from 'react'
import { X, CalendarPlus, CalendarDays, Clock, Users, FileText, Info } from 'lucide-react'
import type { CalendarEvent } from '@/types'

const MOCK_CONTACTS = [
  { name: '김민준', email: 'minjun.kim@company.com', team: '개발팀' },
  { name: '이서연', email: 'seoyeon.lee@company.com', team: '디자인팀' },
  { name: '박지호', email: 'jiho.park@company.com', team: '개발팀' },
  { name: '최유진', email: 'yujin.choi@company.com', team: '마케팅팀' },
  { name: '정태양', email: 'taeyang.jung@company.com', team: '세일즈팀' },
  { name: '한소희', email: 'sohee.han@company.com', team: '재무팀' },
  { name: '오지민', email: 'jimin.oh@company.com', team: '디자인팀' },
]

interface EventFormModalProps {
  event?: CalendarEvent | null
  onClose: () => void
}

function formatDateLabel(isoString: string): string {
  const d = new Date(isoString)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

function formatTimeLabel(isoString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Seoul',
  }).format(new Date(isoString))
}

export default function EventFormModal({ event, onClose }: EventFormModalProps) {
  const isEdit = !!event

  const [title, setTitle] = useState(event?.title ?? '')
  const [date, setDate] = useState(() =>
    event?.startAt ? formatDateLabel(event.startAt) : ''
  )
  const [time, setTime] = useState(() =>
    event?.startAt && !event.isAllDay ? formatTimeLabel(event.startAt) : ''
  )
  const [attendees, setAttendees] = useState<string[]>(event?.attendees ?? [])
  const [memo, setMemo] = useState('')
  const [shareInput, setShareInput] = useState('')
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const filteredContacts = MOCK_CONTACTS.filter(
    (c) =>
      shareInput.length > 0 &&
      (c.name.includes(shareInput) || c.email.includes(shareInput)) &&
      !attendees.includes(c.name),
  )

  const isValid = title.trim().length > 0

  function addAttendee(name: string) {
    setAttendees((prev) => [...prev, name])
    setShareInput('')
    setDropdownVisible(false)
  }

  function removeAttendee(name: string) {
    setAttendees((prev) => prev.filter((a) => a !== name))
  }

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const inputClass =
    'h-[42px] w-full rounded-[10px] border border-[#dfe3e5] bg-white px-4 text-[#212225] placeholder:text-[#8a939b] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]'

  return (
    <>
      {/* 오버레이 */}
      <div className="fixed inset-0 z-[60] bg-black/50" onClick={onClose} />

      {/* 모달 */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className="flex w-[672px] flex-col overflow-hidden rounded-[14px] border border-[#e2e8f0] bg-white"
          style={{ boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-6">
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center rounded-[4px]"
                style={{ width: 32, height: 32, background: 'rgba(59,130,246,0.1)' }}
              >
                <CalendarPlus size={16} className="text-[#3b82f6]" />
              </span>
              <span
                className="font-medium text-[var(--color-gray-950)]"
                style={{ fontSize: 20, lineHeight: '30px' }}
              >
                {isEdit ? '일정 수정' : '일정 생성'}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-[32px] items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
            >
              <X size={20} />
            </button>
          </div>

          {/* 본문 */}
          <div className="flex flex-col gap-4 overflow-y-auto px-6 py-6">
            {/* 일정 제목 */}
            <div className="flex flex-col gap-[6px]">
              <label className="flex items-center gap-[6px]">
                <CalendarDays size={14} className="text-[#4d555c]" />
                <span className="font-semibold text-[#4d555c]" style={{ fontSize: 14, lineHeight: '20px' }}>
                  일정 제목
                </span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="미팅 일정"
                className={inputClass}
                style={{ fontSize: 14 }}
              />
            </div>

            {/* 날짜 + 시간 */}
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-[6px]">
                <label className="flex items-center gap-[6px]">
                  <CalendarDays size={14} className="text-[#4d555c]" />
                  <span className="font-semibold text-[#4d555c]" style={{ fontSize: 14, lineHeight: '20px' }}>
                    날짜
                  </span>
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="2026년 3월 26일"
                  className={inputClass}
                  style={{ fontSize: 14 }}
                />
              </div>
              <div className="flex flex-1 flex-col gap-[6px]">
                <label className="flex items-center gap-[6px]">
                  <Clock size={14} className="text-[#4d555c]" />
                  <span className="font-semibold text-[#4d555c]" style={{ fontSize: 14, lineHeight: '20px' }}>
                    시간
                  </span>
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="오후 2:00 - 3:00"
                  className={inputClass}
                  style={{ fontSize: 14 }}
                />
              </div>
            </div>

            {/* 공유 */}
            <div className="flex flex-col gap-[6px]">
              <label className="flex items-center gap-[6px]">
                <Users size={14} className="text-[#4d555c]" />
                <span className="font-semibold text-[#4d555c]" style={{ fontSize: 14, lineHeight: '20px' }}>
                  공유
                </span>
              </label>
              <div className="relative">
                {attendees.length > 0 && (
                  <div
                    className="mb-2 flex flex-wrap gap-2 rounded-[10px] p-2"
                    style={{ background: '#f8f9ff', border: '1px solid #e1e3ff' }}
                  >
                    {attendees.map((name) => (
                      <div
                        key={name}
                        className="flex h-[34px] items-center gap-1 rounded-[10px] px-3"
                        style={{ background: '#eff0fe', border: '1px solid #8285f4' }}
                      >
                        <span style={{ fontSize: 14, color: '#212225' }}>{name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttendee(name)}
                          className="ml-1 text-[#8285f4] transition-opacity hover:opacity-70"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={shareInput}
                  onChange={(e) => {
                    setShareInput(e.target.value)
                    setDropdownVisible(true)
                  }}
                  onFocus={() => setDropdownVisible(true)}
                  onBlur={() => setTimeout(() => setDropdownVisible(false), 150)}
                  placeholder="이름"
                  className={inputClass}
                  style={{ fontSize: 14 }}
                />
                {dropdownVisible && filteredContacts.length > 0 && (
                  <div
                    className="absolute left-0 right-0 top-[46px] z-10 overflow-hidden rounded-[10px] border border-[#dfe3e5] bg-white"
                    style={{
                      boxShadow:
                        '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.name}
                        type="button"
                        onMouseDown={() => addAttendee(contact.name)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-gray-20)]"
                      >
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#3b82f6]"
                          style={{
                            background: 'rgba(59,130,246,0.1)',
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {contact.name[0]}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#212225]" style={{ fontSize: 14 }}>
                            {contact.name}
                          </span>
                          <span className="text-[#64748b]" style={{ fontSize: 12 }}>
                            {contact.email} · {contact.team}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 메모 */}
            <div className="flex flex-col gap-[6px]">
              <label className="flex items-center gap-[6px]">
                <FileText size={14} className="text-[#4d555c]" />
                <span className="font-semibold text-[#4d555c]" style={{ fontSize: 14, lineHeight: '20px' }}>
                  메모
                </span>
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="추가 메모나 안건을 입력하세요"
                rows={4}
                className="resize-none rounded-[10px] border border-[#dfe3e5] bg-white px-4 py-[10px] text-[#212225] placeholder:text-[#8a939b] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
                style={{ fontSize: 14, lineHeight: '20px' }}
              />
            </div>

            {/* 안내 바 */}
            <div
              className="flex items-center gap-2 rounded-[10px] px-[13px] py-[13px]"
              style={{ background: '#f8f9ff', border: '1px solid #e1e3ff' }}
            >
              <Info size={16} className="shrink-0 text-[#5a5ddb]" />
              <span style={{ fontSize: 12, color: '#64748b', lineHeight: '16px' }}>
                공유된 사람에게 초대 알림이 발송됩니다.
              </span>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex justify-end border-t border-[#e2e8f0] px-6 py-6">
            <button
              type="button"
              onClick={isValid ? onClose : undefined}
              disabled={!isValid}
              className="flex h-[44px] items-center gap-2 rounded-[12px] px-5 font-medium transition-colors"
              style={{
                fontSize: 14,
                background: isValid ? '#6366f1' : '#f0f2f3',
                color: isValid ? 'white' : '#8a939b',
                cursor: isValid ? 'pointer' : 'not-allowed',
              }}
            >
              <CalendarPlus size={18} />
              {isEdit ? '일정 수정' : '캘린더 추가'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
