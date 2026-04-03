/** 플랫폼 연동(Integration) 관련 공통 타입 정의 */

export type IntegrationProvider = 'slack' | 'jira' | 'discord' | 'gmail'

// connecting = 초기설정 화면에서 연결 진행 중 상태
export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'connecting'

// 연동 계정 단건 (초기설정 화면 카드, 설정 목록)
export interface IntegrationAccount {
  id: string
  provider: IntegrationProvider
  workspaceId: string
  workspaceName: string | null
  status: IntegrationStatus
  createdAt: string         // ISO 8601
}

// 초기설정 화면 워크스페이스 연결 모달 입력값
export interface IntegrationConnectForm {
  provider: IntegrationProvider
  workspaceUrl: string
}
