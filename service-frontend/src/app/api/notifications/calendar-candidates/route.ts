// 일정 등록 후보(prompted/pending) 알림 목록 프록시.
// 오프라인 중 놓친 prompted 알림과 누적된 pending 알림을 캐치업할 때 사용.
// 백엔드: GET /api/v1/notifications/calendar-candidates

import { NextResponse } from 'next/server'
import { TEMP_USER_ID } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function GET() {
  const res = await fetch(`${BASE_URL}/api/v1/notifications/calendar-candidates`, {
    headers: { 'X-Cochat-User-Id': String(TEMP_USER_ID) },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '일정 등록 후보 조회에 실패했습니다.')
    return NextResponse.json({ error: text }, { status: res.status })
  }

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
