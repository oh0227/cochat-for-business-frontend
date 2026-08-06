'use client'

import { useState, type ReactNode } from 'react'

interface TooltipProps {
  label: string
  children: ReactNode
  className?: string
}

export default function Tooltip({ label, children, className = '' }: TooltipProps) {
  const [hovering, setHovering] = useState(false)

  return (
    <div
      className={['relative flex', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {children}
      {hovering && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-white shadow-lg"
          style={{ background: 'var(--color-gray-inverse)', fontSize: 'var(--font-size-3xs)' }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
