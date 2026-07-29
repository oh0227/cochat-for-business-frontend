import { create } from 'zustand'

export interface CalendarPromptItem {
  notificationId: string
  title: string
  summary: string
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
