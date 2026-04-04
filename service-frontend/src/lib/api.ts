/**
 * 백엔드 API 클라이언트 (서버 컴포넌트 전용)
 *
 * 클라이언트 컴포넌트에서 백엔드를 호출할 때는
 * src/app/api/** 의 Next.js Route Handler를 프록시로 사용하세요.
 */

import type { Notification, NotificationPriority, NotificationProvider, NotificationStatus, ChannelSummary } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

// ─── 임시 user_id (인증 시스템 연동 후 제거) ────────────────────────────────
export const TEMP_USER_ID = 1

// ─── 백엔드 응답 타입 (snake_case) ───────────────────────────────────────────

interface BackendNotification {
  id: string
  integration_id: string
  raw_event_id: string
  priority: NotificationPriority
  summary: string
  actor: string | null
  channel: string | null
  provider: NotificationProvider
  status: NotificationStatus
  created_at: string
}

interface BackendBriefing {
  id: number
  session_id: number
  title: string
  content: string
  created_at: string
}

// ─── 변환 함수 ───────────────────────────────────────────────────────────────

function toNotification(raw: BackendNotification): Notification {
  return {
    id: raw.id,
    integrationId: raw.integration_id,
    rawEventId: raw.raw_event_id,
    priority: raw.priority,
    summary: raw.summary,
    actor: raw.actor,
    channel: raw.channel,
    provider: raw.provider,
    status: raw.status,
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
        workspaceName: n.provider.charAt(0).toUpperCase() + n.provider.slice(1),
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

/** 최신 브리핑 조회 */
export async function getLatestBriefing(): Promise<BackendBriefing | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/briefings/latest?user_id=${TEMP_USER_ID}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return res.json() as Promise<BackendBriefing>
  } catch {
    return null
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
