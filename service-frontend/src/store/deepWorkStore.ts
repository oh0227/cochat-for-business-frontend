import { create } from 'zustand'

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

export const useDeepWorkStore = create<DeepWorkState>((set) => ({
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
}))
