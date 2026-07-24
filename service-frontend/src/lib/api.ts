/**
 * 백엔드 API 클라이언트 (서버 컴포넌트 전용)
 *
 * 클라이언트 컴포넌트에서 백엔드를 호출할 때는
 * src/app/api/** 의 Next.js Route Handler를 프록시로 사용하세요.
 */

import type { Notification, NotificationPriority, NotificationStatus, ChannelSummary, ChatMessage } from '@/types'
import { formatDate } from '@/utils'

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
  priority: string
  original_text: string
  summary: string
  reason: string
  occurred_at: string
  source_url: string | null
  is_direct_target: boolean
  status: NotificationStatus
  created_at: string
}

const KNOWN_PRIORITIES: NotificationPriority[] = ['critical', 'high', 'medium', 'low']

/** 백엔드 priority(대문자 시작, 예: "High")를 프론트 표준(소문자)으로 정규화 */
function normalizePriority(raw: string): NotificationPriority {
  const lowered = raw.toLowerCase()
  return (KNOWN_PRIORITIES as string[]).includes(lowered)
    ? (lowered as NotificationPriority)
    : 'low'
}

interface BackendBriefing {
  briefing_id: number
  session_id: number
  content: string
  generated_at: string
}

/** 백엔드가 브리핑 제목을 내려주지 않아 생성 시각 기준으로 제목을 만든다 */
export function buildBriefingTitle(generatedAt: string): string {
  return `${formatDate(generatedAt)} 브리핑`
}

// ─── 변환 함수 ───────────────────────────────────────────────────────────────

function toNotification(raw: BackendNotification): Notification {
  return {
    id: String(raw.id),
    // integrationId/rawEventId/provider: 백엔드가 아직 내려주지 않음 (issue #5)
    priority: normalizePriority(raw.priority),
    summary: raw.summary,
    originalContent: raw.original_text,
    actor: raw.sender_name,
    channel: raw.channel_name,
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
