/** 채팅방 메시지 관련 타입 */

import type { NotificationPriority, CalendarStatus } from './notification'

export interface ChatMessage {
  id: string
  author: string
  content: string
  createdAt: string
  notificationId?: string       // 연동된 알림 ID (있으면 좌측 우선순위 바 표시)
  priorityBar?: NotificationPriority
  isScheduleRelated: boolean
  calendarStatus: CalendarStatus
  calendarEventUrl: string | null
}
