/**
 * 자체 캘린더(`/calendar`) 페이지용 클라이언트 API 헬퍼.
 * Next.js 프록시 라우트(/api/calendar-events) 경유 — 실체는 연동된 Google Calendar CRUD.
 * Google Calendar 미연동 유저는 모든 요청이 404를 반환한다.
 */
import type { CalendarEvent } from '@/types'

// 백엔드 응답 타입 (snake_case)
interface BackendCalendarEvent {
  id: string
  title: string
  start_at: string
  end_at: string
  is_all_day: boolean
  attendees: string[]
  description: string | null
  location: string | null
  meeting_link: string | null
  related_notification_ids: string[]
}

function toCalendarEvent(raw: BackendCalendarEvent): CalendarEvent {
  return {
    id: raw.id,
    title: raw.title,
    startAt: raw.start_at,
    endAt: raw.end_at,
    isAllDay: raw.is_all_day,
    attendees: raw.attendees,
    description: raw.description,
    location: raw.location,
    meetingLink: raw.meeting_link,
    relatedNotificationIds: raw.related_notification_ids,
  }
}

export interface CalendarEventInput {
  title: string
  startAt: string
  endAt: string
  isAllDay: boolean
  attendees: string[]
  description?: string | null
}

function toRequestBody(input: CalendarEventInput) {
  return {
    title: input.title,
    start_at: input.startAt,
    end_at: input.endAt,
    is_all_day: input.isAllDay,
    attendees: input.attendees,
    description: input.description ?? null,
  }
}

type CalendarEventListResult =
  | { ok: true; events: CalendarEvent[] }
  | { ok: false; notConnected: boolean; error: string }

/** 월 범위(from/to, YYYY-MM-DD) 안의 캘린더 일정 목록 조회 */
export async function listCalendarEvents(from: string, to: string): Promise<CalendarEventListResult> {
  try {
    const res = await fetch(`/api/calendar-events?from=${from}&to=${to}`)
    if (res.status === 404) {
      const data = await res.json().catch(() => ({})) as { detail?: string }
      return { ok: false, notConnected: true, error: data.detail ?? '구글 캘린더 연동이 필요합니다.' }
    }
    if (!res.ok) {
      const body = await res.text()
      console.error(`[calendarEvents] 목록 조회 실패 (status=${res.status})`, body)
      return { ok: false, notConnected: false, error: '캘린더 일정을 불러오지 못했습니다.' }
    }
    const data = await res.json() as { events: BackendCalendarEvent[] }
    return { ok: true, events: (data.events ?? []).map(toCalendarEvent) }
  } catch (error) {
    console.error('[calendarEvents] 목록 조회 요청 실패', error)
    return { ok: false, notConnected: false, error: '캘린더 일정을 불러오지 못했습니다.' }
  }
}

type CalendarEventMutationResult =
  | { ok: true; event: CalendarEvent }
  | { ok: false; notConnected: boolean; error: string }

async function parseMutationError(res: Response): Promise<CalendarEventMutationResult> {
  const data = await res.json().catch(() => ({})) as { detail?: string }
  const error = data.detail ?? '캘린더 일정 처리에 실패했습니다.'
  return { ok: false, notConnected: res.status === 404, error }
}

/** 새 캘린더 일정 생성 */
export async function createCalendarEvent(input: CalendarEventInput): Promise<CalendarEventMutationResult> {
  try {
    const res = await fetch('/api/calendar-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toRequestBody(input)),
    })
    if (!res.ok) return parseMutationError(res)
    const data = await res.json() as BackendCalendarEvent
    return { ok: true, event: toCalendarEvent(data) }
  } catch (error) {
    console.error('[calendarEvents] 생성 요청 실패', error)
    return { ok: false, notConnected: false, error: '캘린더 일정 생성에 실패했습니다.' }
  }
}

/** 기존 캘린더 일정 수정 */
export async function updateCalendarEvent(id: string, input: CalendarEventInput): Promise<CalendarEventMutationResult> {
  try {
    const res = await fetch(`/api/calendar-events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toRequestBody(input)),
    })
    if (!res.ok) return parseMutationError(res)
    const data = await res.json() as BackendCalendarEvent
    return { ok: true, event: toCalendarEvent(data) }
  } catch (error) {
    console.error('[calendarEvents] 수정 요청 실패', error)
    return { ok: false, notConnected: false, error: '캘린더 일정 수정에 실패했습니다.' }
  }
}
