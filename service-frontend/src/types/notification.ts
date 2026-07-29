/** 알림(Notification) 관련 공통 타입 정의 */

// Priority 레벨 - 대시보드 카운트 카드, 메시지 배지, 필터 탭에 사용
// critical(긴급/빨강), high(중요/주황), medium(보통/파랑), low(일반/회색)
export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low'

// 읽음 상태
export type NotificationStatus = 'unread' | 'read' | 'snoozed'

// 연동 플랫폼
export type NotificationProvider = 'slack' | 'jira' | 'discord' | 'gmail'

// 캘린더 등록 상태
// none: 일정 관련 아님 / pending: 일정 관련(낮은 긴급도), 조용히 누적 / prompted: 일정 관련(높은 긴급도), 즉시 등록 제안
// registered: 캘린더에 등록됨 / dismissed: 등록 제안을 거절함
export type CalendarStatus = 'none' | 'pending' | 'prompted' | 'registered' | 'dismissed'

// 알림 단건
// NOTE: rawEventId는 백엔드 GET /notifications 응답에 아직 포함되지 않아 optional로 둔다
export interface Notification {
  id: string
  integrationId?: string
  rawEventId?: string
  title: string             // 알림 제목 (백엔드 제공)
  priority: NotificationPriority
  summary: string           // AI 생성 한 줄 요약
  originalContent: string   // 원문 메시지 전체
  actor: string | null      // 발신자 (예: "@홍길동")
  channel: string | null    // 채널명, DM이면 null
  provider?: NotificationProvider
  status: NotificationStatus
  isScheduleRelated: boolean        // 일정 등록 후보 여부 (백엔드 AI 판별)
  calendarStatus: CalendarStatus
  calendarEventId: string | null    // 구글 캘린더 이벤트 ID (registered일 때만 값 있음)
  calendarEventUrl: string | null   // 구글 캘린더에서 보기 링크 (registered일 때만 값 있음)
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
