'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Mail,
  Sparkles,
  Atom,
  Calendar,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { label: '메시지', href: '/messages', icon: Mail },
  { label: '브리핑', href: '/briefing', icon: Sparkles },
  { label: '집중모드', href: '/deepwork', icon: Atom },
  { label: '캘린더', href: '/calendar', icon: Calendar },
] as const

interface SidebarProps {
  unreadCount: number
}

export default function Sidebar({ unreadCount }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col bg-[#ffffff] border-r border-[var(--color-gray-80)]">
      {/* 로고 */}
      <div className="flex items-center gap-[var(--spacing-2xs)] px-[var(--spacing-sm)] py-[var(--spacing-lg)]">
        <Image src="/logo.png" alt="CoChat 로고" width={28} height={28} />
        <span
          className="font-semibold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
        >
          CoChat
        </span>
      </div>

      {/* 메인 네비게이션 */}
      <nav className="flex flex-1 flex-col gap-[var(--spacing-3xs)] px-[var(--spacing-2xs)]">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)]',
                'transition-colors',
                isActive
                  ? 'bg-[var(--color-brand-500)] text-white'
                  : 'text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
              ].join(' ')}
            >
              <Icon size={20} />
              <span
                className="flex-1 font-medium"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                {label}
              </span>
              {label === '메시지' && unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-[var(--radius-8xl)] bg-[var(--color-brand-500)] px-1 text-[11px] font-semibold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* 하단 설정 */}
      <div className="px-[var(--spacing-2xs)] pb-[var(--spacing-lg)]">
        <Link
          href="/settings"
          className={[
            'flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)]',
            'transition-colors',
            pathname === '/settings'
              ? 'bg-[var(--color-brand-500)] text-white'
              : 'text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
          ].join(' ')}
        >
          <Settings size={20} />
          <span
            className="font-medium"
            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            설정
          </span>
        </Link>
      </div>
    </aside>
  )
}
