'use client'

import { useEffect, useState } from 'react'
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
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { label: '메시지', href: '/messages', icon: Mail },
  { label: '브리핑', href: '/briefing', icon: Sparkles },
  { label: '집중모드', href: '/deepwork', icon: Atom },
  { label: '캘린더', href: '/calendar', icon: Calendar },
] as const

const PINNED_STORAGE_KEY = 'sidebarPinned'

interface SidebarProps {
  unreadCount: number
  isOpen?: boolean
  onClose?: () => void
}

function NavLinks({
  pathname,
  unreadCount,
  showLabel,
  onNavigate,
}: {
  pathname: string
  unreadCount: number
  showLabel: boolean
  onNavigate?: () => void
}) {
  return (
    <>
      <nav className="flex flex-1 flex-col gap-[var(--spacing-3xs)] px-[var(--spacing-2xs)]">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={showLabel ? undefined : label}
              className={[
                'flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)]',
                'transition-colors',
                showLabel ? '' : 'justify-center',
                isActive
                  ? 'bg-[var(--color-brand-500)] text-white'
                  : 'text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
              ].join(' ')}
            >
              <Icon size={20} />
              {showLabel && (
                <span
                  className="flex-1 font-medium"
                  style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                >
                  {label}
                </span>
              )}
              {showLabel && label === '메시지' && unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-[var(--radius-8xl)] bg-[var(--color-brand-500)] px-1 text-[11px] font-semibold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-[var(--spacing-2xs)] pb-[var(--spacing-lg)]">
        <Link
          href="/settings"
          onClick={onNavigate}
          title={showLabel ? undefined : '설정'}
          className={[
            'flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)]',
            'transition-colors',
            showLabel ? '' : 'justify-center',
            pathname === '/settings'
              ? 'bg-[var(--color-brand-500)] text-white'
              : 'text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
          ].join(' ')}
        >
          <Settings size={20} />
          {showLabel && (
            <span
              className="font-medium"
              style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
            >
              설정
            </span>
          )}
        </Link>
      </div>
    </>
  )
}

export default function Sidebar({ unreadCount, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [pinned, setPinned] = useState(true)
  const [hoveringToggle, setHoveringToggle] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(PINNED_STORAGE_KEY)
    if (stored === 'false') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPinned(false)
    }
  }, [])

  function togglePinned() {
    const next = !pinned
    setPinned(next)
    localStorage.setItem(PINNED_STORAGE_KEY, String(next))
    setHoveringToggle(false)
  }

  return (
    <>
      {/* 모바일/태블릿 오프캔버스 드로어 */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex h-screen w-[240px] shrink-0 flex-col bg-[var(--color-gray-default)] border-r border-[var(--color-gray-80)]',
          'transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:hidden',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-[var(--spacing-2xs)] px-[var(--spacing-sm)] py-[var(--spacing-lg)]">
          <div className="flex items-center gap-[var(--spacing-2xs)]">
            <Image src="/logo.png" alt="CoChat 로고" width={28} height={28} />
            <span
              className="font-semibold text-[var(--color-gray-950)]"
              style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
            >
              CoChat
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="flex size-8 items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]"
          >
            <X size={20} />
          </button>
        </div>
        <NavLinks pathname={pathname} unreadCount={unreadCount} showLabel onNavigate={onClose} />
      </aside>

      {/*
        데스크톱 사이드바: 항상 레이아웃에 존재한다 (Gemini 패턴).
        고정 시 220px 전체 사이드바, 접으면 64px 아이콘 레일로 줄어들 뿐
        완전히 사라지지 않아서 <main>이 자리를 침범하지 않는다.
      */}
      <aside
        className={[
          'hidden shrink-0 flex-col bg-[var(--color-gray-default)] border-r border-[var(--color-gray-80)]',
          'transition-[width] duration-200 ease-out lg:flex',
          pinned ? 'lg:w-[220px]' : 'lg:w-16',
        ].join(' ')}
      >
        <div className="flex items-center px-[var(--spacing-2xs)] py-[var(--spacing-lg)]">
          {pinned ? (
            <>
              <div className="flex min-w-0 flex-1 items-center gap-[var(--spacing-2xs)] px-[var(--spacing-3xs)]">
                <Image src="/logo.png" alt="CoChat 로고" width={28} height={28} />
                <span
                  className="truncate font-semibold text-[var(--color-gray-950)]"
                  style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
                >
                  CoChat
                </span>
              </div>
              <button
                type="button"
                onClick={togglePinned}
                aria-label="사이드바 접기"
                title="사이드바 접기"
                className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]"
              >
                <PanelLeftClose size={18} />
              </button>
            </>
          ) : (
            <div className="relative flex w-full justify-center">
              <button
                type="button"
                onClick={togglePinned}
                onMouseEnter={() => setHoveringToggle(true)}
                onMouseLeave={() => setHoveringToggle(false)}
                aria-label="사이드바 열기"
                className="flex size-9 items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]"
              >
                {hoveringToggle ? (
                  <PanelLeftOpen size={20} />
                ) : (
                  <Image src="/logo.png" alt="CoChat 로고" width={26} height={26} className="rounded-[6px]" />
                )}
              </button>
              {hoveringToggle && (
                <span
                  className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-white shadow-lg"
                  style={{ background: 'var(--color-gray-900)', fontSize: 'var(--font-size-3xs)' }}
                >
                  사이드바 열기
                </span>
              )}
            </div>
          )}
        </div>
        <NavLinks pathname={pathname} unreadCount={unreadCount} showLabel={pinned} />
      </aside>
    </>
  )
}
