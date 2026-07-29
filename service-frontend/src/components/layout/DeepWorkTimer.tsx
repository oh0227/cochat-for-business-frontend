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
