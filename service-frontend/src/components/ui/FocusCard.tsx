'use client'

import { useRouter } from 'next/navigation'
import { Atom } from 'lucide-react'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { endFocusSession } from '@/lib/focusSession'

/** 경과 시간을 "M:SS" 형식으로 표시 (Figma 디자인 기준 분은 0패딩 없음) */
function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = (totalSeconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function FocusCard() {
  const router = useRouter()
  const { isRunning, elapsed, sessionId, openModalOnEnter, end } = useDeepWorkStore()

  // 실제 실행 중인지는 Zustand store의 isRunning으로 판단
  // (session prop은 목업/서버 데이터라 store 상태와 다를 수 있음)
  // [백엔드 연결] 백엔드 연결 시 isRunning 대신 서버에서 받은 session.status로 판단하도록 변경 가능
  const isActive = isRunning

  function handleStart() {
    openModalOnEnter()
    router.push('/deepwork')
  }

  async function handleEnd() {
    if (sessionId) await endFocusSession(sessionId)
    end()
  }

  return (
    <div
      className={
        isActive
          ? 'flex flex-col justify-between rounded-[14px] border-[1.5px] border-[var(--color-brand-400)] p-[var(--spacing-md)]'
          : 'flex flex-col justify-between rounded-[14px] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] p-[var(--spacing-md)]'
      }
      style={
        isActive
          ? { height: '170px', backgroundImage: 'linear-gradient(101deg, rgba(90,93,219,0.08) 14.656%, rgba(59,130,246,0.08) 85.344%)' }
          : { height: '170px' }
      }
    >
      {/* 상단: 제목 + 설명/경과시간 + 아이콘 */}
      <div className="flex items-start justify-between gap-[var(--spacing-2xs)]">
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-3xs)]">
          <span
            className="font-semibold leading-[var(--line-height-xs)]"
            style={{
              fontSize: 'var(--font-size-sm)',
              color: isActive ? 'var(--color-brand-600)' : 'var(--color-gray-700)',
            }}
          >
            집중 모드
          </span>
          {isActive ? (
            <span
              className="font-bold leading-[var(--line-height-3xl)] text-[var(--color-brand-600)]"
              style={{ fontSize: 'var(--font-size-2xl)' }}
            >
              {formatElapsed(elapsed)}
            </span>
          ) : (
            <p
              className="leading-[var(--line-height-4xs)] text-[var(--color-gray-700)]"
              style={{ fontSize: 'var(--font-size-3xs)' }}
            >
              집중 모드 중에는<br />긴급한 알림만 표시됩니다.
            </p>
          )}
        </div>
        <span
          className="flex shrink-0 items-center justify-center rounded-[10px] bg-[rgba(90,93,219,0.1)]"
          style={{ width: '36px', height: '36px' }}
        >
          <Atom size={20} className="text-[var(--color-brand-600)]" />
        </span>
      </div>

      {/* 하단: 버튼 */}
      {isActive ? (
        <button
          type="button"
          onClick={handleEnd}
          className="flex h-[40px] w-full items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-brand-400)] bg-[var(--color-gray-default)] font-medium text-[var(--color-brand-600)] transition-opacity hover:opacity-80"
          style={{ fontSize: 'var(--font-size-xs)' }}
        >
          종료
        </button>
      ) : (
        <button
          type="button"
          onClick={handleStart}
          className="flex h-[40px] w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-brand-500)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
          style={{ fontSize: 'var(--font-size-xs)' }}
        >
          시작하기
        </button>
      )}
    </div>
  )
}
