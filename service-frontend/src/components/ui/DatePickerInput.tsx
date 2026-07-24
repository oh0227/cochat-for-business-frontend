'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerInputProps {
  value: Date | null
  onChange: (date: Date) => void
  placeholder?: string
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const

function buildCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const start = new Date(year, month, 1 - startOffset)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function toKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export default function DatePickerInput({
  value,
  onChange,
  placeholder = '날짜 선택',
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(value?.getFullYear() ?? new Date().getFullYear())
  const [month, setMonth] = useState(value?.getMonth() ?? new Date().getMonth())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const days = buildCalendarDays(year, month)
  const todayKey = toKey(new Date())
  const selectedKey = value ? toKey(value) : ''

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  const displayValue = value
    ? `${value.getFullYear()}년 ${value.getMonth() + 1}월 ${value.getDate()}일`
    : ''

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[42px] w-full items-center gap-2 rounded-[10px] border border-[#dfe3e5] bg-white px-4 text-left transition-colors hover:border-[var(--color-brand-500)]"
        style={{ fontSize: 14 }}
      >
        <Calendar size={14} className="shrink-0 text-[#8a939b]" />
        <span className={displayValue ? 'text-[#212225]' : 'text-[#8a939b]'}>
          {displayValue || placeholder}
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-[46px] z-20 w-[min(272px,100%)] overflow-hidden rounded-[12px] border border-[#dfe3e5] bg-white"
          style={{ boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)' }}
        >
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={prevMonth}
              className="flex size-7 items-center justify-center rounded-md text-[#8a939b] transition-colors hover:bg-[#f0f2f3]"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-medium text-[#212225]" style={{ fontSize: 14 }}>
              {year}년 {month + 1}월
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex size-7 items-center justify-center rounded-md text-[#8a939b] transition-colors hover:bg-[#f0f2f3]"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-t border-[#f0f2f3] px-3 pb-1 pt-2">
            {DAYS.map((d) => (
              <div key={d} className="flex h-7 items-center justify-center">
                <span className="text-[#8a939b]" style={{ fontSize: 12 }}>{d}</span>
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 px-3 pb-3">
            {days.map((day, i) => {
              const isCurrentMonth = day.getMonth() === month
              const key = toKey(day)
              const isSelected = key === selectedKey
              const isToday = key === todayKey

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(day)
                    setOpen(false)
                  }}
                  className="flex h-8 w-full items-center justify-center rounded-full transition-colors hover:bg-[rgba(99,102,241,0.08)]"
                  style={{
                    background: isSelected ? '#6366f1' : undefined,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: isSelected
                        ? 'white'
                        : isToday
                          ? '#6366f1'
                          : isCurrentMonth
                            ? '#212225'
                            : '#c0c8d0',
                      fontWeight: isToday && !isSelected ? 600 : undefined,
                    }}
                  >
                    {day.getDate()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
