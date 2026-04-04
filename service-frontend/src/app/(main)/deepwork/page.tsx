// [백엔드 연결] 이 페이지의 초기 데이터를 백엔드 API에서 가져오도록 변경하세요.
// 이 파일은 서버 컴포넌트이므로 async/await를 바로 사용할 수 있습니다.
//
// ─── 실제 백엔드 연결 시 체크리스트 ────────────────────────────────────────
//
// 1. mockNotifications import 제거
//
// 2. 보류 중인 알림 수 조회 API 호출
//    예) const { pendingCount } = await fetch('https://api.example.com/notifications/pending-count', {
//          headers: { Authorization: `Bearer ${token}` },
//        }).then((res) => res.json())
//
// 3. 긴급(critical) 알림 목록 조회 API 호출
//    예) const urgentNotifications = await fetch('https://api.example.com/notifications?priority=critical&status=unread', {
//          headers: { Authorization: `Bearer ${token}` },
//        }).then((res) => res.json())
//
// 4. 집중모드 진행 중 실시간 알림은 DeepWorkClient에서 polling 또는 WebSocket으로 처리
//    - polling 예시: setInterval(() => fetchUrgentNotifications(), 30_000)
//    - WebSocket 예시: ws://api.example.com/ws/notifications?priority=critical
//
// 5. 집중 세션 시작/종료 API는 DeepWorkClient.tsx의 [백엔드 연결] 주석을 참고하세요.
// ────────────────────────────────────────────────────────────────────────────

import { mockNotifications } from '@/mocks' // [백엔드 연결] 삭제
import DeepWorkClient from '@/components/ui/DeepWorkClient'

export default function DeepWorkPage() {
  // [백엔드 연결] mockNotifications → GET /notifications?priority=critical&status=unread API 응답으로 교체
  const urgentNotifications = mockNotifications.filter((n) => n.priority === 'critical')

  // [백엔드 연결] mockNotifications → GET /notifications/pending-count API 응답으로 교체
  // 보류 알림 = critical이 아닌 unread 알림 수
  const pendingCount = mockNotifications.filter(
    (n) => n.priority !== 'critical' && n.status === 'unread'
  ).length

  return (
    <DeepWorkClient
      initialUrgentNotifications={urgentNotifications}
      initialPendingCount={pendingCount}
    />
  )
}
