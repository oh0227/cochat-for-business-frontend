/** 캘린더 일정(CalendarEvent) 관련 공통 타입 정의 */

// 캘린더 일정 단건
export interface CalendarEvent {
  id: string
  title: string
  startAt: string                  // ISO 8601
  endAt: string                    // ISO 8601
  isAllDay: boolean
  attendees: string[]              // 참석자 이름 또는 이메일
  relatedNotificationIds: string[]
}

// 캘린더 일정 상세 패널용
export interface CalendarEventDetail extends CalendarEvent {
  description: string | null
  location: string | null
  meetingLink: string | null
}

// 캘린더 오늘 일정 사이드패널용
export interface TodaySchedule {
  date: string                     // YYYY-MM-DD
  events: CalendarEvent[]
}
