import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DeepWorkState {
  isRunning: boolean
  elapsed: number
  selectedDuration: 30 | 60 | 90 | null
  sessionId: number | null            // 백엔드 focus session ID
  sessionStartedAt: string | null     // 세션 시작 시각 (ISO 8601)
  noNewAlerts: boolean
  pendingOpenModal: boolean

  start: (duration: 30 | 60 | 90 | null, startedAt: string, sessionId: number | null) => void
  end: () => void
  tick: () => void
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
      noNewAlerts: false,
      pendingOpenModal: false,

      start: (duration, startedAt, sessionId) =>
        set({ isRunning: true, elapsed: 0, selectedDuration: duration, sessionStartedAt: startedAt, sessionId, noNewAlerts: false }),

      end: () =>
        set({ isRunning: false, elapsed: 0, selectedDuration: null, sessionStartedAt: null, sessionId: null, noNewAlerts: false }),

      tick: () =>
        set((state) => ({ elapsed: state.elapsed + 1 })),

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
        noNewAlerts: state.noNewAlerts,
      }),
    }
  )
)
