// 집중 세션 시작 프록시
// 백엔드: POST /api/v1/focus-sessions { user_id, planned_duration_minutes }
// 응답: { id: number, ... }

import { TEMP_USER_ID } from '@/lib/api'

export async function POST(request: Request) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const body = await request.json() as { plannedDurationMinutes: number }

  const res = await fetch(`${backendUrl}/api/v1/focus-sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: TEMP_USER_ID,
      planned_duration_minutes: body.plannedDurationMinutes,
    }),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
