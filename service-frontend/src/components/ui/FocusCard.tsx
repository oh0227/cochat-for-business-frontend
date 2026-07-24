'use client'

import { useRouter } from 'next/navigation'
import { Atom } from 'lucide-react'
import type { FocusSession } from '@/types'
import { useDeepWorkStore } from '@/store/deepWorkStore'

interface FocusCardProps {
  session: FocusSession | null
}

export default function FocusCard({ session }: FocusCardProps) {
  const router = useRouter()
  const { isRunning, openModalOnEnter } = useDeepWorkStore()

  // 실제 실행 중인지는 Zustand store의 isRunning으로 판단
  // (session prop은 목업/서버 데이터라 store 상태와 다를 수 있음)
  // [백엔드 연결] 백엔드 연결 시 isRunning 대신 서버에서 받은 session.status로 판단하도록 변경 가능
  const isActive = isRunning

  function handleClick() {
    if (!isActive) {
      // 집중모드 미실행 상태: deepwork 페이지 이동 + 타이머 설정 모달 오픈
      openModalOnEnter()
    }
    router.push('/deepwork')
  }

  return (
    <div
      className="flex flex-col justify-between rounded-[14px] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] p-[var(--spacing-md)]"
      style={{ height: '170px' }}
    >
      {/* 상단: 제목 + 설명 + 아이콘 */}
      <div className="flex items-start justify-between gap-[var(--spacing-2xs)]">
        <div className="flex flex-col gap-[var(--spacing-3xs)]">
          <span
            className="font-semibold leading-[var(--line-height-xs)] text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-sm)' }}
          >
            집중 모드
          </span>
          <p
            className="leading-[var(--line-height-4xs)] text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-3xs)' }}
          >
            {isActive
              ? `${session?.plannedDurationMinutes ?? ''}분 세션 진행 중입니다.`
              : <>집중 모드 중에는<br />긴급한 알림만 표시됩니다.</>}
          </p>
        </div>
        <span
          className="flex shrink-0 items-center justify-center rounded-[10px] bg-[rgba(90,93,219,0.1)]"
          style={{ width: '36px', height: '36px' }}
        >
          <Atom size={20} className="text-[var(--color-brand-600)]" />
        </span>
      </div>

      {/* 하단: 버튼 */}
      <button
        type="button"
        onClick={handleClick}
        className="flex h-[40px] w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-brand-500)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
        style={{ fontSize: 'var(--font-size-xs)' }}
      >
        {isActive ? '세션 보기' : '시작하기'}
      </button>
    </div>
  )
}
