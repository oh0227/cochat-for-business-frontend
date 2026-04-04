/** 채팅방 메시지 목업 데이터 */

import type { ChatMessage } from '@/types'

// 채널 ID → 메시지 배열 맵
export const mockChatMessages: Record<string, ChatMessage[]> = {
  'ch-001': [
    {
      id: 'msg-001',
      author: '박지호',
      content: '안녕하세요! 오늘 오후 디자인 리뷰 일정 공유드립니다.',
      createdAt: '2026-04-03T07:50:00Z',
    },
    {
      id: 'msg-002',
      author: '이서연',
      content: '네, 확인했어요. 몇 시로 잡혀 있나요?',
      createdAt: '2026-04-03T07:55:00Z',
    },
    {
      id: 'msg-003',
      author: '박지호',
      content: '일정이 변경되었습니다. 내일 오전 10시로 조정되었으니 참고해주세요.',
      createdAt: '2026-04-03T08:08:00Z',
      notificationId: 'notif-003',
      priorityBar: 'high',
    },
    {
      id: 'msg-004',
      author: '김민준',
      content:
        '안녕하세요 팀원 여러분,\n\nQ1 예산안 최종 승인 건으로 연락드립니다. 재무팀에서 오늘까지 각 팀의 최종 확인이 필요하다고 합니다. 아래 스프레드시트 링크에서 본인 팀 항목을 검토하고 이상 없으면 ✅ 이모지로 반응해주세요.\n\n링크: https://docs.example.com/q1-budget\n\n감사합니다.',
      createdAt: '2026-04-03T08:12:00Z',
      notificationId: 'notif-001',
      priorityBar: 'critical',
    },
    {
      id: 'msg-005',
      author: '최유진',
      content: '스프린트 회고 자료 언제까지 공유해드리면 될까요?',
      createdAt: '2026-04-03T09:20:00Z',
    },
    {
      id: 'msg-006',
      author: '한소희',
      content: '신규 온보딩 문서 초안 작성했습니다. 검토 부탁드립니다.',
      createdAt: '2026-04-03T09:30:00Z',
      notificationId: 'notif-006',
      priorityBar: 'medium',
    },
    {
      id: 'msg-007',
      author: '정태양',
      content: 'COCO-142 PR 리뷰 요청드립니다. 인증 미들웨어 개선 작업입니다.',
      createdAt: '2026-04-03T10:00:00Z',
    },
    {
      id: 'msg-008',
      author: '오지민',
      content: '4월 팀 워크샵 날짜 투표 링크 공유드려요. 참여 부탁드립니다!',
      createdAt: '2026-04-03T10:30:00Z',
      notificationId: 'notif-007',
      priorityBar: 'medium',
    },
    {
      id: 'msg-009',
      author: '운영팀',
      content: '사내 도서관 신규 도서 목록이 업데이트되었습니다.',
      createdAt: '2026-04-03T11:00:00Z',
      notificationId: 'notif-009',
      priorityBar: 'low',
    },
    {
      id: 'msg-010',
      author: '이서연',
      content: '오늘 오전 회의 내용 정리해서 공유드립니다. 다음 스프린트 계획도 포함되어 있으니 확인 부탁드려요.',
      createdAt: '2026-04-03T11:30:00Z',
    },
  ],
  'ch-002': [
    {
      id: 'msg-101',
      author: '최유진',
      content: '프론트엔드 배포 작업 시작합니다.',
      createdAt: '2026-04-03T09:00:00Z',
    },
    {
      id: 'msg-102',
      author: '정태양',
      content: '배포 전 PR 머지 확인 부탁드립니다.',
      createdAt: '2026-04-03T09:10:00Z',
      notificationId: 'notif-004',
      priorityBar: 'high',
    },
    {
      id: 'msg-103',
      author: '이서연',
      content: '확인했습니다. 머지 완료했어요.',
      createdAt: '2026-04-03T09:15:00Z',
    },
  ],
  'ch-003': [
    {
      id: 'msg-201',
      author: '운영팀',
      content: '이번 주 공지사항 공유드립니다.',
      createdAt: '2026-04-02T10:00:00Z',
    },
    {
      id: 'msg-202',
      author: '운영팀',
      content: '사내 도서관 신규 도서 목록 안내드립니다.',
      createdAt: '2026-04-02T12:00:00Z',
      notificationId: 'notif-009',
      priorityBar: 'low',
    },
  ],
  'ch-004': [
    {
      id: 'msg-301',
      author: '김민준',
      content: '온보딩 문서 최신화 작업 중입니다.',
      createdAt: '2026-04-03T10:00:00Z',
    },
    {
      id: 'msg-302',
      author: '한소희',
      content: '초안 검토 부탁드립니다.',
      createdAt: '2026-04-03T11:00:00Z',
      notificationId: 'notif-006',
      priorityBar: 'medium',
    },
  ],
  'ch-005': [
    {
      id: 'msg-401',
      author: '오지민',
      content: '팀 워크샵 날짜 투표 진행 중입니다.',
      createdAt: '2026-04-03T09:00:00Z',
      notificationId: 'notif-007',
      priorityBar: 'critical',
    },
    {
      id: 'msg-402',
      author: '최유진',
      content: '투표 완료했습니다!',
      createdAt: '2026-04-03T09:30:00Z',
    },
  ],
}

/** 채팅방 우측 패널용 알림 ID → 채널 메시지 ID 맵 */
export const mockChatRoomNotificationIds: Record<string, string[]> = {
  'ch-001': ['notif-001', 'notif-003', 'notif-006', 'notif-007', 'notif-009'],
  'ch-002': ['notif-004', 'notif-005'],
  'ch-003': ['notif-009'],
  'ch-004': ['notif-006'],
  'ch-005': ['notif-007'],
}
