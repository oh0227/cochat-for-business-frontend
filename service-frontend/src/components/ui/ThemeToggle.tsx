'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme, type Theme } from '@/hooks/useTheme'

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: '라이트', Icon: Sun },
  { value: 'dark', label: '다크', Icon: Moon },
  { value: 'system', label: '시스템', Icon: Monitor },
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-3 gap-[var(--spacing-2xs)]">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={[
            'flex items-center justify-center gap-[var(--spacing-3xs)] rounded-[var(--radius-xs)] py-[var(--spacing-xs)] font-medium transition-colors',
            theme === value
              ? 'bg-[var(--color-brand-500)] text-white'
              : 'border border-[var(--color-gray-100)] bg-[var(--color-gray-default)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
          ].join(' ')}
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  )
}
