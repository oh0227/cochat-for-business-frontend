'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

interface AppShellProps {
  unreadCount: number
  children: React.ReactNode
}

/** 반응형 앱 셸: lg 이상은 사이드바 상시 노출, 그 이하는 오프캔버스 드로어로 전환 */
export default function AppShell({ unreadCount, children }: AppShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-gray-50)] lg:flex-row">
      {/* 모바일/태블릿 상단 바 */}
      <header className="flex h-14 shrink-0 items-center gap-[var(--spacing-2xs)] border-b border-[var(--color-gray-80)] bg-white px-[var(--spacing-sm)] lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="메뉴 열기"
          className="flex size-9 items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
        >
          <Menu size={22} />
        </button>
        <Image src="/logo.png" alt="CoChat 로고" width={22} height={22} />
        <span
          className="font-semibold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
        >
          CoChat
        </span>
      </header>

      {/* 모바일 오프캔버스 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar unreadCount={unreadCount} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto p-[var(--spacing-sm)] sm:p-[var(--spacing-md)] lg:p-[var(--spacing-lg)]">
        {children}
      </main>
    </div>
  )
}
