// 자체 캘린더 일정 수정 프록시
// 백엔드: PATCH /api/v1/calendar-events/{event_id} (인증은 헤더가 아니라 user_id 쿼리 파라미터)

import { TEMP_USER_ID } from '@/lib/api'

type RouteParams = Promise<{ id: string }>

export async function PATCH(request: Request, { params }: { params: RouteParams }) {
  const { id } = await params
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const body = await request.json()

  const res = await fetch(`${backendUrl}/api/v1/calendar-events/${id}?user_id=${TEMP_USER_ID}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
