/**
 * 브리핑(Briefing) 백엔드 응답 매핑 (순수 함수, fetch 없음)
 *
 * 서버 컴포넌트(`lib/api.ts`)와 클라이언트 컴포넌트(`BriefingListClient.tsx`),
 * 프록시 라우트(`api/briefings/create/route.ts`)에서 공통으로 사용한다.
 */

import type { Briefing, Notification, NotificationProvider } from '@/types'
import { formatDate } from '@/utils'

export interface BackendBriefing {
  briefing_id: number
  session_id: number
  content: string
  generated_at: string
  critical_count: number
  high_count: number
  medium_count: number
  low_count: number
  action_items: string[]
  notification_ids: number[]
}

/** 백엔드가 브리핑 제목을 내려주지 않아 생성 시각 기준으로 제목을 만든다 */
export function buildBriefingTitle(generatedAt: string): string {
  return `${formatDate(generatedAt)} 브리핑`
}

/** 백엔드 배포 전이라 notification_ids가 아직 없을 수 있어 안전하게 꺼낸다 */
export function getNotificationIds(raw: BackendBriefing): number[] {
  return raw.notification_ids ?? []
}

export function toBriefing(raw: BackendBriefing): Briefing {
  return {
    id: String(raw.briefing_id),
    sessionId: String(raw.session_id),
    title: buildBriefingTitle(raw.generated_at),
    content: raw.content,
    actionItems: raw.action_items ?? [],
    highlights: getNotificationIds(raw).map(String),
    criticalCount: raw.critical_count ?? 0,
    highCount: raw.high_count ?? 0,
    mediumCount: raw.medium_count ?? 0,
    generatedAt: raw.generated_at,
  }
}

/** 알림 목록을 provider별 건수로 집계 (브리핑 카드 하단 아이콘용) */
export function buildProviderCounts(notifications: Notification[]): Partial<Record<NotificationProvider, number>> {
  const counts: Partial<Record<NotificationProvider, number>> = {}
  for (const n of notifications) {
    if (!n.provider) continue
    counts[n.provider] = (counts[n.provider] ?? 0) + 1
  }
  return counts
}
