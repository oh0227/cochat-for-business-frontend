// [백엔드 연결] 이 파일 전체는 실제 백엔드가 준비되기 전까지 사용하는 목업 Route Handler입니다.
// 백엔드 API가 완성되면 이 파일을 삭제하고,
// src/components/ui/BriefingListClient.tsx의 fetch URL을 실제 백엔드 엔드포인트로 교체하세요.
//
// ─── 실제 백엔드 연결 시 체크리스트 ────────────────────────────────────────
//
// 1. 이 파일(route.ts) 삭제
//
// 2. BriefingListClient.tsx > generateBriefing()
//    - fetch URL을 실제 백엔드 엔드포인트로 교체
//      예) '/api/briefings/generate' → 'https://api.example.com/briefings/generate'
//    - 인증이 필요한 경우 Authorization 헤더 추가
//      예) 'Authorization': `Bearer ${token}`
//
// 3. 요청 body 스펙 확인
//    - 현재: { sinceAt: string }  ← 마지막 브리핑 generatedAt (ISO 8601)
//    - 백엔드 스펙에 따라 필드명/형식이 다를 경우 body 수정
//
// 4. 응답 스펙 확인 및 타입 수정
//    - 현재 가정: { briefing: Briefing, providerCounts: Record<NotificationProvider, number> }
//    - 백엔드가 providerCounts를 내려주지 않는다면:
//      BriefingListClient.tsx > handleGetBriefing() 안에서
//      getProviderCounts(result.briefing.highlights) 로 직접 계산하도록 변경
//    - 백엔드 응답의 필드명이 다를 경우 GenerateBriefingResponse 인터페이스 수정
//
// 5. 에러 처리 확인
//    - 현재: res.ok 체크 후 res.text()를 에러 메시지로 사용
//    - 백엔드가 JSON 에러 응답을 내려준다면 res.json()으로 파싱 후 message 필드 추출하도록 수정
// ────────────────────────────────────────────────────────────────────────────

import type { Briefing, NotificationProvider } from '@/types'
import { mockNotifications } from '@/mocks' // [백엔드 연결] 삭제

export async function POST(request: Request) {
  const body = await request.json() as { sinceAt: string }
  const sinceAt = new Date(body.sinceAt)

  // [백엔드 연결] 아래 목업 로직 전체를 삭제합니다.
  // 실제 백엔드는 sinceAt 이후의 알림을 DB에서 조회해 AI로 분석한 뒤 브리핑을 생성합니다.

  // sinceAt 이후의 알림만 필터링
  const newNotifications = mockNotifications.filter( // [백엔드 연결] 삭제
    (n) => new Date(n.createdAt) > sinceAt
  )

  if (newNotifications.length === 0) {
    return Response.json(
      { error: '마지막 브리핑 이후 새로운 알림이 없습니다.' },
      { status: 422 }
    )
  }

  const criticalCount = newNotifications.filter((n) => n.priority === 'critical').length
  const highCount = newNotifications.filter((n) => n.priority === 'high').length
  const mediumCount = newNotifications.filter((n) => n.priority === 'medium').length

  const now = new Date().toISOString()

  // [백엔드 연결] 아래 briefing 객체는 목업입니다. 실제 백엔드 응답으로 대체됩니다.
  const briefing: Briefing = {
    id: `briefing-mock-${Date.now()}`,
    sessionId: 'session-mock',
    title: `새 브리핑 - ${new Date().toLocaleDateString('ko-KR')} 분석`,
    content: `${newNotifications.length}건의 새 알림이 분석되었습니다. 긴급 ${criticalCount}건, 중요 ${highCount}건, 보통 ${mediumCount}건이 포함되어 있습니다.`,
    actionItems: newNotifications
      .filter((n) => n.priority === 'critical' || n.priority === 'high')
      .slice(0, 3)
      .map((n) => n.summary),
    highlights: newNotifications.map((n) => n.id),
    criticalCount,
    highCount,
    mediumCount,
    generatedAt: now,
  }

  // [백엔드 연결] providerCounts를 백엔드가 직접 내려준다면 아래 계산 로직은 삭제합니다.
  const providerCounts: Partial<Record<NotificationProvider, number>> = {}
  for (const n of newNotifications) {
    if (!n.provider) continue
    providerCounts[n.provider] = (providerCounts[n.provider] ?? 0) + 1
  }

  return Response.json({ briefing, providerCounts })
}
