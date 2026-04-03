/** 브리핑(Briefing) 및 집중 세션(FocusSession) mock 데이터 */

import type { Briefing, BriefingDetail, FocusSession } from '@/types'
import { mockNotifications } from './notifications'

export const mockFocusSessions: FocusSession[] = [
  {
    id: 'session-001',
    plannedDurationMinutes: 90,
    startedAt: '2026-04-03T09:00:00Z',
    endedAt: '2026-04-03T10:30:00Z',
    status: 'completed',
  },
  {
    id: 'session-002',
    plannedDurationMinutes: 60,
    startedAt: '2026-04-03T14:00:00Z',
    endedAt: null,
    status: 'active',
  },
]

export const mockBriefings: Briefing[] = [
  {
    id: 'briefing-001',
    sessionId: 'session-001',
    title: '오전 집중 세션 브리핑 - Q1 예산 및 프로덕션 이슈',
    content:
      '오전 집중 세션 동안 2건의 긴급 알림이 발생했습니다. Q1 예산 최종 승인 요청과 프로덕션 서버 응답 지연 이슈가 핵심입니다. 디자인 리뷰 일정 변경도 확인이 필요합니다.',
    actionItems: [
      'Q1 예산 스프레드시트 확인 후 오늘 중 반응 남기기',
      '프로덕션 서버 응답 지연 원인 파악 및 온콜팀과 공유',
      '디자인 리뷰 일정 변경 캘린더 업데이트',
    ],
    highlights: ['notif-001', 'notif-002', 'notif-003'],
    criticalCount: 2,
    highCount: 3,
    mediumCount: 3,
    generatedAt: '2026-04-03T10:30:00Z',
  },
  {
    id: 'briefing-002',
    sessionId: 'session-001',
    title: '어제 오후 세션 브리핑 - PR 리뷰 및 스프린트',
    content:
      'PR 리뷰 요청 1건과 백로그 우선순위 조정 논의가 있었습니다. 스프린트 회고 자료 공유 요청도 대기 중입니다.',
    actionItems: [
      'COCO-142 인증 미들웨어 PR 코드 리뷰',
      'COCO-138 백로그 우선순위 PM과 협의',
    ],
    highlights: ['notif-005', 'notif-008'],
    criticalCount: 0,
    highCount: 2,
    mediumCount: 1,
    generatedAt: '2026-04-02T18:00:00Z',
  },
  {
    id: 'briefing-003',
    sessionId: 'session-002',
    title: '오후 집중 세션 브리핑 - 팀 소식 및 공지',
    content: '긴급 사항은 없으며 팀 워크샵 일정 투표 및 온보딩 문서 검토 요청이 있습니다.',
    actionItems: [
      '4월 팀 워크샵 날짜 투표 참여',
      '신규 온보딩 문서 검토 및 피드백 전달',
    ],
    highlights: ['notif-006', 'notif-007'],
    criticalCount: 0,
    highCount: 0,
    mediumCount: 2,
    generatedAt: '2026-04-03T15:00:00Z',
  },
]

export const mockBriefingDetail: BriefingDetail = {
  ...mockBriefings[0],
  relatedNotifications: mockNotifications.slice(0, 5),
}
