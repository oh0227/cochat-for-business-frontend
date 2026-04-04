'use client'

import { useState, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface TimePickerInputProps {
  value: string // "HH:MM" 24h 형식, 빈 문자열이면 미선택
  onChange: (time: string) => void
  placeholder?: string
}

/** "HH:MM" → "오전/오후 H:MM" */
function formatDisplay(time: string): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const ampm = h < 12 ? '오전' : '오후'
  const displayH = h % 12 === 0 ? 12 : h % 12
  return `${ampm} ${displayH}:${String(m).padStart(2, '0')}`
}

// 30분 간격 시간 슬롯 생성 (00:00 ~ 23:30)
const TIME_SLOTS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2, '0')}:${m}`
})

const ITEM_HEIGHT = 40

export default function TimePickerInput({
  value,
  onChange,
  placeholder = '시간 선택',
}: TimePickerInputProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 열릴 때 선택된 항목(또는 현재 시간)으로 스크롤
  useEffect(() => {
    if (!open || !listRef.current) return
    const targetSlot = value || (() => {
      const now = new Date()
      const h = now.getHours()
      const m = now.getMinutes() < 30 ? '00' : '30'
      return `${String(h).padStart(2, '0')}:${m}`
    })()
    const idx = TIME_SLOTS.indexOf(targetSlot)
    if (idx >= 0) {
      listRef.current.scrollTop = Math.max(0, idx * ITEM_HEIGHT - ITEM_HEIGHT * 2)
    }
  }, [open, value])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[42px] w-full items-center gap-2 rounded-[10px] border border-[#dfe3e5] bg-white px-4 text-left transition-colors hover:border-[var(--color-brand-500)]"
        style={{ fontSize: 14 }}
      >
        <Clock size={14} className="shrink-0 text-[#8a939b]" />
        <span className={value ? 'text-[#212225]' : 'text-[#8a939b]'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute left-0 top-[46px] z-20 max-h-[240px] w-full overflow-y-auto rounded-[12px] border border-[#dfe3e5] bg-white"
          style={{ boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)' }}
        >
          {TIME_SLOTS.map((slot) => {
            const isSelected = slot === value
            return (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  onChange(slot)
                  setOpen(false)
                }}
                className="flex w-full items-center px-4 transition-colors hover:bg-[rgba(99,102,241,0.06)]"
                style={{
                  height: ITEM_HEIGHT,
                  fontSize: 14,
                  background: isSelected ? 'rgba(99,102,241,0.1)' : undefined,
                  color: isSelected ? '#6366f1' : '#212225',
                  fontWeight: isSelected ? 600 : undefined,
                }}
              >
                {formatDisplay(slot)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
