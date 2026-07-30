'use client'

import { useEffect, useRef } from 'react'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { endFocusSession } from '@/lib/focusSession'

/**
 * 집중모드 타이머를 전역에서 유지하는 컴포넌트.
 * (main)/layout.tsx에 마운트되어 페이지 이동과 무관하게 타이머가 지속됩니다.
 */
export default function DeepWorkTimer() {
  const { isRunning } = useDeepWorkStore()
  // ref로 최신 상태를 참조해 setInterval 재등록 없이 정확한 틱 처리
  const storeRef = useRef(useDeepWorkStore.getState)

  // 화면 꺼짐/탭 백그라운드 중에는 setInterval이 멈추므로, 다시 들어왔을 때
  // sessionStartedAt(벽시계 기준)으로 실제 경과 시간을 재계산해 세션을 이어간다.
  // 그 사이 설정 시간이 이미 지났다면 즉시 자동 종료 처리한다.
  useEffect(() => {
    function reconcileSession() {
      const { isRunning, sessionStartedAt, selectedDuration, sessionId, syncElapsed, end } = storeRef.current()
      if (!isRunning || !sessionStartedAt) return

      const realElapsed = Math.floor((Date.now() - new Date(sessionStartedAt).getTime()) / 1000)
      if (selectedDuration !== null && realElapsed >= selectedDuration * 60) {
        if (sessionId) void endFocusSession(sessionId)
        end()
        return
      }
      syncElapsed(Math.max(realElapsed, 0))
    }

    // 최초 진입(마운트) 시 1회 확인
    reconcileSession()

    // 화면이 다시 보일 때(화면 켜짐, 탭 포그라운드 복귀) 재확인
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') reconcileSession()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      const { elapsed, selectedDuration, sessionId, tick, end } = storeRef.current()
      if (selectedDuration !== null && elapsed + 1 >= selectedDuration * 60) {
        if (sessionId) void endFocusSession(sessionId)
        end()
        return
      }
      tick()
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning]) // isRunning 변경 시에만 interval 재등록

  return null
}
