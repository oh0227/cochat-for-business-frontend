/** 브리핑 및 집중 세션(FocusSession) 관련 공통 타입 정의 */

import type { Notification } from './notification'

export type FocusSessionStatus = 'active' | 'completed' | 'cancelled'

// 집중 세션
export interface FocusSession {
  id: string
  plannedDurationMinutes: number | null  // 30 | 60 | 90 | null(커스텀)
  startedAt: string
  endedAt: string | null
  status: FocusSessionStatus
}

// 브리핑 목록 카드용
export interface Briefing {
  id: string
  sessionId: string
  title: string             // AI 생성 브리핑 제목
  content: string           // AI 생성 전체 요약
  actionItems: string[]     // 조치 필요 항목 리스트
  highlights: string[]      // 주요 알림 ID 목록
  criticalCount: number     // 브리핑 카드 배지용
  highCount: number
  mediumCount: number
  generatedAt: string
}

// 브리핑 상세 페이지용
export interface BriefingDetail extends Briefing {
  relatedNotifications: Notification[]
}

// 집중모드 화면 - 집중 중 긴급알림 섹션용
export interface UrgentNotificationGroup {
  count: number
  notifications: Notification[]
}
