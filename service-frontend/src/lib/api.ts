/**
 * 백엔드 API 클라이언트 (서버 컴포넌트 전용)
 *
 * 클라이언트 컴포넌트에서 백엔드를 호출할 때는
 * src/app/api/** 의 Next.js Route Handler를 프록시로 사용하세요.
 */

import type { Notification, NotificationPriority, NotificationProvider, NotificationStatus, CalendarStatus, ChannelSummary, ChatMessage } from '@/types'
import type { BackendBriefing } from './briefing'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

// ─── 임시 user_id (인증 시스템 연동 후 제거) ────────────────────────────────
export const TEMP_USER_ID = 1

// ─── 백엔드 응답 타입 (snake_case) ───────────────────────────────────────────

interface BackendNotification {
  id: number
  title: string
  sender_name: string | null
  channel_name: string | null
  source_type: string
  provider: string | null
  integration_id: number | null
  priority: string
  original_text: string
  summary: string
  reason: string
  occurred_at: string
  source_url: string | null
  is_direct_target: boolean
  status: NotificationStatus
  is_schedule_related: boolean
  calendar_status: string
  calendar_event_id: string | null
  calendar_event_url: string | null
  created_at: string
}

/** 백엔드 priority(대문자 시작, 예: "High", "Emergency")를 프론트 표준값으로 정규화 */
const PRIORITY_MAP: Record<string, NotificationPriority> = {
  emergency: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
}

export function normalizePriority(raw: string): NotificationPriority {
  return PRIORITY_MAP[raw.toLowerCase()] ?? 'low'
}

const VALID_PROVIDERS: readonly NotificationProvider[] = ['slack', 'jira', 'discord', 'gmail']

function normalizeProvider(raw: string | null): NotificationProvider | undefined {
  return VALID_PROVIDERS.includes(raw as NotificationProvider) ? (raw as NotificationProvider) : undefined
}

const VALID_CALENDAR_STATUSES: readonly CalendarStatus[] = ['none', 'pending', 'prompted', 'registered', 'dismissed']

function normalizeCalendarStatus(raw: string): CalendarStatus {
  return VALID_CALENDAR_STATUSES.includes(raw as CalendarStatus) ? (raw as CalendarStatus) : 'none'
}

// ─── 변환 함수 ───────────────────────────────────────────────────────────────

function toNotification(raw: BackendNotification): Notification {
  return {
    id: String(raw.id),
    integrationId: raw.integration_id != null ? String(raw.integration_id) : undefined,
    title: raw.title,
    provider: normalizeProvider(raw.provider),
    priority: normalizePriority(raw.priority),
    summary: raw.summary,
    originalContent: raw.original_text,
    actor: raw.sender_name,
    channel: raw.channel_name,
    status: raw.status,
    isScheduleRelated: raw.is_schedule_related,
    calendarStatus: normalizeCalendarStatus(raw.calendar_status),
    calendarEventId: raw.calendar_event_id,
    calendarEventUrl: raw.calendar_event_url,
    createdAt: raw.created_at,
  }
}

// 알림 목록으로 채널별 요약 생성 (메시지 탭용)
export function buildChannelSummaries(notifications: Notification[]): ChannelSummary[] {
  const map = new Map<string, ChannelSummary>()

  for (const n of notifications) {
    const key = `${n.integrationId}:${n.channel ?? '__dm__'}`
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        integrationId: n.integrationId,
        provider: n.provider,
        workspaceName: n.provider ? n.provider.charAt(0).toUpperCase() + n.provider.slice(1) : '메시지',
        channelName: n.channel ?? 'DM',
        counts: { critical: 0, high: 0, medium: 0, low: 0 },
        latestAt: n.createdAt,
      })
    }
    const summary = map.get(key)!
    summary.counts[n.priority]++
    if (n.createdAt > summary.latestAt) summary.latestAt = n.createdAt
  }

  return Array.from(map.values()).sort((a, b) => b.latestAt.localeCompare(a.latestAt))
}

// 알림의 원문(originalContent)을 채팅방 좌측 메시지 목록으로 변환
export function toChatMessages(notifications: Notification[]): ChatMessage[] {
  return [...notifications]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((n) => ({
      id: n.id,
      author: n.actor ?? '알 수 없음',
      content: n.originalContent,
      createdAt: n.createdAt,
      notificationId: n.id,
      priorityBar: n.priority,
      isScheduleRelated: n.isScheduleRelated,
      calendarStatus: n.calendarStatus,
      calendarEventUrl: n.calendarEventUrl,
    }))
}

// ─── API 함수 ─────────────────────────────────────────────────────────────────

/** 알림 목록 조회 */
export async function getNotifications(): Promise<Notification[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/notifications`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json() as { notifications: BackendNotification[] }
    return (data.notifications ?? []).map(toNotification)
  } catch {
    return []
  }
}

/** 브리핑 전체 목록 조회 (최신순) */
export async function getBriefings(): Promise<BackendBriefing[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/briefings?user_id=${TEMP_USER_ID}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json() as { items: BackendBriefing[] }
    return data.items ?? []
  } catch {
    return []
  }
}

/** 브리핑 상세 조회 */
export async function getBriefingById(id: string): Promise<BackendBriefing | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/briefings/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json() as Promise<BackendBriefing>
  } catch {
    return null
  }
}
