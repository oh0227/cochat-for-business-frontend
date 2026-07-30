// 활성 집중 세션 조회 프록시
// 백엔드: GET /api/v1/focus-sessions/active?user_id= (활성 세션 없으면 404)

import { TEMP_USER_ID } from '@/lib/api'

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const res = await fetch(`${backendUrl}/api/v1/focus-sessions/active?user_id=${TEMP_USER_ID}`)

  if (res.status === 404) {
    return new Response(null, { status: 404 })
  }

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
