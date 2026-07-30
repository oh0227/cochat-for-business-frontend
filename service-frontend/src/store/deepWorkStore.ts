import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DeepWorkState {
  isRunning: boolean
  elapsed: number
  selectedDuration: 30 | 60 | 90 | null
  sessionId: number | null            // 백엔드 focus session ID
  sessionStartedAt: string | null     // 세션 시작 시각 (ISO 8601)
  lastBriefingAt: string | null       // 세션 내 마지막 브리핑 요청 시각 (ISO 8601) - 이 시점 이전 알림은 보류 카운트에서 제외
  noNewAlerts: boolean
  pendingOpenModal: boolean

  start: (duration: 30 | 60 | 90 | null, startedAt: string, sessionId: number | null) => void
  end: () => void
  tick: () => void
  syncElapsed: (value: number) => void
  setLastBriefingAt: (value: string) => void
  setNoNewAlerts: (value: boolean) => void
  openModalOnEnter: () => void
  consumeModalPending: () => void
}

export const useDeepWorkStore = create<DeepWorkState>()(
  persist(
    (set) => ({
      isRunning: false,
      elapsed: 0,
      selectedDuration: null,
      sessionId: null,
      sessionStartedAt: null,
      lastBriefingAt: null,
      noNewAlerts: false,
      pendingOpenModal: false,

      start: (duration, startedAt, sessionId) =>
        set({ isRunning: true, elapsed: 0, selectedDuration: duration, sessionStartedAt: startedAt, sessionId, lastBriefingAt: null, noNewAlerts: false }),

      end: () =>
        set({ isRunning: false, elapsed: 0, selectedDuration: null, sessionStartedAt: null, sessionId: null, lastBriefingAt: null, noNewAlerts: false }),

      tick: () =>
        set((state) => ({ elapsed: state.elapsed + 1 })),

      // 화면 꺼짐/탭 백그라운드로 setInterval이 멈췄다가 재진입했을 때,
      // sessionStartedAt 기준으로 재계산한 실제 경과 시간으로 보정하기 위한 액션
      syncElapsed: (value) =>
        set({ elapsed: value }),

      setLastBriefingAt: (value) =>
        set({ lastBriefingAt: value }),

      setNoNewAlerts: (value) =>
        set({ noNewAlerts: value }),

      openModalOnEnter: () =>
        set({ pendingOpenModal: true }),

      consumeModalPending: () =>
        set({ pendingOpenModal: false }),
    }),
    {
      name: 'deepwork-session',
      // pendingOpenModal은 페이지 진입 시 1회성 트리거이므로 새로고침 후에도 유지되면 안 된다
      partialize: (state) => ({
        isRunning: state.isRunning,
        elapsed: state.elapsed,
        selectedDuration: state.selectedDuration,
        sessionId: state.sessionId,
        sessionStartedAt: state.sessionStartedAt,
        lastBriefingAt: state.lastBriefingAt,
        noNewAlerts: state.noNewAlerts,
      }),
    }
  )
)
