// 브리핑 생성 프록시
// 백엔드: POST /api/v1/briefings { session_id }
// 응답: 생성된 브리핑 객체

export async function POST(request: Request) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const body = await request.json() as { sessionId: number }

  const res = await fetch(`${backendUrl}/api/v1/briefings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: body.sessionId }),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
