import { create } from 'zustand'

interface DeepWorkState {
  isRunning: boolean
  elapsed: number          // 경과 시간(초)
  selectedDuration: 30 | 60 | 90 | null
  sessionStartedAt: string | null  // 세션 시작 시각 (ISO 8601) — 브리핑 sinceAt으로 사용
  noNewAlerts: boolean     // 마지막 브리핑 이후 새 알림 없음 (API 422)
  pendingOpenModal: boolean  // 대시보드 [세션보기] 클릭 시 deepwork 진입과 동시에 모달 오픈

  start: (duration: 30 | 60 | 90 | null, startedAt: string) => void
  end: () => void
  tick: () => void         // 타이머 1초 증가 — useEffect에서 호출
  setNoNewAlerts: (value: boolean) => void
  openModalOnEnter: () => void   // deepwork 진입 시 모달 오픈 요청
  consumeModalPending: () => void  // DeepWorkClient에서 플래그 소비 후 초기화
}

export const useDeepWorkStore = create<DeepWorkState>((set) => ({
  isRunning: false,
  elapsed: 0,
  selectedDuration: null,
  sessionStartedAt: null,
  noNewAlerts: false,
  pendingOpenModal: false,

  start: (duration, startedAt) =>
    set({ isRunning: true, elapsed: 0, selectedDuration: duration, sessionStartedAt: startedAt, noNewAlerts: false }),

  end: () =>
    set({ isRunning: false, elapsed: 0, selectedDuration: null, sessionStartedAt: null, noNewAlerts: false }),

  tick: () =>
    set((state) => ({ elapsed: state.elapsed + 1 })),

  setNoNewAlerts: (value) =>
    set({ noNewAlerts: value }),

  openModalOnEnter: () =>
    set({ pendingOpenModal: true }),

  consumeModalPending: () =>
    set({ pendingOpenModal: false }),
}))
