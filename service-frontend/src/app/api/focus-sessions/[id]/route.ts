// 집중 세션 종료 프록시
// 백엔드: PATCH /api/v1/focus-sessions/{session_id}

type RouteParams = Promise<{ id: string }>

export async function PATCH(_request: Request, { params }: { params: RouteParams }) {
  const { id } = await params
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const res = await fetch(`${backendUrl}/api/v1/focus-sessions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
