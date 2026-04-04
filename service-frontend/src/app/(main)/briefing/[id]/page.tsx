// [백엔드 연결] 브리핑 상세 데이터를 백엔드 API에서 가져오도록 변경하세요.
// 이 파일은 서버 컴포넌트이므로 async/await를 바로 사용할 수 있습니다.
//
// ─── 실제 백엔드 연결 시 체크리스트 ────────────────────────────────────────
//
// 1. mockBriefings, mockNotifications import 제거
//
// 2. 브리핑 상세 API 호출로 교체
//    예) const briefing = await fetch(`https://api.example.com/briefings/${id}`, {
//          headers: { Authorization: `Bearer ${token}` },
//        }).then((res) => res.json())
//    - id가 존재하지 않으면 notFound()를 그대로 호출하면 됩니다.
//
// 3. 관련 알림 데이터 처리
//    - 백엔드가 BriefingDetail.relatedNotifications를 포함해 한 번에 내려준다면
//      notifications 변수를 별도로 계산할 필요 없이 briefing.relatedNotifications를 사용하세요.
//    - 별도 API로 분리되어 있다면 Promise.all로 병렬 호출하세요.
//      예) const [briefing, notifications] = await Promise.all([
//            fetchBriefing(id),
//            fetchNotifications(id),
//          ])
//
// 4. 인증 토큰 주입 방법
//    - next/headers의 cookies()로 쿠키에서 토큰 추출
//    - 또는 미들웨어에서 헤더로 주입
// ────────────────────────────────────────────────────────────────────────────

import { notFound } from 'next/navigation'
import { mockBriefings, mockNotifications } from '@/mocks' // [백엔드 연결] 삭제
import BriefingDetailView from '@/components/ui/BriefingDetailView'

export default async function BriefingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // [백엔드 연결] mockBriefings.find(...) → GET /briefings/:id API 호출로 교체하세요.
  const briefing = mockBriefings.find((b) => b.id === id)
  if (!briefing) notFound()

  // [백엔드 연결] 백엔드가 relatedNotifications를 포함해 내려준다면 이 라인을 삭제하고
  // briefing.relatedNotifications를 그대로 사용하세요.
  const notifications = mockNotifications.filter((n) => briefing.highlights.includes(n.id))

  return <BriefingDetailView briefing={briefing} notifications={notifications} />
}
