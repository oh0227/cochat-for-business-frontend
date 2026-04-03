/** 캘린더(CalendarEvent) mock 데이터 */

import type { CalendarEvent, TodaySchedule } from '@/types'

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-001',
    title: '주간 스프린트 스탠드업',
    startAt: '2026-04-03T10:00:00Z',
    endAt: '2026-04-03T10:30:00Z',
    isAllDay: false,
    attendees: ['김민준', '이서연', '박지호', '최유진', '정태양'],
    relatedNotificationIds: [],
  },
  {
    id: 'event-002',
    title: 'Q1 예산 검토 미팅',
    startAt: '2026-04-03T13:00:00Z',
    endAt: '2026-04-03T14:00:00Z',
    isAllDay: false,
    attendees: ['김민준', '한소희', '재무팀 이혜원'],
    relatedNotificationIds: ['notif-001'],
  },
  {
    id: 'event-003',
    title: '디자인 리뷰',
    startAt: '2026-04-04T01:00:00Z',
    endAt: '2026-04-04T02:30:00Z',
    isAllDay: false,
    attendees: ['박지호', '오지민', '이서연'],
    relatedNotificationIds: ['notif-003'],
  },
  {
    id: 'event-004',
    title: '전사 타운홀',
    startAt: '2026-04-04T05:00:00Z',
    endAt: '2026-04-04T06:00:00Z',
    isAllDay: false,
    attendees: [],
    relatedNotificationIds: [],
  },
  {
    id: 'event-005',
    title: '팀 워크샵',
    startAt: '2026-04-10T00:00:00Z',
    endAt: '2026-04-10T23:59:59Z',
    isAllDay: true,
    attendees: ['김민준', '이서연', '박지호', '최유진', '정태양', '한소희', '오지민'],
    relatedNotificationIds: ['notif-007'],
  },
]

export const mockTodaySchedule: TodaySchedule = {
  date: '2026-04-03',
  events: mockCalendarEvents.filter((e) => e.startAt.startsWith('2026-04-03')),
}
