// 자체 캘린더 일정 목록 조회/생성 프록시
// 백엔드: GET/POST /api/v1/calendar-events (인증은 헤더가 아니라 user_id 쿼리 파라미터)
// Google Calendar 미연동 유저는 404 { "detail": "구글 캘린더 연동이 필요합니다." }

import { TEMP_USER_ID } from '@/lib/api'

export async function GET(request: Request) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const res = await fetch(
    `${backendUrl}/api/v1/calendar-events?user_id=${TEMP_USER_ID}&from=${from}&to=${to}`,
    { cache: 'no-store' },
  )

  const data = await res.json()
  return Response.json(data, { status: res.status })
}

export async function POST(request: Request) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const body = await request.json()

  const res = await fetch(`${backendUrl}/api/v1/calendar-events?user_id=${TEMP_USER_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
