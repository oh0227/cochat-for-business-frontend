// [백엔드 연결] 브리핑 목록 초기 데이터를 백엔드 API에서 가져오도록 변경하세요.
// 이 파일은 서버 컴포넌트이므로 async/await를 바로 사용할 수 있습니다.
//
// ─── 실제 백엔드 연결 시 체크리스트 ────────────────────────────────────────
//
// 1. mockBriefings, mockNotifications import 제거
//
// 2. 브리핑 목록 API 호출 추가 (함수를 async로 변경)
//    예) const briefings = await fetch('https://api.example.com/briefings', {
//          headers: { Authorization: `Bearer ${token}` },
//        }).then((res) => res.json())
//
// 3. 인증 토큰 주입 방법
//    - next/headers의 cookies()로 쿠키에서 토큰 추출
//    - 또는 미들웨어에서 헤더로 주입
//
// 4. getProviderCounts() 함수 처리
//    - 백엔드가 providerCounts를 직접 내려준다면 이 함수를 삭제하고
//      API 응답 값을 그대로 사용하세요.
//    - 백엔드가 highlights(알림 ID 배열)만 내려준다면 이 함수를 유지하되
//      내부의 mockNotifications 조회를 실제 알림 API 호출로 교체하세요.
//
// 5. 목록 정렬 기준: generatedAt 내림차순(최신순)을 백엔드에서 보장해야 합니다.
//    프론트의 [브리핑 받기] 버튼은 items[0].generatedAt을 기준으로 동작합니다.
// ────────────────────────────────────────────────────────────────────────────

import { mockBriefings, mockNotifications } from '@/mocks' // [백엔드 연결] 삭제
import type { NotificationProvider } from '@/types'
import BriefingListClient, { type BriefingItem } from '@/components/ui/BriefingListClient'

// [백엔드 연결] 백엔드가 providerCounts를 직접 내려준다면 이 함수를 삭제하세요.
// 백엔드가 highlights(알림 ID 배열)만 내려준다면 내부 mockNotifications를 실제 데이터로 교체하세요.
function getProviderCounts(highlightIds: string[]): Partial<Record<NotificationProvider, number>> {
  const counts: Partial<Record<NotificationProvider, number>> = {}
  for (const id of highlightIds) {
    const notification = mockNotifications.find((n) => n.id === id) // [백엔드 연결] 실제 알림 데이터 조회로 교체
    if (!notification) continue
    counts[notification.provider] = (counts[notification.provider] ?? 0) + 1
  }
  return counts
}

export default function BriefingPage() {
  // [백엔드 연결] mockBriefings → GET /briefings API 응답 데이터로 교체하세요.
  const initialItems: BriefingItem[] = mockBriefings.map((briefing) => ({
    briefing,
    providerCounts: getProviderCounts(briefing.highlights),
  }))

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      <BriefingListClient initialItems={initialItems} />
    </div>
  )
}
