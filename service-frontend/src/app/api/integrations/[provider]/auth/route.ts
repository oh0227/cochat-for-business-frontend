// 백엔드의 OAuth URL 발급 엔드포인트를 프록시합니다.
// 백엔드 엔드포인트: GET /api/v1/integrations/{provider}/oauth-url
// 응답: { url: string }

import { toOAuthRouteSlug } from '@/lib/integrationProvider'

type RouteParams = Promise<{ provider: string }>

export async function GET(request: Request, { params }: { params: RouteParams }) {
  const { provider } = await params
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    return Response.json({ error: 'NEXT_PUBLIC_BACKEND_URL이 설정되지 않았습니다.' }, { status: 500 })
  }

  try {
    const res = await fetch(`${backendUrl}/api/v1/integrations/${toOAuthRouteSlug(provider)}/oauth-url`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text()
      return Response.json({ error: `백엔드 오류: ${text}` }, { status: res.status })
    }

    const data = await res.json() as { url: string }
    return Response.json(data)
  } catch (e) {
    return Response.json({ error: `백엔드 연결 실패: ${String(e)}` }, { status: 502 })
  }
}
