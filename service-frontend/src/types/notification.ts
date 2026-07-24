/** 알림(Notification) 관련 공통 타입 정의 */

// Priority 레벨 - 대시보드 카운트 카드, 메시지 배지, 필터 탭에 사용
// critical(긴급/빨강), high(중요/주황), medium(보통/파랑), low(일반/회색)
export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low'

// 읽음 상태
export type NotificationStatus = 'unread' | 'read' | 'snoozed'

// 연동 플랫폼
export type NotificationProvider = 'slack' | 'jira' | 'discord' | 'gmail'

// 알림 단건
// NOTE: integrationId/rawEventId/provider는 백엔드 GET /notifications 응답에
// 아직 포함되지 않아 optional로 둔다 (백엔드 작업 필요, oh0227/cochat-for-business-frontend#5 참고)
export interface Notification {
  id: string
  integrationId?: string
  rawEventId?: string
  priority: NotificationPriority
  summary: string           // AI 생성 한 줄 요약
  originalContent: string   // 원문 메시지 전체
  actor: string | null      // 발신자 (예: "@홍길동")
  channel: string | null    // 채널명, DM이면 null
  provider?: NotificationProvider
  status: NotificationStatus
  createdAt: string         // ISO 8601
}

// 메시지 화면 우측 슬라이드 상세 패널용
export interface NotificationDetail extends Notification {
  aiSummary: string         // AI 상세 요약
  draftReply: string | null // AI 생성 답장 초안
  relatedNotificationIds: string[]
}

// 메시지 화면 필터 + 탭 상태
export interface NotificationFilter {
  priority?: NotificationPriority
  provider?: NotificationProvider
  integrationId?: string
  status?: NotificationStatus
  tab?: 'all' | 'critical' | 'high' | 'medium'
}

// 대시보드 상단 카운트 카드용
export interface NotificationSummary {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

// 메시지 화면 채널별 알림 요약
export interface ChannelSummary {
  id: string
  integrationId?: string
  provider?: NotificationProvider
  workspaceName: string
  channelName: string
  counts: {
    critical: number
    high: number
    medium: number
    low: number
  }
  latestAt: string // ISO 8601
}
