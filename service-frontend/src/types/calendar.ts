/** 캘린더 일정(CalendarEvent) 관련 공통 타입 정의 */

// 캘린더 일정 단건
export interface CalendarEvent {
  id: string                       // Google Calendar 실제 이벤트 ID
  title: string
  startAt: string                  // ISO 8601
  endAt: string                    // ISO 8601
  isAllDay: boolean
  attendees: string[]              // 참석자 이메일
  description: string | null
  location: string | null
  meetingLink: string | null
  relatedNotificationIds: string[] // 자체 DB가 없어 항상 빈 배열
}

// 캘린더 오늘 일정 사이드패널용
export interface TodaySchedule {
  date: string                     // YYYY-MM-DD
  events: CalendarEvent[]
}
