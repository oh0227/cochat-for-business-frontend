import { create } from 'zustand'

export interface CalendarPromptItem {
  notificationId: string
  title: string
  summary: string
  occurredAt: string // 일정 시간 확인 모달의 기본값 시드 폴백 (suggestedStartTime이 없을 때만 사용)
  suggestedStartTime?: string | null       // AI가 추출한 실제 일정 시작 시각 (있으면 occurredAt 대신 기본값으로 사용)
  suggestedDurationMinutes?: number | null // AI가 추출한 예상 소요 시간(분)
}

interface CalendarPromptState {
  queue: CalendarPromptItem[]
  enqueue: (item: CalendarPromptItem) => void
  dequeue: () => void
}

// SSE로 실시간 수신한 prompted 알림 + 오프라인 중 놓친 prompted 알림을 담는 큐.
// 화면에는 항상 한 번에 한 건(queue[0])만 모달로 노출한다.
export const useCalendarPromptStore = create<CalendarPromptState>()((set) => ({
  queue: [],
  enqueue: (item) =>
    set((state) =>
      state.queue.some((q) => q.notificationId === item.notificationId)
        ? state
        : { queue: [...state.queue, item] }
    ),
  dequeue: () => set((state) => ({ queue: state.queue.slice(1) })),
}))
