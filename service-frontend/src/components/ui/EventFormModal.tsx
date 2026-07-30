'use client'

import { useState, useRef, useEffect } from 'react'
import { X, CalendarPlus, CalendarDays, Users, FileText, Info } from 'lucide-react'
import type { CalendarEvent } from '@/types'
import DatePickerInput from './DatePickerInput'
import TimePickerInput from './TimePickerInput'

const MOCK_CONTACTS = [
  { name: '김민준', email: 'minjun.kim@company.com', team: '개발팀' },
  { name: '이서연', email: 'seoyeon.lee@company.com', team: '디자인팀' },
  { name: '박지호', email: 'jiho.park@company.com', team: '개발팀' },
  { name: '최유진', email: 'yujin.choi@company.com', team: '마케팅팀' },
  { name: '정태양', email: 'taeyang.jung@company.com', team: '세일즈팀' },
  { name: '한소희', email: 'sohee.han@company.com', team: '재무팀' },
  { name: '오지민', email: 'jimin.oh@company.com', team: '디자인팀' },
]

export interface EventFormData {
  title: string
  date: Date | null
  time: string // "HH:MM" 24h 형식, 빈 문자열이면 종일
  attendees: string[]
  memo: string
}

interface EventFormModalProps {
  event?: CalendarEvent | null
  submitting?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (data: EventFormData) => void
}

/** ISO 문자열에서 KST 기준 "HH:MM" 추출 */
function isoToHHMM(isoString: string): string {
  const d = new Date(isoString)
  const kst = new Date(d.getTime() + 9 * 3600_000)
  const h = String(kst.getUTCHours()).padStart(2, '0')
  const m = String(kst.getUTCMinutes()).padStart(2, '0')
  // 30분 단위로 내림
  const mRounded = parseInt(m) >= 30 ? '30' : '00'
  return `${h}:${mRounded}`
}

export default function EventFormModal({ event, submitting = false, error = null, onClose, onSubmit }: EventFormModalProps) {
  const isEdit = !!event

  const [title, setTitle] = useState(event?.title ?? '')
  const [date, setDate] = useState<Date | null>(() =>
    event?.startAt ? new Date(event.startAt) : null,
  )
  const [time, setTime] = useState(() =>
    event?.startAt && !event.isAllDay ? isoToHHMM(event.startAt) : '',
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
      !attendees.includes(c.email),
  )

  const isValid = title.trim().length > 0 && date !== null

  // 참석자는 이메일로 저장한다 (Google Calendar 초대에 필요한 값).
  function addAttendee(email: string) {
    setAttendees((prev) => [...prev, email])
    setShareInput('')
    setDropdownVisible(false)
  }

  function removeAttendee(email: string) {
    setAttendees((prev) => prev.filter((a) => a !== email))
  }

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const inputClass =
    'h-[42px] w-full rounded-[10px] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] px-4 text-[var(--color-gray-950)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]'

  return (
    <>
      {/* 오버레이 */}
      <div className="fixed inset-0 z-[60] bg-black/50" onClick={onClose} />

      {/* 모달 */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className="flex max-h-[90vh] w-full max-w-[672px] flex-col overflow-y-auto rounded-[14px] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)]"
          style={{ boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-[var(--color-gray-80)] px-6 py-6">
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center rounded-[4px]"
                style={{ width: 32, height: 32, background: 'rgba(59,130,246,0.1)' }}
              >
                <CalendarPlus size={16} className="text-[var(--color-normal-500)]" />
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
                <CalendarDays size={14} className="text-[var(--color-gray-700)]" />
                <span className="font-semibold text-[var(--color-gray-700)]" style={{ fontSize: 14, lineHeight: '20px' }}>
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
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 flex-col gap-[6px]">
                <label className="flex items-center gap-[6px]">
                  <CalendarDays size={14} className="text-[var(--color-gray-700)]" />
                  <span className="font-semibold text-[var(--color-gray-700)]" style={{ fontSize: 14, lineHeight: '20px' }}>
                    날짜
                  </span>
                </label>
                <DatePickerInput value={date} onChange={setDate} />
              </div>
              <div className="flex flex-1 flex-col gap-[6px]">
                <label className="flex items-center gap-[6px]">
                  <CalendarDays size={14} className="text-[var(--color-gray-700)]" />
                  <span className="font-semibold text-[var(--color-gray-700)]" style={{ fontSize: 14, lineHeight: '20px' }}>
                    시간
                  </span>
                </label>
                <TimePickerInput value={time} onChange={setTime} />
              </div>
            </div>

            {/* 공유 */}
            <div className="flex flex-col gap-[6px]">
              <label className="flex items-center gap-[6px]">
                <Users size={14} className="text-[var(--color-gray-700)]" />
                <span className="font-semibold text-[var(--color-gray-700)]" style={{ fontSize: 14, lineHeight: '20px' }}>
                  공유
                </span>
              </label>
              <div className="relative">
                {attendees.length > 0 && (
                  <div
                    className="mb-2 flex flex-wrap gap-2 rounded-[10px] p-2"
                    style={{ background: 'var(--color-brand-20)', border: '1px solid var(--color-brand-80)' }}
                  >
                    {attendees.map((email) => (
                      <div
                        key={email}
                        className="flex h-[34px] items-center gap-1 rounded-[10px] px-3"
                        style={{ background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-400)' }}
                      >
                        <span style={{ fontSize: 14, color: 'var(--color-gray-950)' }}>{email}</span>
                        <button
                          type="button"
                          onClick={() => removeAttendee(email)}
                          className="ml-1 text-[var(--color-brand-400)] transition-opacity hover:opacity-70"
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
                    className="absolute left-0 right-0 top-[46px] z-10 overflow-hidden rounded-[10px] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)]"
                    style={{
                      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.name}
                        type="button"
                        onMouseDown={() => addAttendee(contact.email)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-gray-20)]"
                      >
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--color-normal-500)]"
                          style={{ background: 'rgba(59,130,246,0.1)', fontSize: 14, fontWeight: 500 }}
                        >
                          {contact.name[0]}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[var(--color-gray-950)]" style={{ fontSize: 14 }}>
                            {contact.name}
                          </span>
                          <span className="text-[var(--color-gray-500)]" style={{ fontSize: 12 }}>
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
                <FileText size={14} className="text-[var(--color-gray-700)]" />
                <span className="font-semibold text-[var(--color-gray-700)]" style={{ fontSize: 14, lineHeight: '20px' }}>
                  메모
                </span>
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="추가 메모나 안건을 입력하세요"
                rows={4}
                className="resize-none rounded-[10px] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] px-4 py-[10px] text-[var(--color-gray-950)] placeholder:text-[var(--color-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
                style={{ fontSize: 14, lineHeight: '20px' }}
              />
            </div>

            {/* 안내 바 */}
            <div
              className="flex items-center gap-2 rounded-[10px] px-[13px] py-[13px]"
              style={{ background: 'var(--color-brand-20)', border: '1px solid var(--color-brand-80)' }}
            >
              <Info size={16} className="shrink-0 text-[var(--color-brand-600)]" />
              <span style={{ fontSize: 12, color: 'var(--color-gray-500)', lineHeight: '16px' }}>
                공유된 사람에게 초대 알림이 발송됩니다.
              </span>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex flex-col gap-3 border-t border-[var(--color-gray-80)] px-6 py-6">
            {error && (
              <p
                className="rounded-[10px] bg-[var(--color-urgent-50)] px-4 py-[10px] text-[var(--color-urgent-500)]"
                style={{ fontSize: 13 }}
              >
                {error}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (isValid && !submitting) onSubmit({ title, date, time, attendees, memo })
                }}
                disabled={!isValid || submitting}
                className="flex h-[44px] items-center gap-2 rounded-[12px] px-5 font-medium transition-colors"
                style={{
                  fontSize: 14,
                  background: isValid && !submitting ? 'var(--color-brand-500)' : 'var(--color-gray-50)',
                  color: isValid && !submitting ? 'white' : 'var(--color-gray-400)',
                  cursor: isValid && !submitting ? 'pointer' : 'not-allowed',
                }}
              >
                <CalendarPlus size={18} />
                {submitting ? '처리 중...' : isEdit ? '일정 수정' : '캘린더 추가'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
